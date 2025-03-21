import { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
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

function Draggable({ id, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

function Droppable({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const style = {
    backgroundColor: isOver ? "lightblue" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}

function Horarios() {
  const [escola, setEScola] = useState("");
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [turma, setTurma] = useState("");
  const [sala, setSala] = useState("");
  const [aulas, setAulas] = useState({});
  const [disponiveis, setDisponiveis] = useState([
    "Matemática II - Sala B257",
    "Introdução à Programação - Sala B128",
    "Programação Web - Sala B255",
  ]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over) {
      setAulas((prevAulas) => {
        const newAulas = { ...prevAulas };
        // Remove the aula from its previous position
        Object.keys(newAulas).forEach((key) => {
          if (newAulas[key] === active.id) {
            delete newAulas[key];
          }
        });
        // Add the aula to its new position
        newAulas[over.id] = active.id;
        return newAulas;
      });
      setDisponiveis((prevDisponiveis) =>
        prevDisponiveis.filter((aula) => aula !== active.id)
      );
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
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
                    <Droppable key={i} id={`${dia}-${hora}`}>
                      <td className="empty-slot">
                        {aulas[`${dia}-${hora}`] && (
                          <Draggable id={aulas[`${dia}-${hora}`]}>
                            <div className="aula">{aulas[`${dia}-${hora}`]}</div>
                          </Draggable>
                        )}
                      </td>
                    </Droppable>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Filtros e aba de aulas */}
          <div className="filtros-e-aulas">
            <div className="filtros">
              <select onChange={(e) => setEScola(e.target.value)}>
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
              <select onChange={(e) => setSala(e.target.value)}>
                <option value="">Escolher Sala</option>
                <option value="B257">Sala B257</option>
                <option value="B128">Sala B128</option>
                <option value="B255">Sala B255</option>
              </select>
            </div>

            {/* Aba de arrastar aulas */}
            <div className="aulas">
              <h3>Aulas Disponíveis</h3>
              {disponiveis.map((aula) => (
                <Draggable key={aula} id={aula}>
                  <div className="aula">{aula}</div>
                </Draggable>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default Horarios;
