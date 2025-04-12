import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import "../styles/horarios.css";
import socket from "../utils/socket"; // Import the socket instance
import Filtros from "../components/horarios/Filtros";
import Draggable from "../components/horarios/Draggable";
import Droppable from "../components/horarios/Droppable";

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const horas = Array.from({ length: 31 }, (_, i) => {
  const startHour = 8 + Math.floor((i + 1) / 2);
  const startMinutes = i % 2 === 0 ? "30" : "00";
  const endHour = startMinutes === "30" ? startHour + 1 : startHour;
  const endMinutes = startMinutes === "30" ? "00" : "30";
  return `${startHour}:${startMinutes} - ${endHour === 24 ? "00" : endHour}:${endMinutes}`;
});

function Horarios() {
  const [aulasMarcadas, setAulasMarcadas] = useState([]);
  const [aulasDisponiveis, setAulasDisponiveis] = useState([]);
  const [newAula, setNewAula] = useState({ subject: "", location: "", duration: 30 });
  const [isBlocked, setIsBlocked] = useState(false);
  const [erro, setErro] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);

  // Filters
  const [escola, setEscola] = useState("");
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [turma, setTurma] = useState("");

  const filtrosSelecionados = escola && curso && ano && turma;

  // Fetch assigned classes when filters are selected
  useEffect(() => {
    if (filtrosSelecionados) {
      // Emit a request to fetch assigned classes
      socket.emit("get-aulas");

      // Listen for the "update-aulas" event from the server
      socket.on("update-aulas", (data) => {
        console.log("Received aulas from server:", data.newAulas);
        setAulasMarcadas(data.newAulas); // Update the assigned classes
      });

      // Cleanup the socket listener on component unmount
      return () => {
        socket.off("update-aulas");
      };
    }
  }, [filtrosSelecionados]);

  // Fetch available classes when filters are selected
  useEffect(() => {
    if (filtrosSelecionados) {
      // Simulate fetching available classes based on filters
      const fetchedClasses = [
        { id: 1, subject: "Matemática", location: "Sala 101", duration: 60 },
        { id: 2, subject: "História", location: "Sala 102", duration: 90 },
        { id: 3, subject: "Física", location: "Sala 103", duration: 45 },
      ];
      setAulasDisponiveis(fetchedClasses);
    } else {
      setAulasDisponiveis([]); // Clear available classes if filters are not selected
    }
  }, [escola, curso, ano, turma]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      alert("Dropped outside the schedule");
      setErro("");
      return;
    }

    const existingClass = aulasMarcadas.find(
      (cls) => cls.day === over.id.split("-")[0] && cls.start === over.id.split("-")[1]
    );
    if (existingClass) {
      alert("Class already exists in this slot");
      return;
    }

    if (active.id.startsWith("disponivel_")) {
      const [day, start] = over.id.split("-");
      const newAula = {
        day,
        start,
        subject: active.data.current.aulaInfo.subject,
        location: active.data.current.aulaInfo.location,
      };

      socket.emit("add-aula", { newAula }); // Notify the server about the new class
      setAulasDisponiveis((prev) => prev.filter((aula) => aula.id !== active.data.current.aulaInfo.id));
    } else if (active.id.startsWith("marcada_")) {
      let codAula = active.data.current.aulaInfo.Cod_Aula;
      const [newDay, newStart] = over.id.split("-");
      socket.emit("update-aula", { codAula, newDay, newStart }); // Notify the server about the update
    }
  };

  const addClass = () => {
    setAulasDisponiveis((prev) => [
      ...prev,
      {
        id: aulasDisponiveis.length + 1,
        subject: newAula.subject,
        location: newAula.location,
        duration: newAula.duration,
      },
    ]);
    setNewAula({ subject: "", location: "", duration: 30 });
    setShowAddPopup(false);
  };

  return (
    <DndContext modifiers={[restrictToWindowEdges]} onDragEnd={handleDragEnd}>
      <div className="horarios-container">
        <div className="layout">
          {/* Use the Filtros component */}
          <Filtros
            escola={escola}
            setEscola={setEscola}
            curso={curso}
            setCurso={setCurso}
            ano={ano}
            setAno={setAno}
            turma={turma}
            setTurma={setTurma}
          />

          {filtrosSelecionados && (
            <div className="filters-and-buttons">
              <button onClick={() => setShowAddPopup(true)} className="add-class-button">
                Adicionar Aula
              </button>
              <button onClick={() => setIsBlocked((prev) => !prev)} className="block-btn">
                {isBlocked ? "Desbloquear Horário" : "Bloquear Horário"}
              </button>
            </div>
          )}

          {filtrosSelecionados ? (
            <>
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

              <div className="conteudo">
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
                      {horas.map((hora, index) => (
                        <tr key={index}>
                          <td className="hora">{hora}</td>
                          {diasSemana.map((dia) => {
                            const classItem = aulasMarcadas.find(
                              (cls) => cls.day === dia && cls.start === hora.split(" - ")[0]
                            );

                            if (classItem) {
                              const durationBlocks = classItem.duration / 30;
                              return (
                                <Droppable
                                  key={`${dia}-${hora}`}
                                  id={`${dia}-${hora.split(" - ")[0]}`}
                                  isBlocked={isBlocked}
                                >
                                  <Draggable
                                    key={`draggable-${classItem.Cod_Aula}`}
                                    id={"marcada_" + classItem.Cod_Aula}
                                    isBlocked={isBlocked}
                                    aulaInfo={classItem}
                                  >
                                    <div
                                      className="class-entry"
                                      style={{
                                        gridRow: `span ${durationBlocks}`,
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
                              <Droppable
                                key={`${dia}-${hora}`}
                                id={`${dia}-${hora.split(" - ")[0]}`}
                                isBlocked={isBlocked}
                              />
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="aulas-disponiveis">
                  <h3>Aulas Disponíveis</h3>
                  {aulasDisponiveis.length > 0 ? (
                    aulasDisponiveis.map((aula) => (
                      <Draggable
                        key={aula.id}
                        id={"disponivel_" + aula.id}
                        isBlocked={isBlocked}
                        aulaInfo={aula}
                      >
                        <div className="aula-disponivel">
                          <strong>{aula.subject}</strong>
                          <br />
                          <span>{aula.location}</span>
                        </div>
                      </Draggable>
                    ))
                  ) : (
                    <p>Nenhuma aula disponível.</p>
                  )}
                </div>
              </div>
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