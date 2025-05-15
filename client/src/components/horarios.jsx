import React, { useState, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import "../styles/horarios.css";
import socket from "../utils/socket"; // Import the socket instance
import { useSocket } from "../utils/useSocket"
import { useLocation } from 'react-router-dom';


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
  console.log("Path:" , path)

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
  const [selectedAula, setSelectedAula] = useState(null);

  let escolaPath
  if (path === "/horariosESTT") {
    escolaPath = "ESTT"
  } else if (path === "/horariosESGT") {
    escolaPath = "ESGT"
  } else if (path === "/horariosESTA") {
    escolaPath = "ESTA"
  } else {
    escolaPath = ""
  }
  console.log(escolaPath)

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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      alert("Dropped outside the schedule");
      setErro("");

      // Restaurar aula ao estado anterior, se necessário
      if (active.id.startsWith("marcada_")) {
        const originalAula = active.data.current.aulaInfo;
        socket.emit("update-aulas", (prev) => [...prev, originalAula]);
      }
      return;
    }


    if (over.id === "aulas-disponiveis") {
      if (active.id.startsWith("marcada_")) {
        const originalAula = active.data.current.aulaInfo;

        // Adiciona à lista de aulas disponíveis
        setAulasDisponiveis((prev) => [
          ...prev,
          {
            id: (prev[prev.length - 1]?.id || 0) + 1,
            subject: originalAula.subject,
            location: originalAula.location,
            duration: originalAula.duration,
          },
        ]);

        
        socket.emit("update-aulas", (prev) =>
          prev.filter((aula) => aula.Cod_Aula !== originalAula.Cod_Aula)
        );
      
        socket.emit("remove-aula", { codAula: originalAula.Cod_Aula }); // Opcional: para manter servidor sincronizado
      }
      return;
    }

    const [day, start] = over.id.split("-");
    const startIndex = horas.findIndex((hora) => hora.startsWith(start));

    const overlappingClass = aulasMarcadas.find((cls) => {
      if (cls.Cod_Aula === active.data.current.aulaInfo.Cod_Aula) {
        return false; // Skip checking against itself
      }
      const classStartIndex = horas.findIndex((hora) => hora.startsWith(cls.start));
      const classEndIndex = classStartIndex + cls.duration / 30;
      return (
        cls.day === day &&
        ((startIndex >= classStartIndex && startIndex < classEndIndex) ||
          (startIndex + active.data.current.aulaInfo.duration / 30 > classStartIndex &&
            startIndex + active.data.current.aulaInfo.duration / 30 <= classEndIndex))
      );
    });

    if (overlappingClass) {
      alert("Cannot place a class that overlaps with another class. Please choose an empty slot.");

      // Restore the class back to its original position
      if (active.id.startsWith("marcada_")) {
        const originalAula = active.data.current.aulaInfo;
        socket.emit("update-aulas", ((prev) => [...prev, originalAula]));
      }
      return;
    }

    if (active.id.startsWith("disponivel_")) {
      const newAula = {
        day,
        start,
        subject: active.data.current.aulaInfo.subject,
        location: active.data.current.aulaInfo.location,
        duration: active.data.current.aulaInfo.duration,
      };

      socket.emit("add-aula", { newAula });
      

      setAulasDisponiveis((prev) =>
        prev.filter((aula) => aula.id !== active.data.current.aulaInfo.id)
      );
    } else if (active.id.startsWith("marcada_")) {
      const codAula = active.data.current.aulaInfo.Cod_Aula;
      socket.emit("update-aula", { codAula, newDay: day, newStart: start });
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
  }

  // Check if all filters are selected
  const filtrosSelecionados = escola && curso && ano && turma;

  useEffect(() => {
    socket.emit("refresh-aulas");
  }, []);

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
                onClick={() => openEditPopup(aulasMarcadas[0])} // Exemplo: abre o popup para a primeira aula marcada
                className="edit-class-button"
              >
                Editar Aula
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
                                    <td key={cellId} rowSpan={durationBlocks} className="class-cell" onContextMenu={(e) => handleRightClick(e, classItem)}>
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
