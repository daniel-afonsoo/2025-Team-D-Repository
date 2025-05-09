import React, { useState, useEffect } from "react";
import Filtros from "../components/horarios/Filtros";
import Schedule from "../components/abas/Schedule";
import "../styles/horarios.css"; // Ensure you have a CSS file for styling

function ConsultarHorarios() {
  // State variables for filters
  const [docente, setDocente] = useState("");
  const [sala, setSala] = useState("");
  const [turma, setTurma] = useState("");
  const [uc, setUc] = useState("");
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");

  // State variable for fetched schedule
  const [aulasMarcadas, setAulasMarcadas] = useState([]);

  // Fetch schedule when filters are applied
  useEffect(() => {
    if (docente || sala || turma || uc || curso || ano) {
      // Construct query parameters based on selected filters
      const queryParams = new URLSearchParams({
        docente,
        sala,
        turma,
        uc,
        curso,
        ano,
      });

      // Fetch aulas from the backend
      fetch(`/api/aulas?${queryParams.toString()}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched aulas:", data);
          setAulasMarcadas(data);
        })
        .catch((error) => console.error("Error fetching aulas:", error));
    }
  }, [docente, sala, turma, uc, curso, ano]); // Trigger fetch when any filter changes

  return (
    <div className="horarios-container">
      <div className="filtros-container">
        {/* Use the Filtros component */}
        <Filtros
          escola={escola} // Pass escola state
          setEscola={setEscola}
          docente={docente}
          setDocente={setDocente}
          sala={sala}
          setSala={setSala}
          turma={turma}
          setTurma={setTurma}
          uc={uc}
          setUc={setUc}
          curso={curso}
          setCurso={setCurso}
          ano={ano}
          setAno={setAno}
        />
      </div>
      <div className="schedule-container">
        {/* Display the schedule */}
        {aulasMarcadas.length > 0 ? (
          <Schedule aulasMarcadas={aulasMarcadas} isBlocked={true} />
        ) : (
          <p className="no-schedule-message">Por favor, selecione filtros para visualizar o horário.</p>
        )}
      </div>
    </div>
  );
}

export default ConsultarHorarios;