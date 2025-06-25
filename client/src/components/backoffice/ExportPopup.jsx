import React, { useEffect, useState } from 'react';

export default function ExportPopup({ onClose, onSubmit, escola }) {

    const [form, setForm] = useState({
        semestre: '',
        curso: '',
        ano: '',
        turma: '',
        tipo: 'pdf'
    });

    const [dropdownFilters, setDropdownFilters] = useState({
        anosemestre: [],
        cursos: [],
        turmas: []
    });

    const [anosPossiveis, setAnosPossiveis] = useState([]);
    const [turmasDisponiveis, setTurmasDisponiveis] = useState([]);

    // Fetch filtros com base na escola
    useEffect(() => {
        if (!escola) return;

        fetch(`http://localhost:5170/getDropdownFilters?escola=${escola}`)
            .then(res => res.json())
            .then(data => setDropdownFilters(data))
            .catch(err => console.error("Erro ao buscar filtros:", err));
    }, [escola]);

    // Atualiza os anos possíveis com base no curso
    useEffect(() => {
        const anos = dropdownFilters.turmas
            ?.filter(t => t.Cod_Curso == form.curso)
            .map(t => t.AnoTurma)
            .filter((v, i, a) => a.indexOf(v) === i); // únicos

        setAnosPossiveis(anos || []);
    }, [form.curso, dropdownFilters]);

    // Atualiza turmas disponíveis com base no curso e ano
    useEffect(() => {
        const turmas = dropdownFilters.turmas
            ?.filter(t =>
                t.Cod_Curso == form.curso &&
                t.AnoTurma == form.ano &&
                t.Cod_AnoSemestre == form.semestre
            );

        setTurmasDisponiveis(turmas || []);
    }, [form.ano, form.curso, form.semestre, dropdownFilters]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSubmit(form);
        onClose();
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <h3>Procurar Turma</h3>

                <span>Semestre:</span>
                <select name="semestre" value={form.semestre} onChange={handleChange}>
                    <option value="" disabled>Escolher Semestre</option>
                    {dropdownFilters.anosemestre.map((s) => (
                        <option key={s.Cod_AnoSemestre} value={s.Cod_AnoSemestre}>{s.Nome}</option>
                    ))}
                </select>

                <span>Curso:</span>
                <select name="curso" value={form.curso} onChange={handleChange}>
                    <option value="" disabled>Escolher Curso</option>
                    {dropdownFilters.cursos.map((cursoObj) => (
                        <option key={cursoObj.Cod_Curso} value={cursoObj.Cod_Curso}>{cursoObj.Nome}</option>
                    ))}
                </select>

                <span>Ano:</span>
                <select name="ano" value={form.ano} onChange={handleChange} disabled={!form.curso}>
                    <option value="" disabled>Escolher Ano</option>
                    {anosPossiveis.map((anoVal) => (
                        <option key={anoVal} value={anoVal}>{anoVal}º Ano</option>
                    ))}
                </select>

                <span>Turma:</span>
                <select name="turma" value={form.turma} onChange={handleChange} disabled={!form.ano}>
                    <option value="" disabled>Escolher Turma</option>
                    {turmasDisponiveis.map((turmaObj) => (
                        <option key={turmaObj.Cod_Turma} value={turmaObj.Cod_Turma}>{turmaObj.Turma_Abv}</option>
                    ))}
                </select>

                <span>Tipo de Exportação:</span>
                <select name="tipo" value={form.tipo} onChange={handleChange}>
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                </select>

                <div style={{ marginTop: '1rem' }}>
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={handleSubmit} disabled={!form.turma}>Exportar</button>
                </div>
            </div>
        </div>
    );
}
