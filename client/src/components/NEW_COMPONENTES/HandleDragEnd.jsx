export function HandleDragEnd(
  event,
  { setErro, setAulasDisponiveis, aulasMarcadas, horas, socket }
) {
  const { active, over } = event;
  if (!over) {
    alert("Dropped outside the schedule");
    setErro("");

    if (active.id.startsWith("marcada_")) {
      const originalAula = active.data.current.aulaInfo;
      socket.emit("update-aulas", (prev) => [...prev, originalAula]);
    }
    return;
  }

  if (over.id === "aulas-disponiveis") {
    if (active.id.startsWith("marcada_")) {
      const originalAula = active.data.current.aulaInfo;
      setAulasDisponiveis((prev) => [
        ...prev,
        {
          id: (prev[prev.length - 1]?.id || 0) + 1,
          subject: originalAula.subject,
          location: originalAula.location,
          duration: originalAula.duration,
        },
      ]);
      socket.emit("update-aulas", (prev) =>
        prev.filter((aula) => aula.Cod_Aula !== originalAula.Cod_Aula)
      );
      socket.emit("remove-aula", { codAula: originalAula.Cod_Aula });
    }
    return;
  }

  const [day, start] = over.id.split("-");
  const startIndex = horas.findIndex((hora) => hora.startsWith(start));

  const overlappingClass = aulasMarcadas.find((cls) => {
    if (cls.Cod_Aula === active.data.current.aulaInfo.Cod_Aula) {
      return false;
    }
    const classStartIndex = horas.findIndex((hora) =>
      hora.startsWith(cls.start)
    );
    const classEndIndex = classStartIndex + cls.duration / 30;
    return (
      cls.day === day &&
      ((startIndex >= classStartIndex && startIndex < classEndIndex) ||
        (startIndex + active.data.current.aulaInfo.duration / 30 >
          classStartIndex &&
          startIndex + active.data.current.aulaInfo.duration / 30 <=
            classEndIndex))
    );
  });

  if (overlappingClass) {
    alert(
      "Cannot place a class that overlaps with another class. Please choose an empty slot."
    );
    if (active.id.startsWith("marcada_")) {
      const originalAula = active.data.current.aulaInfo;
      socket.emit("update-aulas", (prev) => [...prev, originalAula]);
    }
    return;
  }

  if (active.id.startsWith("disponivel_")) {
    const aulaInfo = active.data.current.aulaInfo;

    const newAula = {
      day,
      start,
      subject: aulaInfo.subject, // Código da UC
      location: aulaInfo.location, // Código da Sala
      duration: aulaInfo.duration,
      // Novos campos dos filtros
      docente: aulaInfo.docente, // Código do Docente
      turma: aulaInfo.turma, // Código da Turma
      course: aulaInfo.curso, // Código do Curso
      anoSem: aulaInfo.semestre, // Código do Semestre
      ano: aulaInfo.ano, // Ano
      end: calculateEndTime(start, aulaInfo.duration), // Calcular hora de fim
    };

    socket.emit("add-aula", { newAula });

    setAulasDisponiveis((prev) =>
      prev.filter((aula) => aula.id !== aulaInfo.id)
    );
  } else if (active.id.startsWith("marcada_")) {
    const codAula = active.data.current.aulaInfo.Cod_Aula;
    socket.emit("update-aula", { codAula, newDay: day, newStart: start });
  }
  
  function calculateEndTime(start, duration) {
    const [hours, minutes] = start.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMins
      .toString()
      .padStart(2, "0")}`;
  }
}
