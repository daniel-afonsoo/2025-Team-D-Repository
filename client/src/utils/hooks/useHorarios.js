import { useState, useEffect } from "react";
import socket from "../socket";

export function useHorarios(escola) {
  const [dropdownFilters, setDropdownFilters] = useState({
    anosemestre: [],
    cursos: [],
    turmas: [],
    ucs: [],
    salas: [],
    docentes: [],
  });

  //estado para aulas
  const [aulasMarcadas, setAulasMarcadas] = useState([]);

  // detalhes selecionados para o horário (filtros aplicados)
  const [semestre, setSemestre] = useState("");
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [turma, setTurma] = useState("");
  const [uc, setUc] = useState("");
  const [sala, setSala] = useState("");
  const [docente, setDocente] = useState("");

  // estado para aulas disponiveis
  const [aulasDisponiveis, setAulasDisponiveis] = useState([]);
  const [newAula, setNewAula] = useState({ subject: "", location: "", docente: "", duration: 30 });
  const [isBlocked, setIsBlocked] = useState(false);
  const [erro, setErro] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [showAddPopup, setShowAddPopup] = useState(false);

  // Logica para filtros
  const cursoSelecionado = dropdownFilters.cursos.find((c) => c.Cod_Curso == curso);
  const ucDisponiveis = dropdownFilters.ucs.filter((uc) => uc.Cod_Curso == curso);
  const duracaoCurso = cursoSelecionado ? Number(cursoSelecionado.Duracao) : 0;
  const anosPossiveis = Array.from({ length: duracaoCurso }, (_, i) => (i + 1).toString());
  const turmasDisponiveis = dropdownFilters.turmas.filter(
    (t) => t.Cod_AnoSemestre == semestre && t.Cod_Curso == curso && t.AnoTurma == ano
  );
  const filtrosSelecionados = curso && ano && turma;

  const filteredAulasDisponiveis = aulasDisponiveis.filter((aula) => {
    const ucNome = dropdownFilters.ucs.find((u) => u.Cod_Uc == aula.subject)?.Nome || "";
    return ucNome.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Reset filter hierarchy
  useEffect(() => {
    setCurso(""); setAno(""); setTurma(""); console.log("turma: ", turma);
  }, [semestre]);
  useEffect(() => {
    setAno(""); setTurma(""); console.log("turma: ", turma);
  }, [curso]);
  useEffect(() => {
    setTurma(""); console.log("turma: ", turma);
  }, [ano]);

  useEffect(() => {
    if (!escola) return;
    fetch(`http://localhost:5170/getDropdownFilters?escola=${escola}`)
      .then(res => res.json())
      .then(setDropdownFilters)
      .catch(console.error);
  }, [escola]);

  // useEffect(() => {
  //   socket.emit("refresh-aulas");
  // }, []);


  function calculateDuration(inicio, fim) {
    const [h1, m1] = inicio.split(":").map(Number);
    const [h2, m2] = fim.split(":").map(Number);
    return (h2 * 60 + m2) - (h1 * 60 + m1);
  }
  // fetch aulas marcadas por turma
  useEffect(() => {
    console.log("turma: aaa", turma);
    if (!turma) return;

    fetch(`http://localhost:5170/aulas/turma/${turma}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const normalized = data.map(aula => ({
            ...aula,
            day: aula.Dia,
            start: aula.Inicio,
            duration: calculateDuration(aula.Inicio, aula.Fim),
            subject: aula.Cod_Uc,
            location: aula.Cod_Sala,
            docente: aula.Cod_Docente,
          }));
          setAulasMarcadas(normalized);
        } else {
          console.error("Erro: resposta inválida das aulas");
          setAulasMarcadas([]);
        }
      })
      .catch(err => {
        console.error("Erro ao buscar aulas:", err);
        setAulasMarcadas([]);
      });
  }, [turma]);

  // effect para atualizar as aulas se o codigo da turma for igual ao selecionado
  useEffect(() => {
    const handleUpdateAulas = (data) => {
      if (data?.Cod_Turma && data.Cod_Turma === turma) {
        fetch(`http://localhost:5170/aulas/turma/${turma}`)
          .then(res => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              const normalized = data.map(aula => ({
                ...aula,
                day: aula.Dia,
                start: aula.Inicio,
                duration: calculateDuration(aula.Inicio, aula.Fim),
                subject: aula.Cod_Uc,
                location: aula.Cod_Sala,
                docente: aula.Cod_Docente,
              }));
              setAulasMarcadas(normalized);
            }
          })
          .catch(console.error);
      }
    };

    socket.on("update-aulas", handleUpdateAulas);
    return () => socket.off("update-aulas", handleUpdateAulas);
  }, [turma]);

  const moveToDisponiveis = (classItem) => {
    socket.emit("remove-aula", { codAula: classItem.Cod_Aula });

    setAulasDisponiveis((prev) => [
      ...prev,
      {
        id: (prev[prev.length - 1]?.id || 0) + 1,
        semestre, curso, ano, turma,
        subject: classItem.subject,
        location: classItem.location,
        docente: classItem.docente,
        duration: classItem.duration,
      },
    ]);
  };

  const calculateEndTime = (start, duration) => {
    console.log("🧠 Calculando fim:", { start, duration });
    const [h, m] = start.split(":").map(Number);
    const mins = h * 60 + m + duration;
    const eh = String(Math.floor(mins / 60)).padStart(2, "0");
    const em = String(mins % 60).padStart(2, "0");
    return `${eh}:${em}`;
  };

  const addAulaToSchedule = (aulaInfo, day, start) => {
    if (!aulaInfo.subject || !aulaInfo.location || !aulaInfo.docente || !day || !start) {
      setErro("Preencha todos os campos para adicionar uma aula.");
      return;
    }

    const payload = {
      Cod_Docente: aulaInfo.docente,
      Cod_Sala: aulaInfo.location,
      Cod_Turma: aulaInfo.turma,
      Cod_Uc: aulaInfo.subject,
      Cod_Curso: aulaInfo.curso,
      Cod_AnoSemestre: aulaInfo.semestre,
      Dia: day,
      Inicio: start,
      Fim: calculateEndTime(start, aulaInfo.duration),
      Duration: aulaInfo.duration,
    };

    console.log("payload", payload);

    fetch("http://localhost:5170/createAula", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao criar aula");
        return data;
      })
      .then(() => {
        socket.emit("update-aulas", { Cod_Turma: aulaInfo.turma });
        setShowAddPopup(false);
        setErro("");
      })
      .catch(err => {
        console.error(err);
        setErro(err.message || "Erro ao adicionar aula. Verifique os dados.");
        setTimeout(() => setErro(""), 5000);
      });
  };



  const addClass = () => {
    const aulaCompleta = {
      id: aulasDisponiveis.length + 1,
      semestre, curso, ano, turma,
      subject: uc,
      location: sala,
      docente,
      duration: newAula.duration,
    };
    setAulasDisponiveis((prev) => [...prev, aulaCompleta]);
    setUc("");
    setSala("");
    setDocente("");
    setNewAula({ subject: "", location: "", docente: "", duration: 30 });
    setShowAddPopup(false);
  };

  const saveEditedAula = (aula) => {
    if (!aula) return;

    const payload = {
      Cod_Aula: aula.Cod_Aula,
      Cod_Docente: aula.docente,
      Cod_Sala: aula.location,
      Cod_Turma: aula.turma,
      Cod_Uc: aula.subject,
      Cod_Curso: aula.curso,
      Cod_AnoSemestre: aula.semestre,
      Dia: aula.day,
      Inicio: aula.start,
      Fim: calculateEndTime(aula.start, aula.duration),
      Duration: aula.duration,
    };

    fetch("http://localhost:5170/updateAula", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao atualizar aula");
        return data;
      })
      .then(() => {
        socket.emit("refresh-aulas", { Cod_Turma: aula.turma });
        setErro(""); // Limpa erro anterior, se houver
      })
      .catch(err => {
        console.error(err);
        setErro(err.message || "Erro ao atualizar aula.");
        setTimeout(() => setErro(""), 5000);
      });
  };


  const deleteAula = (Cod_Aula) => {
    fetch("http://localhost:5170/deleteAula", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Cod_Aula }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao remover aula");
        return res.json();
      })
      .then(() => {
        socket.emit("refresh-aulas", { Cod_Turma: turma });
      })
      .catch(err => {
        console.error(err);
        setErro("Erro ao remover aula.");
      });
  };

  return {

    // aulas por turma
    aulasMarcadas,

    // states
    dropdownFilters,
    semestre, setSemestre,
    curso, setCurso,
    ano, setAno,
    turma, setTurma,
    uc, setUc,
    sala, setSala,
    docente, setDocente,
    aulasDisponiveis, setAulasDisponiveis,
    newAula, setNewAula,
    isBlocked, setIsBlocked,
    erro, setErro,
    showAddPopup, setShowAddPopup,
    searchQuery, setSearchQuery,

    // derived
    cursoSelecionado,
    anosPossiveis,
    turmasDisponiveis,
    ucDisponiveis,
    filtrosSelecionados,
    filteredAulasDisponiveis,

    // actions
    addClass,
    addAulaToSchedule,
    moveToDisponiveis,
    saveEditedAula,
    deleteAula,
  };
}
