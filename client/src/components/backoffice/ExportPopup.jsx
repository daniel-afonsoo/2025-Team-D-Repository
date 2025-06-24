import React, { useEffect, useState } from 'react';

export default function ExportPopup({ onClose, onSubmit }) {

    // State to hold form data
    const [form, setForm] = useState({
        turma: ''
    });

    useEffect(() => {
        //fetch dropdown filters
    }, []);

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
                <h4>Pocurar turma</h4>

                <select value={form.semestre} onChange={handleChange}>
                    <option value="" disabled> Escolher Semestre</option>
                </select>

                <select value={form.curso} onChange={handleChange}>
                    <option value="" disabled> Escolher Curso</option>
                </select>

                <select value={form.ano} onChange={handleChange}>
                    <option value="" disabled> Escolher Ano</option>
                </select>

                <select value={form.turma} onChange={handleChange}>
                    <option value="" disabled> Escolher Turma</option>
                </select>


                <div style={{ marginTop: '1rem' }}>
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={handleSubmit}>Exportar</button>
                </div>
            </div>
        </div>
    );
}
