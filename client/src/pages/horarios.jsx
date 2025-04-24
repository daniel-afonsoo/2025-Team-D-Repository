import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import "../styles/horarios.css";
import socket from "../utils/socket"; // Import the socket instance
import Filtros from "../components/horarios/Filtros";
import Draggable from "../components/horarios/Draggable";
import Scheduleold from "../components/abas/Schedule";

// TabPanel component to manage tab content
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box className="tab-content">
          <Typography className="tab-text">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function Horarios() {
  const [tabIndex, setTabIndex] = useState(0); // State to track the active tab
  const [aulasMarcadas, setAulasMarcadas] = useState([]); // State to store assigned classes
  const [aulasDisponiveis, setAulasDisponiveis] = useState([]); // State to store available classes
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

  // Fetch assigned classes when filters are selected or when the tab changes
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
  }, [filtrosSelecionados, tabIndex]);

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
              <TabPanel value={tabIndex} index={0}>
                <Scheduleold aulasMarcadas={aulasMarcadas} isBlocked={isBlocked} />
              </TabPanel>
              <TabPanel value={tabIndex} index={1}>
                <Scheduleold aulasMarcadas={aulasMarcadas} isBlocked={isBlocked} />
              </TabPanel>
              <TabPanel value={tabIndex} index={2}>
                <Scheduleold aulasMarcadas={aulasMarcadas} isBlocked={isBlocked} />
              </TabPanel>
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