import React, { useState, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import "../styles/horarios.css";
import socket from "../utils/socket"; // Import the socket instance
import { useSocket } from "../utils/useSocket"

// Define the days of the week
const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// Generate time slots (from 8:30 to 24:00)
const horas = Array.from({ length: 31 }, (_, i) => {
  const startHour = 8 + Math.floor((i + 1) / 2); // Calculate the start hour
  const startMinutes = i % 2 === 0 ? "30" : "00"; // Define the minutes (30 or 00)
  const endHour = startMinutes === "30" ? startHour + 1 : startHour; // Calculate the end hour
  const endMinutes = startMinutes === "30" ? "00" : "30"; // Define the end minutes
  return `${startHour}:${startMinutes} - ${endHour === 24 ? "00" : endHour}:${endMinutes}`;
});

// Draggable component
function Draggable({ id, children, isBlocked, aulaInfo }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { aulaInfo },
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

  // lista das aulas marcadas
  const { aulasMarcadas } = useSocket();

  // aulas disponíveis
  const [aulasDisponiveis, setAulasDisponiveis] = useState([]); // Lista de aulas disponiveis
  const [newAula, setNewAula] = useState({ subject: "", location: "", duration: 30 });

  const [isBlocked, setIsBlocked] = useState(false); // State to block the schedule
  const [erro, setErro] = useState(""); // State for error messages
  const [showAddPopup, setShowAddPopup] = useState(false);

  // Filters
  const [escola, setEscola] = useState("");
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [turma, setTurma] = useState("");

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // check if drop spot is valid
    if (!over) {
      alert("Dropped outside the schedule");
      setErro("");
      return;
    }

    // check if theres already a class in the drop spot
    const existingClass = aulasMarcadas.find(
      (cls) => cls.day === over.id.split("-")[0] && cls.start === over.id.split("-")[1]
    );
    if (existingClass) {
      alert("Class already exists in this slot");
      return;
    }

    //routine to add new aula to schedule
    if (active.id.startsWith("disponivel_")) {
      const [day, start] = over.id.split("-"); // get day and start time from over id
      const newAula = {
        day,
        start,
        subject: active.data.current.aulaInfo.subject,
        location: active.data.current.aulaInfo.location,
      };

      // Emit the event to the server to add the new class
      socket.emit("add-aula", { newAula });
      // remove aula from aulasDisponiveis
      setAulasDisponiveis((prev) => prev.filter((aula) => aula.id !== active.data.current.aulaInfo.id));

    } else if (active.id.startsWith("marcada_")) { //routine to update existing aula in schedule
      let codAula = active.data.current.aulaInfo.Cod_Aula
      console.log(codAula)
      const [newDay, newStart] = over.id.split("-"); // get day and start time from over id
      socket.emit("update-aula", { codAula, newDay, newStart });
    }

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
  }

  // Check if all filters are selected
  const filtrosSelecionados = escola && curso && ano && turma;

  return (
    <DndContext modifiers={[restrictToWindowEdges]} onDragEnd={handleDragEnd}>
      <div className="horarios-container">
        <div className="layout">
          {/* Filters and Add Button */}
          <div className="filters-and-buttons">
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

            {/* Timetable and Available Classes */}
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
                              <Droppable id={`${dia}-${hora.split(" - ")[0]}`} isBlocked={isBlocked}>
                                <Draggable id={"marcada_" + classItem.Cod_Aula} isBlocked={isBlocked} aulaInfo={classItem}>
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

              {/* Available Classes */}
              <div className="aulas-disponiveis">
                <h3>Aulas Disponíveis</h3>
                {filtrosSelecionados ? (
                  aulasDisponiveis.length > 0 ? (
                    aulasDisponiveis.map((aula) => (
                      <Draggable key={aula.id} id={"disponivel_" + aula.id} isBlocked={isBlocked} aulaInfo={aula}>
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
            </div>
          </>
        ) : (
          <p>Por favor, preencha os filtros para acessar o conteúdo.</p>
        )}
      </div>
    </div>
    </DndContext >
  );
}

export default Horarios;