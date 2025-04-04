import React, { useState, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import "../styles/horarios.css";
import socket from "../utils/socket";

// Define the days of the week
const diasSemana = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Generate time slots (from 8:30 to 24:00)
const horas = Array.from({ length: 31 }, (_, i) => {
  const startHour = 8 + Math.floor((i + 1) / 2); // Calculate the start hour
  const startMinutes = i % 2 === 0 ? "30" : "00"; // Define the minutes (30 or 00)
  const endHour = startMinutes === "30" ? startHour + 1 : startHour; // Calculate the end hour
  const endMinutes = startMinutes === "30" ? "00" : "30"; // Define the end minutes
  return `${startHour}:${startMinutes} - ${endHour === 24 ? "00" : endHour}:${endMinutes}`;
});

// Draggable component
function Draggable({ id, children, isBlocked }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled: isBlocked, // Disable dragging if the schedule is blocked
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: isBlocked ? "not-allowed" : "grab",
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

// Droppable component
function Droppable({ id, children, isBlocked }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  const style = {
    backgroundColor: isOver && !isBlocked ? "lightblue" : undefined,
  };

  return (
    <td ref={setNodeRef} style={style} className="empty-slot">
      {children}
    </td>
  );
}

// Main Horarios component
function Horarios() {
  const [schedule, setSchedule] = useState([]); // State to store the schedule from the server
  const [isBlocked, setIsBlocked] = useState(false); // State to block the schedule
  const [erro, setErro] = useState(""); // State for error messages

  // Filters
  const [escola, setEscola] = useState("");
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [turma, setTurma] = useState("");

  // States for adding and editing classes
  const [newClass, setNewClass] = useState({ subject: "", location: "", duration: 60 });
  const [editingClass, setEditingClass] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(""); // ID da aula selecionada no dropdown
  const [showAddPopup, setShowAddPopup] = useState(false); // Controla o popup de adicionar aulas

  // Fetch schedule from the server on component mount
  useEffect(() => {
    // Listen for schedule updates from the server
    socket.on("update-aulas", (data) => {
      console.log("Received schedule from server:", data);
      // Ensure all classes start in "Aulas Disponíveis"
      const updatedSchedule = data.newAulas.map((cls) => ({
        ...cls,
        day: null,
        start: null,
      }));
      setSchedule(updatedSchedule);
    });

    // Cleanup the socket listener on component unmount
    return () => {
      socket.off("update-aulas");
    };
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setSchedule((prevSchedule) =>
        prevSchedule.map((cls) =>
          cls.id.toString() === active.id
            ? { ...cls, day: null, start: null }
            : cls
        )
      );
      setErro("");
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    const [overDay, overTime] = overId.split("-");

    const isBlockOccupied = schedule.some(
      (cls) =>
        cls.day === overDay &&
        cls.start === overTime &&
        cls.id.toString() !== activeId
    );

    if (isBlockOccupied) {
      setErro("Este bloco já está ocupado por outra aula.");
      return;
    }

    const draggedClass = schedule.find((cls) => cls.id.toString() === activeId);

    if (draggedClass) {
      const updatedClass = {
        ...draggedClass,
        day: overDay,
        start: overTime,
      };

      socket.emit("move-aula", updatedClass);

      setSchedule((prevSchedule) =>
        prevSchedule.map((cls) => (cls.id === draggedClass.id ? updatedClass : cls))
      );

      setErro("");
    }
  };

  const addClass = () => {
    if (!newClass.subject || !newClass.location || !newClass.duration) {
      setErro("Preencha todos os campos para adicionar uma aula.");
      return;
    }

    const newClassWithId = { ...newClass, id: Date.now(), day: null, start: null };
    socket.emit("add-aula", { newAula: newClassWithId });
    setSchedule((prev) => [...prev, newClassWithId]);
    setNewClass({ subject: "", location: "", duration: 60 });
    setShowAddPopup(false); // Fechar o popup após adicionar a aula
    setErro("");
  };

  const editClass = (classId) => {
    const classToEdit = schedule.find((cls) => cls.id === classId);
    if (classToEdit) {
      setEditingClass({ ...classToEdit }); // Crie uma cópia do objeto para evitar mutações
    } else {
      setErro("Aula não encontrada para edição.");
    }
  };

  const saveEditedClass = () => {
    if (!editingClass.subject || !editingClass.location || !editingClass.duration) {
      setErro("Preencha todos os campos para salvar a aula.");
      return;
    }

    socket.emit("edit-aula", { updatedAula: editingClass });
    setSchedule((prevSchedule) =>
      prevSchedule.map((cls) =>
        cls.id === editingClass.id ? editingClass : cls
      )
    );
    setEditingClass(null);
    setSelectedClassId(""); // Limpar seleção
    setErro("");
  };

  const openEditPopup = () => {
    const classToEdit = schedule.find((cls) => cls.id.toString() === selectedClassId);
    if (classToEdit) {
      setEditingClass({ ...classToEdit });
    } else {
      setErro("Aula não encontrada para edição.");
    }
  };

  // Check if all filters are selected
  const filtrosSelecionados = escola && curso && ano && turma;

  // Filter available classes (those not yet assigned to the schedule)
  const aulasDisponiveis = filtrosSelecionados
    ? schedule.filter((cls) => !cls.day || !cls.start)
    : [];

  return (
    <DndContext modifiers={[restrictToWindowEdges]} onDragEnd={handleDragEnd}>
      <div className="horarios-container">
        <div className="layout">
          {/* Filters */}
          <div className="filtros">
            <h3>Filtros</h3>
            <select onChange={(e) => setEscola(e.target.value)} value={escola}>
              <option value="">Escolher Escola</option>
              <option value="ESTT">ESTT</option>
              <option value="ESGT">ESGT</option>
            </select>
            <select onChange={(e) => setCurso(e.target.value)} value={curso}>
              <option value="">Escolher Curso</option>
              <option value="Engenharia Informática">Engenharia Informática</option>
              <option value="Gestão">Gestão</option>
            </select>
            <select onChange={(e) => setAno(e.target.value)} value={ano}>
              <option value="">Escolher Ano</option>
              <option value="1">1º Ano</option>
              <option value="2">2º Ano</option>
              <option value="3">3º Ano</option>
            </select>
            <select onChange={(e) => setTurma(e.target.value)} value={turma}>
              <option value="">Escolher Turma</option>
              <option value="A">Turma A</option>
              <option value="B">Turma B</option>
            </select>
          </div>

          {/* Show content only if filters are selected */}
          {filtrosSelecionados ? (
            <>
              {/* Botão para abrir o popup de adicionar aulas */}
              <div className="add-class-button">
                <button onClick={() => setShowAddPopup(true)}>Adicionar Aula</button>
              </div>

              {/* Popup para adicionar aulas */}
              {showAddPopup && (
                <div className="add-popup">
                  <div className="popup-content">
                    <h3>Adicionar Aula</h3>
                    <input
                      type="text"
                      placeholder="Disciplina"
                      value={newClass.subject}
                      onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Localização"
                      value={newClass.location}
                      onChange={(e) => setNewClass({ ...newClass, location: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Duração (minutos)"
                      value={newClass.duration}
                      onChange={(e) =>
                        setNewClass({ ...newClass, duration: parseInt(e.target.value, 10) })
                      }
                    />
                    <button onClick={addClass}>Salvar</button>
                    <button onClick={() => setShowAddPopup(false)}>Cancelar</button>
                    {erro && <div className="error-message">{erro}</div>}
                  </div>
                </div>
              )}

              {/* Timetable */}
              <div className="conteudo">
                <div className="timetable-container">
                  <button onClick={() => setIsBlocked((prev) => !prev)} className="block-btn">
                    {isBlocked ? "Desbloquear Horário" : "Bloquear Horário"}
                  </button>
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
                      {horas.map((hora, index) => (
                        <tr key={index}>
                          <td className="hora">{hora}</td>
                          {diasSemana.map((dia) => {
                            const classItem = schedule.find(
                              (cls) => cls.day === dia && cls.start === hora.split(" - ")[0]
                            );

                            if (classItem) {
                              const durationBlocks = classItem.duration / 30;
                              return (
                                <Droppable id={`${dia}-${hora.split(" - ")[0]}`} isBlocked={isBlocked}>
                                  <Draggable id={classItem.id.toString()} isBlocked={isBlocked}>
                                    <div
                                      className="class-entry"
                                      style={{
                                        gridRow: `span ${durationBlocks}`, // Assuming each grid row represents 30 minutes
                                      }}
                                    >
                                      <strong>{classItem.subject}</strong>
                                      <br />
                                      <span className="location">{classItem.location}</span>
                                    </div>
                                  </Draggable>
                                </Droppable>
                              );
                            }

                            return (
                              <Droppable id={`${dia}-${hora.split(" - ")[0]}`} isBlocked={isBlocked} />
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Available Classes */}
              <div className="aulas-disponiveis">
                <h3>Aulas Disponíveis</h3>
                {filtrosSelecionados ? (
                  aulasDisponiveis.length > 0 ? (
                    aulasDisponiveis.map((aula) => (
                      <Draggable key={aula.id} id={aula.id.toString()} isBlocked={isBlocked}>
                        <div className="aula-disponivel">
                          <strong>{aula.subject}</strong>
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

              {/* Dropdown para selecionar a aula */}
              <div className="edit-dropdown">
                <h3>Editar Aula</h3>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                >
                  <option value="">Selecione uma aula</option>
                  {schedule.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.subject} - {cls.location}
                    </option>
                  ))}
                </select>
                <button onClick={openEditPopup} disabled={!selectedClassId}>
                  Editar
                </button>
              </div>

              {/* Popup para editar a aula */}
              {editingClass && (
                <div className="edit-popup">
                  <div className="popup-content">
                    <h3>Editar Aula</h3>
                    <input
                      type="text"
                      placeholder="Disciplina"
                      value={editingClass.subject}
                      onChange={(e) =>
                        setEditingClass({ ...editingClass, subject: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Localização"
                      value={editingClass.location}
                      onChange={(e) =>
                        setEditingClass({ ...editingClass, location: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Duração (minutos)"
                      value={editingClass.duration}
                      onChange={(e) =>
                        setEditingClass({
                          ...editingClass,
                          duration: parseInt(e.target.value, 10),
                        })
                      }
                    />
                    <button onClick={saveEditedClass}>Salvar</button>
                    <button onClick={() => setEditingClass(null)}>Cancelar</button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p>Por favor, preencha os filtros para acessar o conteúdo.</p>
          )}
        </div>
      </div>
    </DndContext>
  );
}

export default Horarios;