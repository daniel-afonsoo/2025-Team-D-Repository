import React, { useState, useEffect } from "react";
import { Box, Select, MenuItem, Typography } from "@mui/material";
import "../styles/horarios.css";
import Scheduleold from "../components/abas/Schedule";

function ConsultarHorarios() {
  const [aulasMarcadas, setAulasMarcadas] = useState([]); // Estado para armazenar as aulas marcadas

  // Dropdown options
  const [turmas, setTurmas] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [salas, setSalas] = useState([]);

  // Selected values
  const [selectedTurma, setSelectedTurma] = useState("");
  const [selectedDocente, setSelectedDocente] = useState("");
  const [selectedSala, setSelectedSala] = useState("");

  // Fetch dropdown options on component mount
  useEffect(() => {
        fetch("/api/turmas")
      .then((response) => {
        console.log("Raw response for turmas:", response);
        return response.text(); // Log raw text
      })
      .then((text) => {
        console.log("Raw text for turmas:", text);
        return JSON.parse(text); // Parse manually
      })
      .then((data) => setTurmas(data))
      .catch((error) => console.error("Error fetching turmas:", error));
    
    fetch("/api/docentes")
      .then((response) => {
        console.log("Raw response for docentes:", response);
        return response.text(); // Log raw text
      })
      .then((text) => {
        console.log("Raw text for docentes:", text);
        return JSON.parse(text); // Parse manually
      })
      .then((data) => setDocentes(data))
      .catch((error) => console.error("Error fetching docentes:", error));
    
    fetch("/api/aulas")
      .then((response) => {
        console.log("Raw response for aulas:", response);
        return response.text(); // Log raw text
      })
      .then((text) => {
        console.log("Raw text for aulas:", text);
        return JSON.parse(text); // Parse manually
      })
      .then((data) => setSalas(data))
      .catch((error) => console.error("Error fetching salas:", error));
  }, []);

  // Fetch aulasMarcadas when a filter is selected
  useEffect(() => {
    if (selectedTurma || selectedDocente || selectedSala) {
      fetch("/api/aulas")
        .then((response) => response.json())
        .then((data) => setAulasMarcadas(data))
        .catch((error) => console.error("Error fetching aulas marcadas:", error));
    }
  }, [selectedTurma, selectedDocente, selectedSala]);

  return (
    <div className="horarios-container">
      <div className="layout">
        {/* Dropdowns */}
        <Box className="dropdowns-container">
          <Select
            value={selectedTurma}
            onChange={(e) => setSelectedTurma(e.target.value)}
            displayEmpty
            className="dropdown"
          >
            <MenuItem value="">Selecione uma Turma</MenuItem>
            {turmas.map((turma) => (
              <MenuItem key={turma.Cod_Turma} value={turma.Cod_Turma}>
                {`Turma ${turma.Cod_Turma} - Curso ${turma.Cod_Curso}`}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={selectedDocente}
            onChange={(e) => setSelectedDocente(e.target.value)}
            displayEmpty
            className="dropdown"
          >
            <MenuItem value="">Selecione um Docente</MenuItem>
            {docentes.map((docente) => (
              <MenuItem key={docente.Cod_Docente} value={docente.Cod_Docente}>
                {docente.Nome}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={selectedSala}
            onChange={(e) => setSelectedSala(e.target.value)}
            displayEmpty
            className="dropdown"
          >
            <MenuItem value="">Selecione uma Sala</MenuItem>
            {salas.map((sala) => (
              <MenuItem key={sala.Cod_Sala} value={sala.Cod_Sala}>
                {`Sala ${sala.Cod_Sala}`}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Schedule */}
        {selectedTurma || selectedDocente || selectedSala ? (
          <Scheduleold aulasMarcadas={aulasMarcadas} isBlocked={true} />
        ) : (
          <p>Por favor, selecione uma Turma, Docente ou Sala para acessar o conteúdo.</p>
        )}
      </div>
    </div>
  );
}

export default ConsultarHorarios;