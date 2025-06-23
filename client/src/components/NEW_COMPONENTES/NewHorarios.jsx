import React from "react";
import { DndContext } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import "../../styles/horarios.css";
import socket from "../../utils/socket";
import { useHorarios } from "../../utils/hooks/useHorarios";
import Filtros from "./Filtros";
import HorarioTable from "./HorarioTable";
import AulasDisponiveisBox from "./AulasDisponiveisBox";
import AddAulaPopup from "./AddAulaPopup";
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

  const {
    // Aulas marcadas (baseado no código da turma)
    aulasMarcadas,
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
    saveEditedAula,
    deleteAula,
  } = useHorarios(props.escola);

  const getNomeCurso = (cod) => dropdownFilters.cursos.find(c => c.Cod_Curso == cod)?.Nome || cod;
  const getNomeUC = (cod) => dropdownFilters.ucs.find(u => u.Cod_Uc == cod)?.Nome || cod;
  const getNomeSala = (cod) => dropdownFilters.salas.find(s => s.Cod_Sala == cod)?.Nome || cod;
  const getNomeDocente = (cod) => dropdownFilters.docentes.find(d => d.Cod_Docente == cod)?.Nome || cod;
  const getNomeTurma = (cod) => dropdownFilters.turmas.find(t => t.Cod_Turma == cod)?.Turma_Abv || cod;
  const getAnoTurma = (cod) => dropdownFilters.turmas.find(t => t.Cod_Turma == cod)?.AnoTurma || "?";


  return (
    <DndContext
      modifiers={[restrictToWindowEdges]}
      onDragEnd={(event) =>
        HandleDragEnd(event, {
          setErro,
          setAulasDisponiveis,
          setNewAula,
          addAulaToSchedule,
          saveEditedAula,
          deleteAula,
          aulasMarcadas,
          horas,
          dropdownFilters,
          turma,     
          curso,     
          semestre,
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
                    getAnoTurma={getAnoTurma}
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

    </DndContext>
  );
}

export default NewHorarios;