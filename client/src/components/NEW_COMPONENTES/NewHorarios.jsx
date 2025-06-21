import React from "react";
import { DndContext } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useLocation } from "react-router-dom";
import "../../styles/horarios.css";
import { useSocket } from "../../utils/hooks/useSocket";
import socket from "../../utils/socket";
import { useHorarios } from "../../utils/hooks/useHorarios";
import Filtros from "./Filtros";
import HorarioTable from "./HorarioTable";
import AulasDisponiveisBox from "./AulasDisponiveisBox";
import AddAulaPopup from "./AddAulaPopup";
import EditAulaPopup from "./EditAulaPopup";
import ControlButtons from "./ControlButtons";
import HandleDragEnd from "./HandleDragEnd";


// Funcao para gerar os intervalos de horas
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

  // Socket aulas marcadas
  const { aulasMarcadas } = useSocket();

  const {
    // estado dos filtros
    semestre, setSemestre,
    curso, setCurso,
    ano, setAno,
    turma, setTurma,
    uc, setUc,
    sala, setSala,
    docente, setDocente,

    // estados para lógica
    dropdownFilters,
    aulasDisponiveis, setAulasDisponiveis,
    newAula, setNewAula,
    isBlocked, setIsBlocked,
    erro, setErro,
    showAddPopup, setShowAddPopup,
    showEditPopup, setShowEditPopup,
    editingAula, setEditingAula,
    searchQuery, setSearchQuery,

    // derivados
    cursoSelecionado,
    anosPossiveis,
    turmasDisponiveis,
    ucDisponiveis,
    filtrosSelecionados,
    filteredAulasDisponiveis,

    // acoes
    addClass,
    addAulaToSchedule,
    moveToDisponiveis,
    openEditPopup,
    saveEditedAula,
    deleteAula,
    handleAulaChange,
  } = useHorarios(props.escola, aulasMarcadas);

  const getNomeCurso = (cod) => dropdownFilters.cursos.find(c => c.Cod_Curso == cod)?.Nome || cod;
  const getNomeUC = (cod) => dropdownFilters.ucs.find(u => u.Cod_Uc == cod)?.Nome || cod;
  const getNomeSala = (cod) => dropdownFilters.salas.find(s => s.Cod_Sala == cod)?.Nome || cod;
  const getNomeDocente = (cod) => dropdownFilters.docentes.find(d => d.Cod_Docente == cod)?.Nome || cod;
  const getNomeTurma = (cod) => dropdownFilters.turmas.find(t => t.Cod_Turma == cod)?.Turma_Abv || cod;


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