import React, { useState, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import "../styles/horarios.css";
import socket from "../utils/socket"; // Import the socket instance
import { useSocket } from "../utils/useSocket"

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

  // lista das aulas
  const { aulasMarcadas } = useSocket(); // Fetch the schedule from the server
  const [ aulasDisponiveis, setAulasDisponiveis] = useState([]); // State for available classes

  const [isBlocked, setIsBlocked] = useState(false); // State to block the schedule
  const [erro, setErro] = useState(""); // State for error messages

  // Filters
  const [escola, setEscola] = useState("");
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [turma, setTurma] = useState("");

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      console.log("Dropped outside the schedule");
      setErro("");
      return;
    }else{
      const newAula = {

        start: over.id.split("-")[1], // Extract the start time from the droppable ID
        end: over.id.split("-")[1], // Extract the end time from the droppable ID
        day: over.id.split("-")[0], // Extract the day from the droppable ID
      };
      socket.emit("add-aula", { newAula: newAula } ); // Emit the new class to the server
    }

    

  };

  // Check if all filters are selected
  const filtrosSelecionados = escola && curso && ano && turma;

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
                            const classItem = aulasMarcadas.find(
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