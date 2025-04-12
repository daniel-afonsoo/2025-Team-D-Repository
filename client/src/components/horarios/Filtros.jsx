import React from "react";

function Filtros({ escola, setEscola, curso, setCurso, ano, setAno, turma, setTurma }) {
  return (
    <div className="filters-and-buttons">
      <div className="filtros">
        <h3>Filtros</h3>
        <select onChange={(e) => setEscola(e.target.value)} value={escola}>
          <option value="">Escolher Escola</option>
          <option value="ESTT">ESTT</option>
          <option value="ESGT">ESGT</option>
        </select>
        <select onChange={(e) => setCurso(e.target.value)} value={curso}>
          <option value="">Escolher Curso</option>
          <option value="Engenharia Informática">Engenharia Informática</option>
          <option value="Gestão">Gestão</option>
        </select>
        <select onChange={(e) => setAno(e.target.value)} value={ano}>
          <option value="">Escolher Ano</option>
          <option value="1">1º Ano</option>
          <option value="2">2º Ano</option>
          <option value="3">3º Ano</option>
        </select>
        <select onChange={(e) => setTurma(e.target.value)} value={turma}>
          <option value="">Escolher Turma</option>
          <option value="A">Turma A</option>
          <option value="B">Turma B</option>
        </select>
      </div>
    </div>
  );
}

export default Filtros;