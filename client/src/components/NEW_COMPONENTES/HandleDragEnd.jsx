export default function HandleDragEnd(
  event,
  {
    setErro,
    setAulasDisponiveis,
    addAulaToSchedule,
    saveEditedAula,
    deleteAula,
    aulasMarcadas,
    horas,
    dropdownFilters,
    turma,
    curso,
    semestre,
  }
) {
  const { active, over } = event;
  if (!over) {
    alert("Dropped outside the schedule");
    setErro("");
    return;
  }

  const [day, start] = over.id.split("-");
  const startIndex = horas.findIndex((hora) => hora.startsWith(start));
  const aulaInfo = active.data.current.aulaInfo;

  const overlappingClass = aulasMarcadas.find((cls) => {
    if (cls.Cod_Aula === aulaInfo.Cod_Aula) return false;
    const classStartIndex = horas.findIndex((hora) =>
      hora.startsWith(cls.start)
    );
    const classEndIndex = classStartIndex + cls.duration / 30;
    return (
      cls.day === day &&
      ((startIndex >= classStartIndex && startIndex < classEndIndex) ||
        (startIndex + aulaInfo.duration / 30 > classStartIndex &&
          startIndex + aulaInfo.duration / 30 <= classEndIndex))
    );
  });

  if (overlappingClass) {
    alert("Conflito: esta aula sobrepõe outra. Escolha um horário vazio.");
    return;
  }

  // === 1. DRAG FROM DISPONIVEIS → GRADE
  if (active.id.startsWith("disponivel_")) {
    setAulasDisponiveis((prev) =>
      prev.filter((aula) => aula.id !== aulaInfo.id)
    );

    addAulaToSchedule(aulaInfo, day, start); // ✅ agora recebe todos os dados diretamente
  }

  // === 2. DRAG FROM GRADE → DISPONIVEIS
  else if (over.id === "aulas-disponiveis" && active.id.startsWith("marcada_")) {
    const aulaToRemove = aulasMarcadas.find((a) => a.Cod_Aula === aulaInfo.Cod_Aula);
    if (!aulaToRemove) return;

    const turmaInfo = dropdownFilters?.turmas?.find(t => t.Cod_Turma === aulaToRemove.Cod_Turma);
    const anoFromTurma = turmaInfo?.AnoTurma || "1";

    setAulasDisponiveis((prev) => [
      ...prev,
      {
        id: (prev[prev.length - 1]?.id || 0) + 1,
        subject: aulaToRemove.Cod_Uc,
        location: aulaToRemove.Cod_Sala,
        docente: aulaToRemove.Cod_Docente,
        duration: calculateDuration(aulaToRemove.Inicio, aulaToRemove.Fim),
        turma: aulaToRemove.Cod_Turma,
        curso: aulaToRemove.Cod_Curso,
        semestre: aulaToRemove.Cod_AnoSemestre,
        ano: anoFromTurma,
      },
    ]);

    deleteAula(aulaToRemove.Cod_Aula);
  }

  // === 3. DRAG FROM GRADE → DIFFERENT TIME/DAY
  else if (active.id.startsWith("marcada_")) {
    if (aulaInfo.day === day && aulaInfo.start === start) return;

    const aulaEditada = {
      Cod_Aula: aulaInfo.Cod_Aula,
      docente: aulaInfo.docente,
      location: aulaInfo.location,
      turma: aulaInfo.turma || turma,         // fallback para estado global
      subject: aulaInfo.subject,
      curso: aulaInfo.curso || curso,         // fallback para estado global
      semestre: aulaInfo.semestre || semestre, // fallback para estado global
      day,
      start,
      duration: Number(aulaInfo.duration),
    };

    saveEditedAula(aulaEditada);
  }

  function calculateDuration(inicio, fim) {
    const [h1, m1] = inicio.split(":").map(Number);
    const [h2, m2] = fim.split(":").map(Number);
    return h2 * 60 + m2 - (h1 * 60 + m1);
  }
}
