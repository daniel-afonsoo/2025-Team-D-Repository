import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import socket from "../../utils/socket";
import { useSocket } from "../../utils/useSocket";
import { useLocation } from 'react-router-dom';
import "../../styles/horarios.css";
import Filtros from "./Filtros";
import Schedule from "./Schedule";
import AulasDisponiveis from "./AulasDisponiveis";

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
      onDragEnd={() => {/* handleDragEnd aqui se necessário */}}
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
            <div className="filters-and-buttons">
              <button onClick={() => setShowAddPopup(true)} className="add-class-button">
                Adicionar Aula
              </button>
              <button
                onClick={() => setIsBlocked((prev) => !prev)}
                className="block-btn"
                style={{
                  backgroundColor: isBlocked ? '#dc3545' : '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {isBlocked ? "🔴 Desbloquear Horário" : "🟢 Bloquear Horário"}
              </button>
              <button
                onClick={() => openEditPopup(aulasMarcadas[0])}
                className="edit-class-button"
              >
                Editar Aula
              </button>
            </div>
          )}

          <div className="conteudo">
            <div className="timetable-and-available-classes">
              <div className="timetable-container">
                {erro && <div className="error-message">{erro}</div>}
                <Schedule
                  diasSemana={diasSemana}
                  horas={horas}
                  aulasMarcadas={aulasMarcadas}
                  isBlocked={isBlocked}
                  getNomeUC={getNomeUC}
                  getNomeSala={getNomeSala}
                  getNomeDocente={getNomeDocente}
                />
              </div>
              <AulasDisponiveis
                filtrosSelecionados={filtrosSelecionados}
                filteredAulasDisponiveis={filteredAulasDisponiveis}
                isBlocked={isBlocked}
                getNomeCurso={getNomeCurso}
                getNomeTurma={getNomeTurma}
                getNomeUC={getNomeUC}
                getNomeDocente={getNomeDocente}
                getNomeSala={getNomeSala}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Popups para adicionar/editar aula (mantém lógica original) */}
      {showAddPopup && (
        <div className="add-popup">
          <div className="popup-content">
            <h3>Adicionar Aula</h3>
            <select onChange={(e) => setUc(e.target.value)} value={uc} disabled={!curso}>
              <option value="" disabled>Escolher UC</option>
              {ucDisponiveis.map((ucObj) => (
                <option key={ucObj.Cod_Uc} value={ucObj.Cod_Uc}>{ucObj.Nome}</option>
              ))}
            </select>
            <select onChange={(e) => setSala(e.target.value)} value={sala}>
              <option value="" disabled>Escolher Localização</option>
              {dropdownFilters.salas.map((salaObj) => (
                <option key={salaObj.Cod_Sala} value={salaObj.Cod_Sala}>{salaObj.Nome}</option>
              ))}
            </select>
            <select onChange={(e) => setDocente(e.target.value)} value={docente}>
              <option value="" disabled>Escolher docente</option>
              {dropdownFilters.docentes.map((docenteObj) => (
                <option key={docenteObj.Cod_Docente} value={docenteObj.Cod_Docente}>{docenteObj.Nome}</option>
              ))}
            </select>
            <select onChange={(e) => setNewAula({ ...newAula, day: e.target.value })} value={newAula.day}>
              <option value="" disabled>Escolher Dia</option>
              {diasSemana.map((dia) => (
                <option key={dia} value={dia}>{dia}</option>
              ))}
            </select>
            <input
              type="time"
              placeholder="Hora de início"
              value={newAula.start}
              onChange={(e) => setNewAula({ ...newAula, start: e.target.value })}
            />
            <input
              type="number"
              placeholder="Duração (minutos)"
              value={newAula.duration}
              onChange={(e) =>
                setNewAula({
                  ...newAula,
                  duration: parseInt(e.target.value, 10),
                })
              }
            />
            <div className="popup-buttons">
              <button onClick={addClass} className="btn-primary">Criar Aula Disponível</button>
              <button onClick={addAulaToSchedule} className="btn-success">Adicionar ao Horário</button>
              <button onClick={() => setShowAddPopup(false)} className="btn-secondary">Cancelar</button>
            </div>
            {erro && <div className="error-message">{erro}</div>}
          </div>
        </div>
      )}

      {showEditPopup && (
        <div className="add-popup">
          <div className="popup-content">
            <h3>Editar Aula</h3>
            <select onChange={handleAulaChange} value={editingAula?.Cod_Aula || ""}>
              <option value="" disabled>Selecione uma aula</option>
              {aulasMarcadas.map((aula) => (
                <option key={aula.Cod_Aula} value={aula.Cod_Aula}>
                  {getNomeUC(aula.subject)} - {getNomeSala(aula.location)}
                </option>
              ))}
            </select>
            {editingAula && (
              <>
                <input
                  type="text"
                  placeholder="Disciplina"
                  value={getNomeUC(editingAula.subject)}
                  onChange={(e) =>
                    setEditingAula({
                      ...editingAula,
                      subject: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Localização"
                  value={getNomeSala(editingAula.location)}
                  onChange={(e) =>
                    setEditingAula({
                      ...editingAula,
                      location: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Duração (minutos)"
                  value={editingAula.duration}
                  onChange={(e) =>
                    setEditingAula({
                      ...editingAula,
                      duration: parseInt(e.target.value, 10),
                    })
                  }
                />
                <button onClick={saveEditedAula}>Salvar</button>
                <button onClick={() => deleteAula(editingAula.Cod_Aula)}>Excluir</button>
              </>
            )}
            <button onClick={() => setShowEditPopup(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </DndContext>
  );
}

export default NewHorarios;