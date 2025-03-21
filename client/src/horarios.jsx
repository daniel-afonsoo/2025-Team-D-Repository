import { useState } from "react";
import "./horarios.css";

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const horas = Array.from({ length: 31 }, (_, i) => {
  const startHour = 8 + Math.floor((i + 1) / 2);
  const startMinutes = i % 2 === 0 ? "30" : "00";
  const endHour = startMinutes === "30" ? startHour + 1 : startHour;
  const endMinutes = startMinutes === "30" ? "00" : "30";
  const startTime = `${startHour}:${startMinutes}`;
  const endTime = `${endHour === 24 ? "00" : endHour}:${endMinutes}`;
  return `${startTime} - ${endTime}`;
});

function Horarios() {
  const [escola, setEScola] = useState("");
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [turma, setTurma] = useState("");
  

  return (
    <div className="horarios-container">

      <div className="conteudo">
        {/* Tabela de horários */}
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
            {horas.map((hora, index) => (
              <tr key={index}>
                <td className="hora">{hora}</td>
                {diasSemana.map((dia, i) => (
                  <td key={i} className="empty-slot"></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Filtros e aba de aulas */}
        <div className="filtros-e-aulas">
          <div className="filtros">
            <select onChange={(e) => setInstituicao(e.target.value)}>
              <option value="">Escolher Escola</option>
              <option value="ESTT">ESTT</option>
              <option value="ESGT">ESGT</option>
            </select>
            <select onChange={(e) => setCurso(e.target.value)}>
              <option value="">Escolher Curso</option>
              <option value="Engenharia Informática">Engenharia Informática</option>
              <option value="Gestão">Gestão</option>
            </select>
            <select onChange={(e) => setAno(e.target.value)}>
              <option value="">Escolher Ano</option>
              <option value="1">1º Ano</option>
              <option value="2">2º Ano</option>
              <option value="3">3º Ano</option>
            </select>
            <select onChange={(e) => setTurma(e.target.value)}>
              <option value="">Escolher Turma</option>
              <option value="A">Turma A</option>
              <option value="B">Turma B</option>
            </select>
          </div>

          {/* Aba de arrastar aulas */}
          <div className="aulas">
            <h3>Aulas Disponíveis</h3>
            <div className="aula" draggable="true">Matemática II - Sala B257</div>
            <div className="aula" draggable="true">Introdução à Programação - Sala B128</div>
            <div className="aula" draggable="true">Programação Web - Sala B255</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Horarios;
