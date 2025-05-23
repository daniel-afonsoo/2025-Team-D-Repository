import React, { useState, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import "../styles/horarios.css";
import socket from "../utils/socket";
import { useSocket } from "../utils/useSocket";
import { useLocation } from 'react-router-dom';
import { exportToPdf, exportToExcel } from '../utils/exportFunctions.js';

// Dias da semana
const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
// Gera intervalos de 08:00 a 23:30 (31 blocos de 30min)
const horas = Array.from({ length: 31 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  const start = `${hour.toString().padStart(2, "0")}:${minutes}`;
  const endHour = minutes === "30" ? hour + 1 : hour;
  const endMinutes = minutes === "30" ? "00" : "30";
  const end = `${endHour.toString().padStart(2, "0")}:${endMinutes}`;
  return `${start} - ${end}`;
});

// Draggable component
function Draggable({ id, children, isBlocked, aulaInfo }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id, data: { aulaInfo }, disabled: isBlocked });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: isBlocked ? "not-allowed" : "grab",
    height: "100%",
  };
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="aula">
      {children}
    </div>
  );
}

// Droppable component
function Droppable({ id, children, isBlocked }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const style = { backgroundColor: isOver && !isBlocked ? "lightblue" : undefined };
  return (
    <div ref={setNodeRef} style={style} className="empty-slot">
      {children}
    </div>
  );
}

 function Horarios() {
  const location = useLocation();
  const path = location.pathname;
  const { aulasMarcadas } = useSocket();

  // Disponíveis e estado geral
  const [aulasDisponiveis, setAulasDisponiveis] = useState([]);
  const [newAula, setNewAula] = useState({ subject: "", location: "", duration: 30 });
  const [isBlocked, setIsBlocked] = useState(false);
  const [erro, setErro] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingAula, setEditingAula] = useState(null);

  // Definição de filtros
  let escolaPath = '';
  if (path.includes('horariosESTT')) escolaPath = 'ESTT';
  else if (path.includes('horariosESGT')) escolaPath = 'ESGT';
  else if (path.includes('horariosESTA')) escolaPath = 'ESTA';

  const [escola, setEscola] = useState(escolaPath);
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [turma, setTurma] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Verifica se todos os filtros foram preenchidos
  const filtrosSelecionados = escola && curso && ano && turma;

  const filteredAulasDisponiveis = aulasDisponiveis.filter(a =>
    a.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Gera código único simples
  let nextCode = 1;
  const generateUniqueCode = () => nextCode++;

  // Calcula horário final a partir do início e duração
  const calculateEndTime = (startTime, duration) => {
    const [h, m] = startTime.split(":").map(Number);
    const total = h * 60 + m + duration;
    const eh = Math.floor(total / 60);
    const em = total % 60;
    return `${eh.toString().padStart(2,"0")}:${em.toString().padStart(2,"0")}`;
  };

  // Drag & Drop
  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    const [day, start] = over.id.split('-');
    const startIndex = horas.findIndex(h => h.startsWith(start));

    // Verifica sobreposição
    const overlap = aulasMarcadas.some(cls => {
      if (cls.Cod_Aula === active.data.current?.aulaInfo?.Cod_Aula) return false;
      const si = horas.findIndex(h => h.startsWith(cls.start));
      const blocks = cls.duration / 30;
      return (cls.day === day && startIndex < si + blocks && startIndex + active.data.current.aulaInfo.duration/30 > si);
    });
    if (overlap) { alert('Sobreposição detectada!'); return; }

    // Se vier de disponível para marcado
    if (active.id.startsWith('disponivel_')) {
      const a = active.data.current.aulaInfo;
      const nova = {
        Cod_Aula: generateUniqueCode(),
        day,
        start,
        end: calculateEndTime(start, a.duration),
        subject: a.subject,
        location: a.location,
        duration: a.duration
      };
      socket.emit('add-aula', { newAula: nova });
      setAulasDisponiveis(prev => prev.filter(x => x.id !== a.id));

    // Se for reorganizar aula marcada
    } else if (active.id.startsWith('marcada_')) {
      const a = active.data.current.aulaInfo;
      const upd = { ...a, day, start, end: calculateEndTime(start, a.duration) };
      socket.emit('update-aula', upd);
    }
  };

  // Funções de popup
  const addClass = () => {
    setAulasDisponiveis(prev => [...prev, { id: prev.length+1, ...newAula }]);
    setNewAula({ subject: "", location: "", duration: 30 });
    setShowAddPopup(false);
  };
  const openEditPopup = (aula) => { setEditingAula(aula); setShowEditPopup(true); };
  const handleAulaChange = (e) => {
    const cod = +e.target.value;
    const sel = aulasMarcadas.find(a => a.Cod_Aula === cod);
    setEditingAula(sel);
  };
  const saveEditedAula = () => {
    socket.emit('update-aula', editingAula);
    setShowEditPopup(false);
  };
  const deleteAula = (cod) => {
    socket.emit('delete-aula', { codAula: cod });
    setShowEditPopup(false);
  };

  useEffect(() => { socket.emit('refresh-aulas'); }, []);

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
              <button onClick={() => exportToPdf(aulasMarcadas)} className="export-btn">
                Exportar para PDF
              </button>
              <button onClick={() => exportToExcel(aulasMarcadas)} className="export-btn">
                Exportar para Excel
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