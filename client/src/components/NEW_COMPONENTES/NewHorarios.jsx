import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import socket from "../../utils/socket";
import { useSocket } from "../../utils/useSocket";
import { useLocation } from 'react-router-dom';
import "../../styles/horarios.css";
import Filtros from "./Filtros";
import { HandleDragEnd } from "./HandleDragEnd";
import HorarioTable from "./HorarioTable";
import AulasDisponiveisBox from "./AulasDisponiveisBox";
import AddAulaPopup from "./AddAulaPopup";
import EditAulaPopup from "./EditAulaPopup";
import ControlButtons from "./ControlButtons";

// Dias da semana e horas
const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const horas = Array.from({ length: 31 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  const start = `${hour.toString().padStart(2, "0")}:${minutes}`;
  const endHour = minutes === "30" ? hour + 1 : hour;
  const endMinutes = minutes === "30" ? "00" : "30";
  const end = `${endHour.toString().padStart(2, "0")}:${endMinutes}`;
  return `${start} - ${end}`;
});

function NewHorarios(props) {
  const location = useLocation();
  const path = location.pathname;

  // Socket aulas marcadas
  const { aulasMarcadas } = useSocket();

  // Dropdown filters
  const [dropdownFilters, setDropdownFilters] = useState({
    anosemestre: [],
    cursos: [],
    turmas: [],
    ucs: [],
    salas: [],
    docentes: [],
  });

  // Funções para obter nomes
  const getNomeCurso = (codCurso) => {
    const curso = dropdownFilters.cursos.find((c) => c.Cod_Curso == codCurso);
    return curso ? curso.Nome : codCurso;
  };
  const getNomeUC = (codUC) => {
    const uc = dropdownFilters.ucs.find((u) => u.Cod_Uc == codUC);
    return uc ? uc.Nome : codUC;
  };
  const getNomeSala = (codSala) => {
    const sala = dropdownFilters.salas.find((s) => s.Cod_Sala == codSala);
    return sala ? sala.Nome : codSala;
  };
  const getNomeDocente = (codDocente) => {
    const docente = dropdownFilters.docentes.find((d) => d.Cod_Docente == codDocente);
    return docente ? docente.Nome : codDocente;
  };
  const getNomeTurma = (codTurma) => {
    const turma = dropdownFilters.turmas.find((t) => t.Cod_Turma == codTurma);
    return turma ? turma.Turma_Abv : codTurma;
  };

  // Estados dos filtros
  const [semestre, setSemestre] = useState("");
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [turma, setTurma] = useState("");
  const [uc, setUc] = useState("");
  const [sala, setSala] = useState("");
  const [docente, setDocente] = useState("");

  // Estados auxiliares
  const [aulasDisponiveis, setAulasDisponiveis] = useState([]);
  const [newAula, setNewAula] = useState({
    subject: "",
    location: "",
    docente: "",
    semestre: "",
    ano: "",
    curso: "",
    turma: "",
    duration: 30,
  });
  const [isBlocked, setIsBlocked] = useState(false);
  const [erro, setErro] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingAula, setEditingAula] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtros dependentes
  const cursoSelecionado = dropdownFilters.cursos.find((c) => c.Cod_Curso == curso);
  const ucDisponiveis = dropdownFilters.ucs.filter((ucObj) => ucObj.Cod_Curso == curso);
  const duracaoCurso = cursoSelecionado ? Number(cursoSelecionado.Duracao) : 0;
  const anosPossiveis = duracaoCurso > 0 ? Array.from({ length: duracaoCurso }, (_, i) => (i + 1).toString()) : [];
  const turmasDisponiveis = dropdownFilters.turmas.filter(
    (turmaObj) =>
      turmaObj.Cod_AnoSemestre == semestre &&
      turmaObj.Cod_Curso == curso &&
      turmaObj.AnoTurma == ano
  );

  // Filtrar aulas disponíveis pelo search
  const filteredAulasDisponiveis = aulasDisponiveis.filter((aula) =>
    getNomeUC(aula.subject).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Função para mover aula do horário para aulas disponíveis
  const moveToDisponiveis = (classItem) => {
    // Remove a aula do servidor
    socket.emit("remove-aula", { codAula: classItem.Cod_Aula });

    // Adiciona à lista de aulas disponíveis
    setAulasDisponiveis((prev) => [
      ...prev,
      {
        id: (prev[prev.length - 1]?.id || 0) + 1,
        semestre,
        curso,
        ano,
        turma,
        subject: classItem.subject,
        location: classItem.location,
        docente: classItem.docente,
        duration: classItem.duration,
      },
    ]);
  };

  // Funções de popup e edição
  const openEditPopup = (aula) => {
    setEditingAula(aula);
    setShowEditPopup(true);
  };
  const saveEditedAula = () => {
    if (editingAula) {
      socket.emit("update-aula", {
        codAula: editingAula.Cod_Aula,
        newSubject: editingAula.subject,
        newLocation: editingAula.location,
        newDuration: editingAula.duration,
      });
      setShowEditPopup(false);
      setEditingAula(null);
    }
  };
  const deleteAula = (codAula) => {
    socket.emit("delete-aula", { codAula });
    setShowEditPopup(false);
  };
  const handleAulaChange = (event) => {
    const aulaId = event.target.value;
    const aula = aulasMarcadas.find((a) => a.Cod_Aula === aulaId);
    setEditingAula(aula);
  };

  // Função para adicionar aula disponível
  const addClass = () => {
    const aulaCompleta = {
      id: aulasDisponiveis.length + 1,
      semestre,
      curso,
      ano,
      turma,
      subject: uc,
      location: sala,
      docente,
      duration: newAula.duration,
    };
    setAulasDisponiveis((prev) => [...prev, aulaCompleta]);
    setUc("");
    setSala("");
    setDocente("");
    setNewAula({
      subject: "",
      location: "",
      docente: "",
      semestre,
      ano,
      curso,
      turma,
      duration: 30,
    });
    setShowAddPopup(false);
  };

  // Função para calcular hora final
  const calculateEndTime = (start, duration) => {
    const [hours, minutes] = start.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  // Função para adicionar aula ao horário
  const addAulaToSchedule = () => {
    if (!newAula.subject || !newAula.location || !newAula.day || !newAula.start) {
      setErro("Preencha todos os campos para adicionar uma aula.");
      return;
    }
    const aulaData = {
      Cod_Docente: newAula.subject,
      Cod_Sala: newAula.location,
      Cod_Turma: turma,
      Cod_Uc: uc,
      Cod_Curso: curso,
      Cod_AnoSemestre: semestre,
      Dia: newAula.day,
      Inicio: newAula.start,
      Fim: calculateEndTime(newAula.start, newAula.duration),
    };
    socket.emit("add-aula", { newAula: aulaData });
    setShowAddPopup(false);
    setErro("");
  };

  // Filtros selecionados
  const filtrosSelecionados = curso && ano && turma;

  // Carregar filtros do backend
  useEffect(() => {
    const fetchDropdownFilters = async () => {
      try {
        const response = await fetch(
          `http://localhost:5170/getDropdownFilters?escola=${props.escola}`
        );
        const data = await response.json();
        setDropdownFilters(data);
      } catch (error) {
        console.error("Error fetching dropdown filters:", error);
      }
    };
    if (props.escola) {
      fetchDropdownFilters();
    }
  }, [props.escola]);

  // Reset filters quando dependências mudam
  useEffect(() => {
    setCurso("");
    setAno("");
    setTurma("");
  }, [semestre]);
  useEffect(() => {
    setAno("");
    setTurma("");
  }, [curso]);
  useEffect(() => {
    setTurma("");
  }, [ano]);

  // Refresh aulas marcadas no início
  useEffect(() => {
    socket.emit("refresh-aulas");
  }, []);

  return (
    <DndContext
      modifiers={[restrictToWindowEdges]}
      onDragEnd={(event) =>
        HandleDragEnd(event, {
          setErro,
          setAulasDisponiveis,
          aulasMarcadas,
          horas,
          socket,
        })
      }
    >
      <div className="horarios-container">
        <div className="layout">
          <div className="filters-and-buttons">
            <Filtros
              semestre={semestre}
              setSemestre={setSemestre}
              curso={curso}
              setCurso={setCurso}
              ano={ano}
              setAno={setAno}
              turma={turma}
              setTurma={setTurma}
              dropdownFilters={dropdownFilters}
              anosPossiveis={anosPossiveis}
              turmasDisponiveis={turmasDisponiveis}
            />
          </div>

          {filtrosSelecionados && (
            <ControlButtons
              isBlocked={isBlocked}
              setIsBlocked={setIsBlocked}
              setShowAddPopup={setShowAddPopup}
              setShowEditPopup={() => openEditPopup(aulasMarcadas[0])}
              aulasMarcadas={aulasMarcadas}
            />
          )}

          {/* Show content only if filters are selected */}
          {filtrosSelecionados ? (
            <>
              <div className="conteudo">
                <div className="timetable-and-available-classes">
                  {/* Tabela do horário */}
                  <div className="timetable-container">
                    {erro && <div className="error-message">{erro}</div>}
                    <HorarioTable
                      horas={horas}
                      aulasMarcadas={aulasMarcadas}
                      isBlocked={isBlocked}
                      moveToDisponiveis={moveToDisponiveis}
                      getNomeUC={getNomeUC}
                      getNomeSala={getNomeSala}
                      getNomeDocente={getNomeDocente}
                      setErro={setErro}
                    />
                  </div>

                  {/* Aulas Disponíveis */}
                  <AulasDisponiveisBox
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filteredAulasDisponiveis={filteredAulasDisponiveis}
                    isBlocked={isBlocked}
                    filtrosSelecionados={filtrosSelecionados}
                    getNomeCurso={getNomeCurso}
                    getNomeTurma={getNomeTurma}
                    getNomeUC={getNomeUC}
                    getNomeDocente={getNomeDocente}
                    getNomeSala={getNomeSala}
                  />

                </div>
              </div>
            </>
          ) : (
            <p>Por favor, preencha os filtros para visualizar o horário.</p>
          )}
        </div>
      </div>

      <AddAulaPopup
        uc={uc}
        setUc={setUc}
        sala={sala}
        setSala={setSala}
        docente={docente}
        setDocente={setDocente}
        newAula={newAula}
        setNewAula={setNewAula}
        dropdownFilters={dropdownFilters}
        ucDisponiveis={ucDisponiveis}
        show={showAddPopup}
        setShow={setShowAddPopup}
        erro={erro}
        addClass={addClass}
        addAulaToSchedule={addAulaToSchedule}
        curso={curso}
      />

      <EditAulaPopup
        aulasMarcadas={aulasMarcadas}
        editingAula={editingAula}
        setEditingAula={setEditingAula}
        show={showEditPopup}
        setShow={setShowEditPopup}
        getNomeUC={getNomeUC}
        getNomeSala={getNomeSala}
        handleAulaChange={handleAulaChange}
        saveEditedAula={saveEditedAula}
        deleteAula={deleteAula}
      />

    </DndContext>
  );
}

export default NewHorarios;