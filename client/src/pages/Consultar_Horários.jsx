import React, { useState, useCallback } from "react";
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

    // Only include non-empty filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    // Only fetch if at least one filter is selected
    if ([filters.escola, filters.docente, filters.sala, filters.turma, filters.uc, filters.curso, filters.ano].some(Boolean)) {
      fetch(`/api/aulas?${queryParams.toString()}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched aulas:", data);
          setAulasMarcadas(data);
        })
        .catch((error) => console.error("Error fetching aulas:", error));
    } else {
      setAulasMarcadas([]); // Clear the schedule if no filters are selected
    }
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