import React, { useState } from "react";
import Filtros from "../components/horarios/Filtros";
import Schedule from "../components/abas/Schedule";

function ConsultarHorarios() {
  const [escola, setEscola] = useState("");
  const [docente, setDocente] = useState("");
  const [sala, setSala] = useState("");
  const [turma, setTurma] = useState("");
  const [uc, setUc] = useState("");
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [aulasMarcadas, setAulasMarcadas] = useState([]);

  // Function to handle filter changes
  const onFiltersChange = useCallback((filters) => {
    console.log("Filters changed:", filters);

    const queryParams = new URLSearchParams({
      escola: filters.escola || "",
      docente: filters.docente || "",
      sala: filters.sala || "",
      turma: filters.turma || "",
      uc: filters.uc || "",
      curso: filters.curso || "",
      ano: filters.ano || "",
    });

    fetch(`/api/aulas?${queryParams.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched aulas:", data);
        setAulasMarcadas(data);
      })
      .catch((error) => console.error("Error fetching aulas:", error));
  }, []);

  return (
    <div className="horarios-container">
      <div className="filtros-container">
      <Filtros
        escola={escola}
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
        onFiltersChange={onFiltersChange} // Pass the function here
      />
      </div>
      <div className="schedule-container">
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