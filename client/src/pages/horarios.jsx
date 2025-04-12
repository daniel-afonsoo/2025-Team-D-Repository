import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import "../styles/horarios.css";
import socket from "../utils/socket"; // Import the socket instance
import Filtros from "../components/horarios/Filtros";
import Draggable from "../components/horarios/Draggable";
import Scheduleold from "../components/abas/Schedule";

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
      socket.emit("get-aulas");

      socket.on("update-aulas", (data) => {
        setAulasMarcadas(data.newAulas); // Update the assigned classes
      });

      return () => {
        socket.off("update-aulas");
      };
    }
  }, [filtrosSelecionados]);

  // Fetch available (unassigned) classes when filters are selected
  useEffect(() => {
    if (filtrosSelecionados) {
      socket.emit("get-unassigned-aulas");

      socket.on("update-unassigned-aulas", (data) => {
        setAulasDisponiveis(data.unassignedAulas); // Update the available classes
      });

      return () => {
        socket.off("update-unassigned-aulas");
      };
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

      socket.emit("add-aula", { newAula });
      setAulasDisponiveis((prev) => prev.filter((aula) => aula.Cod_Aula !== active.data.current.aulaInfo.Cod_Aula));
    } else if (active.id.startsWith("marcada_")) {
      let codAula = active.data.current.aulaInfo.Cod_Aula;
      const [newDay, newStart] = over.id.split("-");
      socket.emit("update-aula", { codAula, newDay, newStart });
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
                <Scheduleold aulasMarcadas={aulasMarcadas} isBlocked={isBlocked} />

                <div className="aulas-disponiveis">
                  <h3>Aulas Disponíveis</h3>
                  {aulasDisponiveis.length > 0 ? (
                    aulasDisponiveis.map((aula) => (
                      <Draggable
                        key={aula.Cod_Aula}
                        id={"disponivel_" + aula.Cod_Aula}
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