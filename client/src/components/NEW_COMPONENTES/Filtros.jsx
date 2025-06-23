import React from "react";

function Filtros({
  semestre, setSemestre,
  curso, setCurso,
  ano, setAno,
  turma, setTurma,
  dropdownFilters,
  anosPossiveis,
  turmasDisponiveis
}) {
  return (
    <div className="filtros">
      <h3>Filtros</h3>
      <select onChange={e => setSemestre(e.target.value)} value={semestre}>
        <option value="" disabled>Escolher Semestre</option>
        {dropdownFilters.anosemestre.map((s) => (
          <option key={s.Cod_AnoSemestre} value={s.Cod_AnoSemestre}>{s.Nome}</option>
        ))}
      </select>
      <select onChange={e => setCurso(e.target.value)} value={curso}>
        <option value="" disabled>Escolher Curso</option>
        {dropdownFilters.cursos.map((cursoObj) => (
          <option key={cursoObj.Cod_Curso} value={cursoObj.Cod_Curso}>{cursoObj.Nome}</option>
        ))}
      </select>
      <select onChange={e => setAno(e.target.value)} value={ano} disabled={!curso}>
        <option value="" disabled>Escolher Ano</option>
        {anosPossiveis.map((anoVal) => (
          <option key={anoVal} value={anoVal}>{anoVal}º Ano</option>
        ))}
      </select>
      <select onChange={e => setTurma(e.target.value)} value={turma} disabled={!ano}>
        <option value="" disabled>Escolher Turma</option>
        {turmasDisponiveis.map((turmaObj) => (
          <option key={turmaObj.Cod_Turma} value={turmaObj.Cod_Turma}>{turmaObj.Turma_Abv}</option>
        ))}
      </select>
    </div>
  );
}

export default Filtros;