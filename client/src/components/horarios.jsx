import React, { useState, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import "../styles/horarios.css";
import socket from "../utils/socket"; // Import the socket instance
import { useSocket } from "../utils/useSocket";
import { useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import * as XLSX from "xlsx";
import Papa from "papaparse";

// Days of the week
const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
// Generate time slots from 08:30 to 24:00 in 30-minute intervals
const horas = Array.from({ length: 31 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2); // The start hour
  const minutes = i % 2 === 0 ? "00" : "30"; // Alternates between 00 and 30 minutes
  const start = `${hour.toString().padStart(2, "0")}:${minutes}`; // Format start time
  const endHour = minutes === "30" ? hour + 1 : hour; // End hour is the next hour if start is :30
  const endMinutes = minutes === "30" ? "00" : "30"; // End minutes is 00 if start is :30
  const end = `${endHour.toString().padStart(2, "0")}:${endMinutes}`; // Format end time
  return `${start} - ${end}`;
});

// Draggable class box
function Draggable({ id, children, isBlocked, aulaInfo, durationBlocks }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { aulaInfo },
    disabled: isBlocked,
  });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: isBlocked ? "not-allowed" : "grab",
    height: "100%", // Ensure the draggable spans the full height of the cell
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="aula"
    >
      {children}
    </div>
  );
}

// Droppable cell
function Droppable({ id, children, isBlocked }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const style = {
    backgroundColor: isOver && !isBlocked ? "lightblue" : undefined,
  };
  return (
    <div ref={setNodeRef} style={style} className="empty-slot">
      {children}
    </div>
  );
}

// Main component
function Horarios() {
  const location = useLocation();
  const path = location.pathname;
  console.log("Path:", path);
  // lista das aulas marcadas
  const { aulasMarcadas } = useSocket();
  // aulas disponíveis
  const [aulasDisponiveis, setAulasDisponiveis] = useState([]); // Lista de aulas disponiveis
  const [newAula, setNewAula] = useState({ subject: "", location: "", duration: 30 });
  const [isBlocked, setIsBlocked] = useState(false); // State to block the schedule
  const [erro, setErro] = useState(""); // State for error messages
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingAula, setEditingAula] = useState(null);
  let escolaPath;
  if (path === "/horariosESTT") {
    escolaPath = "ESTT";
  } else if (path === "/horariosESGT") {
    escolaPath = "ESGT";
  } else if (path === "/horariosESTA") {
    escolaPath = "ESTA";
  } else {
    escolaPath = "";
  }
  console.log(escolaPath);
  // Filters
  const [escola, setEscola] = useState(escolaPath);
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [turma, setTurma] = useState("");
  // Add a search state and input field for filtering available classes
  const [searchQuery, setSearchQuery] = useState("");

  // Filter available classes based on the search query
  const filteredAulasDisponiveis = aulasDisponiveis.filter((aula) =>
    aula.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

 const calculateEndTime = (startTime, duration) => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
};

// Gerar código único (simulação simples)
let nextCode = 1;
const generateUniqueCode = () => nextCode++;

const handleDragEnd = (event) => {
  const { active, over } = event;

  if (!over) {
    alert("Dropped outside the schedule");
    if (active.id.startsWith("marcada_")) {
      const originalAula = active.data.current.aulaInfo;
      socket.emit("update-aulas", (prev) => [...prev, originalAula]);
    }
    return;
  }

  if (over.id === "aulas-disponiveis") {
    if (active.id.startsWith("marcada_")) {
      const originalAula = active.data.current.aulaInfo;
      setAulasDisponiveis((prev) => [
        ...prev,
        {
          id: (prev[prev.length - 1]?.id || 0) + 1,
          subject: originalAula.subject,
          location: originalAula.location,
          duration: originalAula.duration,
        },
      ]);
      socket.emit("remove-aula", { codAula: originalAula.Cod_Aula });
    }
    return;
  }

  const [day, start] = over.id.split("-");
  const startIndex = horas.findIndex((hora) => hora.startsWith(start));

  // Verificar sobreposição
  const overlappingClass = aulasMarcadas.some((cls) => {
    if (cls.Cod_Aula === active.data.current?.aulaInfo?.Cod_Aula) return false;
    
    const classStartIndex = horas.findIndex((h) => h.startsWith(cls.start));
    const classEndIndex = classStartIndex + cls.duration / 30;
    
    return (
      cls.day === day &&
      ((startIndex >= classStartIndex && startIndex < classEndIndex) ||
        (startIndex + active.data.current.aulaInfo.duration / 30 > classStartIndex &&
          startIndex + active.data.current.aulaInfo.duration / 30 <= classEndIndex))
    );
  });

  if (overlappingClass) {
    alert("Sobreposição detectada!");
    if (active.id.startsWith("marcada_")) {
      socket.emit("update-aulas", (prev) => [...prev, active.data.current.aulaInfo]);
    }
    return;
  }

  // Adicionar nova aula
  if (active.id.startsWith("disponivel_")) {
    const aulaInfo = active.data.current.aulaInfo;
    const newAula = {
      Cod_Aula: generateUniqueCode(), // Código único
      day,
      start,
      end: calculateEndTime(start, aulaInfo.duration), // Calcula horário final
      subject: aulaInfo.subject,
      location: aulaInfo.location,
      duration: aulaInfo.duration,
    };
    socket.emit("add-aula", { newAula });
    setAulasDisponiveis((prev) => prev.filter((a) => a.id !== aulaInfo.id));

  // Atualizar aula existente
  } else if (active.id.startsWith("marcada_")) {
    const aulaInfo = active.data.current.aulaInfo;
    const updatedAula = {
      ...aulaInfo,
      day,
      start,
      end: calculateEndTime(start, aulaInfo.duration), // Atualiza horário final
    };
    socket.emit("update-aula", updatedAula);
  }
};

  const openEditPopup = (aula) => {
    setEditingAula(aula);
    setShowEditPopup(true);
  };

  const saveEditedAula = () => {
    if (editingAula) {
      socket.emit("update-aula", {
        codAula: editingAula.Cod_Aula,
        newSubject: editingAula.subject,
        newLocation: editingAula.location,
        newDuration: editingAula.duration,
      });
      setShowEditPopup(false);
      setEditingAula(null);
    }
  };

  const deleteAula = (codAula) => {
    socket.emit("delete-aula", { codAula });
    setShowEditPopup(false);
  };

  const handleAulaChange = (event) => {
    const aulaId = event.target.value;
    const aula = aulasMarcadas.find((a) => a.Cod_Aula === aulaId);
    setEditingAula(aula);
  };

  // Function to add a new class
  const addClass = () => {
    // add newAula to disponiveis
    setAulasDisponiveis((prev) => [
      ...prev,
      {
        id: aulasDisponiveis.length + 1,
        subject: newAula.subject,
        location: newAula.location,
        duration: newAula.duration,
      },
    ]);
    // clear newAula
    setNewAula({ subject: "", location: "", duration: 30 });
    // clear popup
    setShowAddPopup(false);
    console.log(aulasDisponiveis);
  };

  // Check if all filters are selected
  const filtrosSelecionados = escola && curso && ano && turma;

  useEffect(() => {
    socket.emit("refresh-aulas");
  }, []);

  const exportToPdf = () => {
  const doc = new jsPDF();

  // Convert the timetable data to a format suitable for PDF
  const tableData = [];
  tableData.push(["Horas", ...diasSemana]); // Header row

  horas.forEach((hora, index) => {
    const horaInicio = hora.split(" - ")[0];
    const row = [hora];

    diasSemana.forEach((dia) => {
      const classItem = aulasMarcadas.find(
        (cls) => cls.day === dia && cls.start === horaInicio
      );

      if (classItem) {
        row.push(`${classItem.subject}\n${classItem.location}`);
      } else {
        row.push("");
      }
    });

    tableData.push(row);
  });

  // Add the table to the PDF

  autoTable(doc, {  head: [tableData[0]], // Header row
    body: tableData.slice(1), // Data rows
    theme: "grid",
    styles: { overflow: "linebreak" }, })
  

  // Save the PDF
  doc.save("horario.pdf");
};

const exportToExcel = () => {
  const ws = XLSX.utils.json_to_sheet(aulasMarcadas.map(aula => ({
    Cod_Aula: aula.Cod_Aula,
    day: aula.day,
    start: aula.start,
    end: aula.end,
    subject: aula.subject,
    location: aula.location,
    duration: aula.duration
  })));
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Horario");
  XLSX.writeFile(wb, "horario.xlsx");
};

  // Export to CSV
  const exportToCsv = () => {
    const csvData = aulasMarcadas.map((aula) => ({
      Dia: aula.day,
      Hora: aula.start,
      Disciplina: aula.subject,
      Localizacao: aula.location,
      Duracao: aula.duration,
    }));

    const csvContent = Papa.unparse(csvData);

    // Create a downloadable CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "horario.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DndContext modifiers={[restrictToWindowEdges]} onDragEnd={handleDragEnd}>
      <div className="horarios-container">
        <div className="layout">
          <div className="filters-and-buttons">
            <div className="filtros">
              <h3>Filtros</h3>
              <select onChange={(e) => setEscola(e.target.value)} value={escola}>
                <option value="" disabled>Escolher Escola</option>
                <option value="ESTT">ESTT</option>
                <option value="ESGT">ESGT</option>
                <option value="ESTA">ESTA</option>
              </select>
              <select onChange={(e) => setCurso(e.target.value)} value={curso}>
                <option value="" disabled>Escolher Curso</option>
                <option value="Engenharia Informática">Engenharia Informática</option>
                <option value="Gestão">Gestão</option>
              </select>
              <select onChange={(e) => setAno(e.target.value)} value={ano}>
                <option value="" disabled>Escolher Ano</option>
                <option value="1">1º Ano</option>
                <option value="2">2º Ano</option>
                <option value="3">3º Ano</option>
              </select>
              <select onChange={(e) => setTurma(e.target.value)} value={turma}>
                <option value="" disabled>Escolher Turma</option>
                <option value="A">Turma A</option>
                <option value="B">Turma B</option>
              </select>
            </div>
          </div>
          {/* Conditionally render buttons when filters are selected */}
          {filtrosSelecionados && (
            <div className="filters-and-buttons">
              <button onClick={() => setShowAddPopup(true)} className="add-class-button">
                Adicionar Aula
              </button>
              <button
                onClick={() => setIsBlocked((prev) => !prev)}
                className="block-btn"
              >
                {isBlocked ? "Desbloquear Horário" : "Bloquear Horário"}
              </button>
              <button
                onClick={() => openEditPopup(aulasMarcadas[0])} // Example: opens popup for the first marked class
                className="edit-class-button"
              >
                Editar Aula
              </button>
              {/* Add export buttons */}
              <button onClick={exportToPdf} className="export-btn">
                Exportar para PDF
              </button>
              <button onClick={exportToExcel} className="export-btn">
                Exportar para Excel
              </button>
              <button onClick={exportToCsv} className="export-btn">
                Exportar para CSV
              </button>
            </div>
          )}
          {/* Show content only if filters are selected */}
          {filtrosSelecionados ? (
            <>
              {/* Popup para adicionar aulas */}
              {showAddPopup && (
                <div className="add-popup">
                  <div className="popup-content">
                    <h3>Adicionar Aula</h3>
                    <input
                      type="text"
                      placeholder="Disciplina"
                      value={newAula.subject}
                      onChange={(e) => setNewAula({ ...newAula, subject: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Localização"
                      value={newAula.location}
                      onChange={(e) => setNewAula({ ...newAula, location: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Duração (minutos)"
                      value={newAula.duration}
                      onChange={(e) => setNewAula({ ...newAula, duration: parseInt(e.target.value, 10) })}
                    />
                    <button onClick={addClass}>Salvar</button>
                    <button onClick={() => setShowAddPopup(false)}>Cancelar</button>
                    {erro && <div className="error-message">{erro}</div>}
                  </div>
                </div>
              )}
              {/* Popup para editar aulas */}
              {showEditPopup && (
                <div className="add-popup">
                  <div className="popup-content">
                    <h3>Editar Aula</h3>
                    <select onChange={handleAulaChange} value={editingAula?.Cod_Aula || ""}>
                      <option value="" disabled>Selecione uma aula</option>
                      {aulasMarcadas.map((aula) => (
                        <option key={aula.Cod_Aula} value={aula.Cod_Aula}>
                          {aula.subject} - {aula.location}
                        </option>
                      ))}
                    </select>
                    {editingAula && (
                      <>
                        <input
                          type="text"
                          placeholder="Disciplina"
                          value={editingAula.subject}
                          onChange={(e) =>
                            setEditingAula({ ...editingAula, subject: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Localização"
                          value={editingAula.location}
                          onChange={(e) =>
                            setEditingAula({ ...editingAula, location: e.target.value })
                          }
                        />
                        <input
                          type="number"
                          placeholder="Duração (minutos)"
                          value={editingAula.duration}
                          onChange={(e) =>
                            setEditingAula({ ...editingAula, duration: parseInt(e.target.value, 10) })
                          }
                        />
                        <button onClick={saveEditedAula}>Salvar</button>
                        <button onClick={() => deleteAula(editingAula.Cod_Aula)}>Excluir</button>
                      </>
                    )}
                    <button onClick={() => setShowEditPopup(false)}>Cancelar</button>
                  </div>
                </div>
              )}
              <div className="conteudo">
                <div className="timetable-and-available-classes">
                  <div className="timetable-container">
                    {erro && <div className="error-message">{erro}</div>}
                    <table className="timetable">
                      <thead>
                        <tr>
                          <th>Horas</th>
                          {diasSemana.map((dia) => (
                            <th key={dia}>{dia}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {horas.map((hora, index) => {
                          const horaInicio = hora.split(" - ")[0];
                          return (
                            <tr key={index}>
                              <td className="hora">{hora}</td>
                              {diasSemana.map((dia) => {
                                const cellId = `${dia}-${horaInicio}`;
                                // Prevent rendering cell if it's within an already spanned class
                                const isCellSpanned = aulasMarcadas.some((cls) => {
                                  const classStartIndex = horas.findIndex(h => h.startsWith(cls.start));
                                  const classEndIndex = classStartIndex + (cls.duration / 30);
                                  const currentIndex = index;
                                  return (
                                    cls.day === dia &&
                                    currentIndex > classStartIndex &&
                                    currentIndex < classEndIndex
                                  );
                                });
                                if (isCellSpanned) return null;
                                const classItem = aulasMarcadas.find(
                                  (cls) => cls.day === dia && cls.start === horaInicio
                                );
                                if (classItem) {
                                  const durationBlocks = classItem.duration / 30;
                                  return (
                                    <td key={cellId} rowSpan={durationBlocks} className="class-cell">
                                      <Draggable
                                        id={"marcada_" + classItem.Cod_Aula}
                                        isBlocked={isBlocked}
                                        aulaInfo={classItem}
                                      >
                                        <div className="class-entry">
                                          <strong>{classItem.subject}</strong>
                                          <br />
                                          <span className="location">{classItem.location}</span>
                                        </div>
                                      </Draggable>
                                    </td>
                                  );
                                }
                                return (
                                  <Droppable key={cellId} id={cellId} isBlocked={isBlocked} />
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {/* Available Classes */}
                  <Droppable id="aulas-disponiveis" isBlocked={false}>
                    <div className="aulas-disponiveis">
                      <h3>Aulas Disponíveis</h3>
                      <input
                        type="text"
                        placeholder="Pesquisar aulas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                      />
                      {filtrosSelecionados ? (
                        filteredAulasDisponiveis.length > 0 ? (
                          filteredAulasDisponiveis.map((aula) => (
                            <Draggable key={aula.id} id={"disponivel_" + aula.id} isBlocked={isBlocked} aulaInfo={aula}>
                              <div className="aula-disponivel">
                                <strong>{aula.subject}</strong>
                                <p>{aula.id}</p>
                                <br />
                                <span>{aula.location}</span>
                              </div>
                            </Draggable>
                          ))
                        ) : (
                          <p>Nenhuma aula disponível.</p>
                        )
                      ) : (
                        <p>Por favor, preencha os filtros para acessar as aulas disponíveis.</p>
                      )}
                    </div>
                  </Droppable>
                </div>
              </div>
            </>
          ) : (
            <p>Por favor, preencha os filtros para visualizar o horário.</p>
          )}
        </div>
      </div>
    </DndContext>
  );
}

export default Horarios;