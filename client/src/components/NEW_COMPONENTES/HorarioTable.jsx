import React from "react";
import Draggable from "./Draggable";
import Droppable from "./Droppable";

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const HorarioTable = ({
  horas,
  aulasMarcadas = [],
  isBlocked,
  moveToDisponiveis,
  getNomeUC,
  getNomeSala,
  getNomeDocente,
  setErro,
}) => {
  
  console.log("🧩 Aulas recebidas na tabela:", aulasMarcadas);

  return (
    <div className="timetable-container">
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
                    return cls.day === dia && index > classStartIndex && index < classEndIndex;
                  });

                  if (isCellSpanned) return null;

                  const classItem = aulasMarcadas.find(
                    (cls) => cls.day === dia && cls.start === horaInicio
                  );

                  if (classItem) {
                    const durationBlocks = classItem.duration / 30;
                    return (
                      <td key={cellId} rowSpan={durationBlocks} className="class-cell">
                        <div className="class-cell-flex">
                          <Draggable
                            id={"marcada_" + classItem.Cod_Aula}
                            isBlocked={isBlocked}
                            aulaInfo={classItem}
                          >
                            <div className="class-entry">
                              <strong>{getNomeUC(classItem.subject)}</strong><br />
                              <span className="location">{getNomeSala(classItem.location)}</span><br />
                              <span className="location">{getNomeDocente(classItem.docente)}</span>
                            </div>
                          </Draggable>
                          <button
                            className="move-to-disponiveis-btn"
                            title="Mover para Aulas Disponíveis"
                            onClick={() => moveToDisponiveis(classItem)}
                          >
                            &rarr;
                          </button>
                        </div>
                      </td>
                    );
                  }

                  return <Droppable key={cellId} id={cellId} isBlocked={isBlocked} />;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HorarioTable;
