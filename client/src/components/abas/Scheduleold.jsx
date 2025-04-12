import React from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import "../../styles/schedule.css";

// Days of the week
const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// Generate time slots (from 8:30 to 24:00)
const horas = Array.from({ length: 31 }, (_, i) => {
  const startHour = 8 + Math.floor((i + 1) / 2);
  const startMinutes = i % 2 === 0 ? "30" : "00";
  const endHour = startMinutes === "30" ? startHour + 1 : startHour;
  const endMinutes = startMinutes === "30" ? "00" : "30";
  return `${startHour}:${startMinutes} - ${endHour === 24 ? "00" : endHour}:${endMinutes}`;
});

// Draggable component
function Draggable({ id, children, isBlocked, aulaInfo }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { aulaInfo },
    disabled: isBlocked,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: isBlocked ? "not-allowed" : "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="aula"
    >
      {children}
    </div>
  );
}

// Droppable component
function Droppable({ id, children, isBlocked }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  const style = {
    backgroundColor: isOver && !isBlocked ? "lightblue" : undefined,
  };

  return (
    <td ref={setNodeRef} style={style} className="empty-slot">
      {children}
    </td>
  );
}

function Schedule({ aulasMarcadas, isBlocked }) {
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
                const classItem = aulasMarcadas.find(
                  (cls) => cls.day === dia && cls.start === hora.split(" - ")[0]
                );

                if (classItem) {
                  const durationBlocks = classItem.duration / 30;
                  return (
                    <Droppable id={`${dia}-${hora.split(" - ")[0]}`} isBlocked={isBlocked} key={`${dia}-${hora}`}>
                      <Draggable id={"marcada_" + classItem.Cod_Aula} isBlocked={isBlocked} aulaInfo={classItem}>
                        <div
                          className="class-entry"
                          style={{
                            gridRow: `span ${durationBlocks}`, // Assuming each grid row represents 30 minutes
                          }}
                        >
                          <strong>{classItem.subject}</strong>
                          <br />
                          <span className="location">{classItem.location}</span>
                        </div>
                      </Draggable>
                    </Droppable>
                  );
                }

                return (
                  <Droppable id={`${dia}-${hora.split(" - ")[0]}`} isBlocked={isBlocked} key={`${dia}-${hora}`} />
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