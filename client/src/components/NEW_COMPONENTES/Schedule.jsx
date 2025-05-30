import React from "react";
import Draggable from "./draggable";
import Droppable from "./droppable";

function Schedule({
  diasSemana,
  horas,
  aulasMarcadas,
  isBlocked,
  getNomeUC,
  getNomeSala,
  getNomeDocente
}) {
  return (
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
        {horas.map((hora, index) => {
          const horaInicio = hora.split(" - ")[0];
          return (
            <tr key={index}>
              <td className="hora">{hora}</td>
              {diasSemana.map((dia) => {
                const cellId = `${dia}-${horaInicio}`;
                const isCellSpanned = aulasMarcadas.some((cls) => {
                  const classStartIndex = horas.findIndex((h) => h.startsWith(cls.start));
                  const classEndIndex = classStartIndex + cls.duration / 30;
                  const currentIndex = index;
                  return (
                    cls.day === dia &&
                    currentIndex > classStartIndex &&
                    currentIndex < classEndIndex
                  );
                });
                if (isCellSpanned) return null;

                const classItem = aulasMarcadas.find(
                  (cls) => cls.day === dia && cls.start === horaInicio
                );

                if (classItem) {
                  const durationBlocks = classItem.duration / 30;
                  return (
                    <td key={cellId} rowSpan={durationBlocks} className="class-cell">
                      <Draggable
                        id={"marcada_" + classItem.Cod_Aula}
                        isBlocked={isBlocked}
                        aulaInfo={classItem}
                      >
                        <div className="class-entry">
                          <strong>{getNomeUC(classItem.subject)}</strong>
                          <br />
                          <span className="location">{getNomeSala(classItem.location)}</span>
                          <br />
                          <span className="location">{getNomeDocente(classItem.docente)}</span>
                        </div>
                      </Draggable>
                    </td>
                  );
                }

                return (
                    <td key={cellId}>
                     <Droppable key={cellId} id={cellId} isBlocked={isBlocked} />
                    </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Schedule;