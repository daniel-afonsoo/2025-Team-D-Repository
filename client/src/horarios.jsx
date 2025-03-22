import { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
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

// Componente Draggable (aula que pode ser movida)
function Draggable({ id, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="aula">
      {children}
    </div>
  );
}

// Componente Droppable (célula que pode receber aulas)
function Droppable({ id, aulas, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const style = {
    backgroundColor: isOver ? "lightblue" : undefined,
  };

  return (
    <td ref={setNodeRef} style={style} className="empty-slot">
      {aulas.map((aula) => (
        <Draggable key={aula} id={aula}>
          {aula}
        </Draggable>
      ))}
      {children}
    </td>
  );
}

function Horarios() {
  const [escola, setEscola] = useState("");
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [turma, setTurma] = useState("");
  const [sala, setSala] = useState("");

  // Aulas disponíveis para arrastar
  const [disponiveis, setDisponiveis] = useState([
    "Matemática II - Sala B257",
    "Introdução à Programação - Sala B128",
    "Programação Web - Sala B255",
  ]);

  // Aulas que foram colocadas no horário
  const [aulas, setAulas] = useState({});

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
  
    setAulas((prevAulas) => {
      const newAulas = { ...prevAulas };
  
      // Remove the class from any previous slots
      Object.keys(newAulas).forEach((slot) => {
        newAulas[slot] = newAulas[slot].filter((aula) => aula !== active.id);
        if (newAulas[slot].length === 0) delete newAulas[slot];
      });
  
      // Add the class to the new slot
      if (!newAulas[over.id]) {
        newAulas[over.id] = [];
      }
      newAulas[over.id].push(active.id);
  
      return newAulas;
    });
  
    // Remove the class from the "Available Classes" list if it's dragged to the timetable
    setDisponiveis((prevDisponiveis) => prevDisponiveis.filter((aula) => aula !== active.id));
  };
  
  

  // Função para remover uma aula do horário e devolver à aba de disponíveis
  const removerAula = (diaHora, aula) => {
    setAulas((prevAulas) => {
      const newAulas = { ...prevAulas };
      newAulas[diaHora] = newAulas[diaHora].filter((a) => a !== aula);

      // Se não houver mais aulas na célula, removemos a chave
      if (newAulas[diaHora].length === 0) {
        delete newAulas[diaHora];
      }

      return newAulas;
    });

    // Devolve a aula para as disponíveis
    setDisponiveis((prevDisponiveis) => [...prevDisponiveis, aula]);
  };

  return (
    <DndContext modifiers={[restrictToWindowEdges]} onDragEnd={handleDragEnd}>
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
                  {diasSemana.map((dia) => (
                    <Droppable key={`${dia}-${hora}`} id={`${dia}-${hora}`} aulas={aulas[`${dia}-${hora}`] || []}>
                      {/* Botão para remover aulas */}
                      {(aulas[`${dia}-${hora}`] || []).map((aula) => (
                        <div key={aula} className="aula-container">
                          <span>{aula}</span>
                          <button className="remove-btn" onClick={() => removerAula(`${dia}-${hora}`, aula)}>
                            X
                          </button>
                        </div>
                      ))}
                    </Droppable>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Filtros e aba de aulas */}
          <div className="filtros-e-aulas">
            <div className="filtros">
              <select onChange={(e) => setEscola(e.target.value)}>
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
