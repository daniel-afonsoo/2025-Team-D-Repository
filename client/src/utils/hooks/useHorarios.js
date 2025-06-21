import { useState, useEffect } from "react";
import socket from "../socket";

export function useHorarios(escola, aulasMarcadas) {
  const [dropdownFilters, setDropdownFilters] = useState({
    anosemestre: [],
    cursos: [],
    turmas: [],
    ucs: [],
    salas: [],
    docentes: [],
  });

  const [semestre, setSemestre] = useState("");
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [turma, setTurma] = useState("");
  const [uc, setUc] = useState("");
  const [sala, setSala] = useState("");
  const [docente, setDocente] = useState("");

  const [aulasDisponiveis, setAulasDisponiveis] = useState([]);
  const [newAula, setNewAula] = useState({ subject: "", location: "", docente: "", duration: 30 });
  const [isBlocked, setIsBlocked] = useState(false);
  const [erro, setErro] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingAula, setEditingAula] = useState(null);

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
    setCurso(""); setAno(""); setTurma("");
  }, [semestre]);
  useEffect(() => {
    setAno(""); setTurma("");
  }, [curso]);
  useEffect(() => {
    setTurma("");
  }, [ano]);

  useEffect(() => {
    if (!escola) return;
    fetch(`http://localhost:5170/getDropdownFilters?escola=${escola}`)
      .then(res => res.json())
      .then(setDropdownFilters)
      .catch(console.error);
  }, [escola]);

  useEffect(() => {
    socket.emit("refresh-aulas");
  }, []);

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
    const [h, m] = start.split(":").map(Number);
    const mins = h * 60 + m + duration;
    const eh = String(Math.floor(mins / 60)).padStart(2, "0");
    const em = String(mins % 60).padStart(2, "0");
    return `${eh}:${em}`;
  };

  const addAulaToSchedule = () => {
    if (!newAula.subject || !newAula.location || !newAula.day || !newAula.start) {
      setErro("Preencha todos os campos para adicionar uma aula.");
      return;
    }

    socket.emit("add-aula", {
      newAula: {
        Cod_Docente: newAula.subject,
        Cod_Sala: newAula.location,
        Cod_Turma: turma,
        Cod_Uc: uc,
        Cod_Curso: curso,
        Cod_AnoSemestre: semestre,
        Dia: newAula.day,
        Inicio: newAula.start,
        Fim: calculateEndTime(newAula.start, newAula.duration),
      },
    });

    setShowAddPopup(false);
    setErro("");
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

  const openEditPopup = (aula) => {
    setEditingAula(aula);
    setShowEditPopup(true);
  };

  const saveEditedAula = () => {
    if (editingAula) {
      socket.emit("update-aula", {
        codAula: editingAula.Cod_Aula,
        newSubject: editingAula.subject,
        newLocation: editingAula.location,
        newDuration: editingAula.duration,
      });
      setShowEditPopup(false);
      setEditingAula(null);
    }
  };

  const deleteAula = (codAula) => {
    socket.emit("delete-aula", { codAula });
    setShowEditPopup(false);
  };

  const handleAulaChange = (event) => {
    const aulaId = event.target.value;
    const aula = aulasMarcadas.find((a) => a.Cod_Aula === aulaId);
    setEditingAula(aula);
  };

  return {
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
    showEditPopup, setShowEditPopup,
    editingAula, setEditingAula,
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
    openEditPopup,
    saveEditedAula,
    deleteAula,
    handleAulaChange,
  };
}
