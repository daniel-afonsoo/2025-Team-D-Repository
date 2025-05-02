import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import "../styles/horarios.css";
import socket from "../utils/socket";
import Filtros from "../components/horarios/Filtros";
import Scheduleold from "../components/abas/Schedule";

// Define o componente TabPanel
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box className="tab-content">
          <Typography component="div" className="tab-text">
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

function ConsultarHorarios() {
  const [tabIndex, setTabIndex] = useState(0); // Estado para controlar a aba ativa
  const [aulasMarcadas, setAulasMarcadas] = useState([]); // Estado para armazenar as aulas marcadas

  // Filtros
  const [escola, setEscola] = useState("");
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [turma, setTurma] = useState("");

  const filtrosSelecionados = escola && curso && ano && turma;

  // Buscar as aulas marcadas quando os filtros são selecionados
  useEffect(() => {
    if (filtrosSelecionados) {
      socket.emit("get-aulas");

      socket.on("update-aulas", (data) => {
        setAulasMarcadas(data.newAulas); // Atualiza as aulas marcadas
      });

      return () => {
        socket.off("update-aulas");
      };
    }
  }, [filtrosSelecionados, tabIndex]);

  return (
    <div className="horarios-container">
      <div className="layout">
        {/* Filtros */}
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

        {filtrosSelecionados ? (
          <>
            {/* Abas */}
            <Box className="tabs-container">
              <Tabs
                value={tabIndex}
                onChange={(e, newIndex) => setTabIndex(newIndex)}
                aria-label="Basic Tabs Example"
                className="tabs-wrapper"
                centered
              >
                <Tab label="Turmas" />
                <Tab label="Docentes" />
                <Tab label="Salas" />
              </Tabs>
            </Box>

            {/* Conteúdo das abas */}
            <TabPanel value={tabIndex} index={0}>
              <Scheduleold aulasMarcadas={aulasMarcadas} isBlocked={true} />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <Scheduleold aulasMarcadas={aulasMarcadas} isBlocked={true} />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              <Scheduleold aulasMarcadas={aulasMarcadas} isBlocked={true} />
            </TabPanel>
          </>
        ) : (
          <p>Por favor, preencha os filtros para acessar o conteúdo.</p>
        )}
      </div>
    </div>
  );
}

export default ConsultarHorarios;