import React, { useState, useEffect } from "react";
import Draggable from "./horarios_components/draggable";
import Droppable from "./horarios_components/droppable";
import { handleDragEnd } from "./horarios_components/handleDragEnd";

import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import "../styles/horarios.css";
import socket from "../utils/socket"; // Import the socket instance
import { useSocket } from "../utils/useSocket";
import { useLocation } from "react-router-dom";

// Days of the week
const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// Generate time slots from 08:30 to 24:00 in 30-minute intervals
const horas = Array.from({ length: 31 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2); // The start hour
  const minutes = i % 2 === 0 ? "00" : "30"; // Alternates between 00 and 30 minutes
  const start = `${hour.toString().padStart(2, "0")}:${minutes}`; // Format start time
  const endHour = minutes === "30" ? hour + 1 : hour; // End hour is the next hour if start is :30
  const endMinutes = minutes === "30" ? "00" : "30"; // End minutes is 00 if start is :30
  const end = `${endHour.toString().padStart(2, "0")}:${endMinutes}`; // Format end time
  return `${start} - ${end}`;
});

// Main component
function Horarios(props) {
  const location = useLocation();
  const path = location.pathname;
  console.log("Path:", path);

  // lista das aulas marcadas
  const { aulasMarcadas } = useSocket();

  const [dropdownFilters, setDropdownFilters] = useState({
    anosemestre: [],
    cursos: [],
    turmas: [],
    ucs: [],
    salas: [],
    docentes: [],
  });

  // Funções para se conseguir ir buscar os nomes através dos códigos
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
    const docente = dropdownFilters.docentes.find(
      (d) => d.Cod_Docente == codDocente
    );
    return docente ? docente.Nome : codDocente;
  };

  const getNomeTurma = (codTurma) => {
    const turma = dropdownFilters.turmas.find((t) => t.Cod_Turma == codTurma);
    return turma ? turma.Turma_Abv : codTurma;
  };

  // aulas disponíveis
  const [aulasDisponiveis, setAulasDisponiveis] = useState([]); // Lista de aulas disponiveis
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

  const [isBlocked, setIsBlocked] = useState(false); // State to block the schedule
  const [erro, setErro] = useState(""); // State for error messages
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingAula, setEditingAula] = useState(null);
  const [selectedAula, setSelectedAula] = useState(null);

  // Filters
  const [semestre, setSemestre] = useState("");
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [turma, setTurma] = useState("");
  const [uc, setUc] = useState("");
  const [sala, setSala] = useState("");
  const [docente, setDocente] = useState("");

  // Add a search state and input field for filtering available classes
  const [searchQuery, setSearchQuery] = useState("");

  // Filter available classes based on the search query
  const filteredAulasDisponiveis = aulasDisponiveis.filter((aula) =>
    getNomeUC(aula.subject).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cursoSelecionado = dropdownFilters.cursos.find(
    (c) => c.Cod_Curso == curso
  );

  const ucDisponiveis = dropdownFilters.ucs.filter(
    (ucObj) => ucObj.Cod_Curso == curso
  );

  const duracaoCurso = cursoSelecionado ? Number(cursoSelecionado.Duracao) : 0;

  const anosPossiveis =
    duracaoCurso > 0
      ? Array.from({ length: duracaoCurso }, (_, i) => (i + 1).toString())
      : [];

  console.log("Anos possíveis gerados:", anosPossiveis);

  // Filtrar turmas disponíveis com base no semestre, curso e ano selecionados
  const turmasDisponiveis = dropdownFilters.turmas.filter(
    (turmaObj) =>
      turmaObj.Cod_AnoSemestre == semestre &&
      turmaObj.Cod_Curso == curso &&
      turmaObj.AnoTurma == ano
  );

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

  const addClass = () => {

      console.log("DEBUG - Tipo da UC:", typeof uc);

    const aulaCompleta = {
      id: aulasDisponiveis.length + 1,

      semestre: semestre,
      curso: curso,
      ano: ano,
      turma: turma,

      subject: uc, // UC selecionada
      location: sala, // Sala selecionada
      docente: docente, // Docente selecionado
      duration: newAula.duration, // Duração
    };

    // Adicionar à lista de aulas disponíveis
    setAulasDisponiveis((prev) => [...prev, aulaCompleta]);

    setUc("");
    setSala("");
    setDocente("");
    setNewAula({
      subject: "",
      location: "",
      docente: "",
      semestre: semestre,
      ano: ano,
      curso: curso,
      turma: turma,
      duration: newAula.duration,
      curso: "",
      turma: "",
      duration: 30,
    });

    // Fechar popup
    setShowAddPopup(false);

    console.log("Nova aula criada:", aulaCompleta);
    console.log(
      "Filtros mantidos - Semestre:",
      semestre,
      "Curso:",
      curso,
      "Ano:",
      ano,
      "Turma:",
      turma
    );
  };

  // Check if all filters are selected
  const filtrosSelecionados = curso && ano && turma;

  useEffect(() => {
    socket.emit("refresh-aulas");
  }, []);

  // ir buscar o endpoint filtro de dropdowns
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
    fetchDropdownFilters();
  }, []);

  return (
    <DndContext
      modifiers={[restrictToWindowEdges]}
      onDragEnd={(event) =>
        handleDragEnd(event, {
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
            <div className="filtros">
              <h3>Filtros</h3>
              {/* Primeira dropdown: anosemestre (independente) */}
              <select
                onChange={(e) => setSemestre(e.target.value)}
                value={semestre}
              >
                <option value="" disabled>
                  Escolher Semestre
                </option>
                {dropdownFilters.anosemestre.map((s) => (
                  <option key={s.Cod_AnoSemestre} value={s.Cod_AnoSemestre}>
                    {s.Nome}
                  </option>
                ))}
              </select>

              <select onChange={(e) => setCurso(e.target.value)} value={curso}>
                <option value="" disabled>
                  Escolher Curso
                </option>
                {dropdownFilters.cursos.map((cursoObj) => (
                  <option key={cursoObj.Cod_Curso} value={cursoObj.Cod_Curso}>
                    {cursoObj.Nome}
                  </option>
                ))}
              </select>

              <select
                onChange={(e) => setAno(e.target.value)}
                value={ano}
                disabled={!curso}
              >
                <option value="" disabled>
                  Escolher Ano
                </option>
                {anosPossiveis.map((anoVal) => (
                  <option key={anoVal} value={anoVal}>
                    {anoVal}º Ano
                  </option>
                ))}
              </select>

              <select
                onChange={(e) => setTurma(e.target.value)}
                value={turma}
                disabled={!ano}
              >
                <option value="" disabled>
                  Escolher Turma
                </option>
                {turmasDisponiveis.map((turmaObj) => (
                  <option key={turmaObj.Cod_Turma} value={turmaObj.Cod_Turma}>
                    {turmaObj.Turma_Abv}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conditionally render buttons when filters are selected */}
          {filtrosSelecionados && (
            <div className="filters-and-buttons">
              <button
                onClick={() => setShowAddPopup(true)}
                className="add-class-button"
              >
                Adicionar Aula
              </button>
              <button
                onClick={() => setIsBlocked((prev) => !prev)}
                className="block-btn"
              >
                {isBlocked ? "Desbloquear Horário" : "Bloquear Horário"}
              </button>
              <button
                onClick={() => openEditPopup(aulasMarcadas[0])} // Exemplo: abre o popup para a primeira aula marcada
                className="edit-class-button"
              >
                Editar Aula
              </button>
            </div>
          )}

          {/* Show content only if filters are selected */}
          {filtrosSelecionados ? (
            <>
              {/* Popup para adicionar aulas */}
              {showAddPopup && (
                <div className="add-popup">
                  <div className="popup-content">
                    <h3>Adicionar Aula</h3>
                    <select
                      onChange={(e) => setUc(e.target.value)}
                      value={uc}
                      disabled={!curso}
                    >
                      <option value="" disabled>
                        Escolher UC
                      </option>
                      {ucDisponiveis.map((ucObj) => (
                        <option key={ucObj.Cod_Uc} value={ucObj.Cod_Uc}>
                          {ucObj.Nome}
                        </option>
                      ))}
                    </select>

                    <select
                      onChange={(e) => setSala(e.target.value)}
                      value={sala}
                    >
                      <option value="" disabled>
                        Escolher Localização
                      </option>
                      {dropdownFilters.salas.map((salaObj) => (
                        <option key={salaObj.Cod_Sala} value={salaObj.Cod_Sala}>
                          {salaObj.Nome}
                        </option>
                      ))}
                    </select>

                    <select
                      onChange={(e) => setDocente(e.target.value)}
                      value={docente}
                    >
                      <option value="" disabled>
                        Escolher docente
                      </option>
                      {dropdownFilters.docentes.map((docenteObj) => (
                        <option
                          key={docenteObj.Cod_Docente}
                          value={docenteObj.Cod_Docente}
                        >
                          {docenteObj.Nome}
                        </option>
                      ))}
                    </select>

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
                    <button onClick={addClass}>Salvar</button>
                    <button onClick={() => setShowAddPopup(false)}>
                      Cancelar
                    </button>
                    {erro && <div className="error-message">{erro}</div>}
                  </div>
                </div>
              )}

              {/* Popup para editar aulas */}
              {showEditPopup && (
                <div className="add-popup">
                  <div className="popup-content">
                    <h3>Editar Aula</h3>
                    <select
                      onChange={handleAulaChange}
                      value={editingAula?.Cod_Aula || ""}
                    >
                      <option value="" disabled>
                        Selecione uma aula
                      </option>
                      {aulasMarcadas.map((aula) => (
                        <option key={aula.Cod_Aula} value={aula.Cod_Aula}>
                          {aula.subject} - {aula.location}
                        </option>
                      ))}
                    </select>
                    {editingAula && (
                      <>
                        <input
                          type="text"
                          placeholder="Disciplina"
                          value={editingAula.subject}
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
                          value={editingAula.location}
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
                        <button
                          onClick={() => deleteAula(editingAula.Cod_Aula)}
                        >
                          Excluir
                        </button>
                      </>
                    )}
                    <button onClick={() => setShowEditPopup(false)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div className="conteudo">
                <div className="timetable-and-available-classes">
                  <div className="timetable-container">
                    {erro && <div className="error-message">{erro}</div>}
                    <table className="timetable">
                      <thead>
                        <tr>
                          <th>Horas</th>
                          {diasSemana.map((dia) => (
                            <th key={dia}>{dia}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {horas.map((hora, index) => {
                          const horaInicio = hora.split(" - ")[0];
                          return (
                            <tr key={index}>
                              <td className="hora">{hora}</td>
                              {diasSemana.map((dia) => {
                                const cellId = `${dia}-${horaInicio}`;

                                // Prevent rendering cell if it's within an already spanned class
                                const isCellSpanned = aulasMarcadas.some(
                                  (cls) => {
                                    const classStartIndex = horas.findIndex(
                                      (h) => h.startsWith(cls.start)
                                    );
                                    const classEndIndex =
                                      classStartIndex + cls.duration / 30;
                                    const currentIndex = index;
                                    return (
                                      cls.day === dia &&
                                      currentIndex > classStartIndex &&
                                      currentIndex < classEndIndex
                                    );
                                  }
                                );
                                if (isCellSpanned) return null;

                                const classItem = aulasMarcadas.find(
                                  (cls) =>
                                    cls.day === dia && cls.start === horaInicio
                                );

                                if (classItem) {
                                  const durationBlocks =
                                    classItem.duration / 30;
                                  return (
                                    <td
                                      key={cellId}
                                      rowSpan={durationBlocks}
                                      className="class-cell"
                                      onContextMenu={(e) =>
                                        handleRightClick(e, classItem)
                                      }
                                    >
                                      <Draggable
                                        id={"marcada_" + classItem.Cod_Aula}
                                        isBlocked={isBlocked}
                                        aulaInfo={classItem}
                                      >
                                        <div className="class-entry">
                                          <strong>{getNomeUC(classItem.subject)}</strong>
                                          <br />
                                          <span className="location">
                                            {getNomeSala(classItem.location)}
                                          </span>
                                           <br />
                                          <span className="location">
                                            {getNomeDocente(classItem.docente)}
                                          </span>
                                        </div>
                                      </Draggable>
                                    </td>
                                  );
                                }

                                return (
                                  <Droppable
                                    key={cellId}
                                    id={cellId}
                                    isBlocked={isBlocked}
                                  />
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Available Classes */}
                  <Droppable id="aulas-disponiveis" isBlocked={false}>
                    <div className="aulas-disponiveis">
                      <h3>Aulas Disponíveis</h3>
                      <input
                        type="text"
                        placeholder="Pesquisar aulas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                      />
                      {filtrosSelecionados ? (
                        filteredAulasDisponiveis.length > 0 ? (
                          filteredAulasDisponiveis.map((aula) => (
                            <Draggable
                              key={aula.id}
                              id={"disponivel_" + aula.id}
                              isBlocked={isBlocked}
                              aulaInfo={aula}
                            >
                              <div className="aula-disponivel">
                                <strong>
                                  Curso: {getNomeCurso(aula.curso)}
                                </strong>
                                <p>Ano: {aula.ano}º</p>
                                <p>Turma: {getNomeTurma(aula.turma)}</p>
                                <p>UC: {getNomeUC(aula.subject)}</p>
                                <p>Docente: {getNomeDocente(aula.docente)}</p>
                                <p>Sala: {getNomeSala(aula.location)}</p>
                                <p>Duração: {aula.duration} min</p>
                              </div>
                            </Draggable>
                          ))
                        ) : (
                          <p>Nenhuma aula disponível.</p>
                        )
                      ) : (
                        <p>
                          Por favor, preencha os filtros para acessar as aulas
                          disponíveis.
                        </p>
                      )}
                    </div>
                  </Droppable>
                </div>
              </div>
            </>
          ) : (
            <p>Por favor, preencha os filtros para visualizar o horário.</p>
          )}
        </div>
      </div>
    </DndContext>
  );
}

export default Horarios;
