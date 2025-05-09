import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import "../styles/horarios.css";
import socket from "../utils/socket";
import Filtros from "../components/horarios/Filtros";
import Schedule from "../components/abas/Schedule";
import AddAulaPopup from "../components/abas/AddAulaPopup";

function Horarios() {
  const [aulasMarcadas, setAulasMarcadas] = useState([]);
  const [newAula, setNewAula] = useState({ subject: "", location: "", duration: 30, day: "", start: "" });
  const [isBlocked, setIsBlocked] = useState(false);
  const [erro, setErro] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);

  const [escola, setEscola] = useState("1"); // Add escola state
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [turma, setTurma] = useState("");

  const filtrosSelecionados = escola && curso && ano && turma;

  console.log("Filtros selecionados:", { escola, curso, ano, turma, filtrosSelecionados });

  // Fetch aulas when filters are selected
  useEffect(() => {
    if (filtrosSelecionados) {
      console.log("Fetching aulas with filters:", { escola, curso, ano, turma });
      fetch(`/api/aulas?escola=${escola}&curso=${curso}&ano=${ano}&turma=${turma}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched aulas:", data);
          setAulasMarcadas(
            data.map((aula) => ({
              ...aula,
              day: aula.Dia,
              start: aula.Inicio.slice(0, 5), // Remove seconds from the time
              duration: calculateDuration(aula.Inicio, aula.Fim),
              subject: aula.Cod_Docente,
              location: aula.Cod_Sala,
            }))
          );
        })
        .catch((error) => console.error("Error fetching aulas:", error));
    } else {
      setAulasMarcadas([]);
    }
  }, [escola, curso, ano, turma]);

  const calculateDuration = (start, end) => {
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);
    return (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  };

  const addClass = () => {
    if (!newAula.subject || !newAula.location || !newAula.day || !newAula.start) {
      setErro("Preencha todos os campos para adicionar uma aula.");
      return;
    }

    const aulaData = {
      Cod_Docente: newAula.subject,
      Cod_Sala: newAula.location,
      Cod_Turma: turma,
      Cod_Uc: "UC001",
      Cod_Curso: curso,
      Cod_AnoSemestre: ano,
      Dia: newAula.day,
      Inicio: newAula.start,
      Fim: calculateEndTime(newAula.start, newAula.duration),
    };

    console.log("Emitting add-aula event with data:", aulaData);
    socket.emit("add-aula", { newAula: aulaData });
  };

  return (
    <DndContext modifiers={[restrictToWindowEdges]}>
      <div className="horarios-container">
        <div className="layout">
          {/* Filters */}
          <Filtros
            escola={escola} // Pass escola state
            setEscola={setEscola} // Pass setEscola function
            docente={newAula.subject}
            setDocente={(value) => setNewAula({ ...newAula, subject: value })}
            sala={newAula.location}
            setSala={(value) => setNewAula({ ...newAula, location: value })}
            turma={turma}
            setTurma={setTurma}
            uc={newAula.uc}
            setUc={(value) => setNewAula({ ...newAula, uc: value })}
            curso={curso}
            setCurso={setCurso}
            ano={ano}
            setAno={setAno}
          />

          {/* Buttons */}
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

          {/* Schedule */}
          {filtrosSelecionados && aulasMarcadas.length > 0 ? (
            <Schedule aulasMarcadas={aulasMarcadas} isBlocked={isBlocked} />
          ) : (
            <p>Por favor, preencha os filtros para acessar o conteúdo ou aguarde o carregamento.</p>
          )}

          {/* Add Aula Popup */}
          {showAddPopup && (
            <AddAulaPopup
              newAula={newAula}
              setNewAula={setNewAula}
              addClass={addClass}
              setShowAddPopup={setShowAddPopup}
              erro={erro}
            />
          )}
        </div>
      </div>
    </DndContext>
  );
}

export default Horarios;