import React from "react";
import "../../styles/schedule.css";
import Droppable from "../horarios/Droppable";
import Draggable from "../horarios/Draggable";

// Dias da semana
const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// Gera blocos vazios do horário desde 08:00h até 24:00h
const horas = Array.from({ length: 31 }, (_, i) => {
  const startHour = 8 + Math.floor((i + 1) / 2);
  const startMinutes = i % 2 === 0 ? "30" : "00";
  const endHour = startMinutes === "30" ? startHour + 1 : startHour;
  const endMinutes = startMinutes === "30" ? "00" : "30";
  return `${startHour}:${startMinutes} - ${endHour === 24 ? "00" : endHour}:${endMinutes}`;
});

// Mostra o horário das aulas marcadas
function Schedule({ aulasMarcadas, isBlocked }) {
  console.log("Rendering Schedule component...");
  console.log("aulasMarcadas:", aulasMarcadas);
  return (
    <div className="schedule-container">
      <table className="schedule-table">
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
              {diasSemana.map((dia) => {
                // Get start time in "HH:MM" format
                const startTime = hora.split(" - ")[0] + ":00";
                // Find aula that matches this day and start time
                const classItem = aulasMarcadas.find(
                  (cls) => cls.Dia === dia && cls.Inicio === startTime
                );

                if (classItem) {
                  // Calculate duration in 30-min blocks
                  const [startHour, startMin] = classItem.Inicio.split(":").map(Number);
                  const [endHour, endMin] = classItem.Fim.split(":").map(Number);
                  const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
                  const durationBlocks = durationMinutes / 30;

                  return (
                    <Droppable
                      id={`${dia}-${hora.split(" - ")[0]}`}
                      isBlocked={isBlocked}
                      key={`${dia}-${hora}`}
                    >
                      <Draggable
                        id={"marcada_" + classItem.Cod_Aula}
                        isBlocked={isBlocked}
                        aulaInfo={classItem}
                      >
                        <div
                          className="class-entry"
                          style={{
                            gridRow: `span ${durationBlocks}`,
                          }}
                        >
                          <strong>UC: {classItem.Cod_Uc}</strong>
                          <br />
                          <span className="location">Sala: {classItem.Cod_Sala}</span>
                        </div>
                      </Draggable>
                    </Droppable>
                  );
                }

                return (
                  <Droppable
                    id={`${dia}-${hora.split(" - ")[0]}`}
                    isBlocked={isBlocked}
                    key={`${dia}-${hora}`}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Schedule;