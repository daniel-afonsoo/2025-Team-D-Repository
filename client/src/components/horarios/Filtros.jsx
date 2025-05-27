import React, { useEffect, useState } from "react";

function Filtros({ escola, setEscola, docente, setDocente, sala, setSala, turma, setTurma, uc, setUc, curso, setCurso, ano, setAno, onFiltersChange }) {
  const [docentes, setDocentes] = useState([]);
  const [salas, setSalas] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [ucs, setUcs] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [anos, setAnos] = useState([]);
  const [escolas, setEscolas] = useState([]);

  // Fetch dropdown options on component mount
  useEffect(() => {
    fetch("/api/docentes")
      .then((response) => response.json())
      .then((data) => setDocentes(data))
      .catch((error) => console.error("Error fetching docentes:", error));

    fetch("/api/escolas")
      .then((response) => response.json())
      .then((data) => setEscolas(data))
      .catch((error) => console.error("Error fetching escolas:", error));

    fetch("/api/salas")
      .then((response) => response.json())
      .then((data) => setSalas(data))
      .catch((error) => console.error("Error fetching salas:", error));

    fetch("/api/turmas")
      .then((response) => response.json())
      .then((data) => setTurmas(data))
      .catch((error) => console.error("Error fetching turmas:", error));

    fetch("/api/ucs")
      .then((response) => response.json())
      .then((data) => setUcs(data))
      .catch((error) => console.error("Error fetching UCs:", error));

    fetch("/api/cursos")
      .then((response) => response.json())
      .then((data) => setCursos(data))
      .catch((error) => console.error("Error fetching cursos:", error));

    fetch("/api/anos")
      .then((response) => response.json())
      .then((data) => setAnos(data))
      .catch((error) => console.error("Error fetching anos:", error));
  }, []);

  // Trigger the query whenever any filter changes
  useEffect(() => {
    console.log("onFiltersChange prop:", onFiltersChange);
    if (typeof onFiltersChange === "function") {
      onFiltersChange({ escola, docente, sala, turma, uc, curso, ano });
    } else {
      console.error("onFiltersChange is not a function");
    }
  }, [escola, docente, sala, turma, uc, curso, ano, onFiltersChange]);

  return (
    <div className="filters-and-buttons">
      <div className="filtros">
        <h3>Filtros</h3>

        <label>
          Escola:
          <select onChange={(e) => {
            console.log("Escola selected:", e.target.value);
            setEscola(e.target.value)
            }} value={escola}>
            <option value="">Escolher Escola</option>
            {escolas.map((escola, index) => (
              <option key={index} value={escola}>
                {escola}
              </option>
            ))}
          </select>
        </label>

        <label>
          Docente:
          <select onChange={(e) => setDocente(e.target.value)} value={docente}>
            <option value="">Escolher Docente</option>
            {docentes.map((docente, index) => (
              <option key={index} value={docente}>
                {docente}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sala:
          <select onChange={(e) => setSala(e.target.value)} value={sala}>
            <option value="">Escolher Sala</option>
            {salas.map((sala, index) => (
              <option key={index} value={sala}>
                {sala}
              </option>
            ))}
          </select>
        </label>

        <label>
          Turma:
          <select onChange={(e) => setTurma(e.target.value)} value={turma}>
            <option value="">Escolher Turma</option>
            {turmas.map((turma, index) => (
              <option key={index} value={turma}>
                {turma}
              </option>
            ))}
          </select>
        </label>

        <label>
          Unidade Curricular (UC):
          <select onChange={(e) => setUc(e.target.value)} value={uc}>
            <option value="">Escolher UC</option>
            {ucs.map((uc, index) => (
              <option key={index} value={uc}>
                {uc}
              </option>
            ))}
          </select>
        </label>

        <label>
          Curso:
          <select onChange={(e) => setCurso(e.target.value)} value={curso}>
            <option value="">Escolher Curso</option>
            {cursos.map((curso, index) => (
              <option key={index} value={curso}>
                {curso}
              </option>
            ))}
          </select>
        </label>

        <label>
          Ano:
          <select onChange={(e) => setAno(e.target.value)} value={ano}>
            <option value="">Escolher Ano</option>
            {anos.map((ano, index) => (
              <option key={index} value={ano}>
                {ano}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export default Filtros;