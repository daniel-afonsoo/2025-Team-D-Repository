import { useState, useEffect } from 'react'
import "../../styles/createForms.css";
import axios from 'axios'

const TurmaCreate = () => {
    const [turmaAbv, setTurmaAbv] = useState("");
    const [codCurso, setCodCurso] = useState("");
    const [codAnoSemestre, setCodAnoSemestre] = useState("");
    const [anoTurma, setAnoTurma] = useState("");
    const [cursos, setCursos] = useState([]);
    const [anosSemestres, setAnosSemestres] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5170/getCurso")
            .then(res => setCursos(res.data))
            .catch(() => setError("Erro ao buscar cursos."));
        axios.get("http://localhost:5170/getAnoSemestre")
            .then(res => setAnosSemestres(res.data))
            .catch(() => setError("Erro ao buscar anos/semestres."));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!turmaAbv.trim() || !codCurso || !codAnoSemestre || !anoTurma) {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        // Gera um código único para a turma (pode ser ajustado conforme a lógica do backend)
        const Cod_Turma = Date.now();

        const novaTurma = {
            Cod_Turma,
            Cod_Curso: codCurso,
            Cod_AnoSemestre: codAnoSemestre,
            Turma_Abv: turmaAbv,
            AnoTurma: anoTurma
        };

        axios.post("http://localhost:5170/createTurma", novaTurma, {
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                if (response.status === 200) {
                    setSuccessMessage("Turma criada com sucesso!");
                    setTurmaAbv("");
                    setCodCurso("");
                    setCodAnoSemestre("");
                    setAnoTurma("");
                }
            })
            .catch(err => {
                setError(err.response?.data?.error || "Erro ao criar Turma.");
            });
    };

    return (
        <div className="formulario">
            <div className='loginSquare'>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                <form className='forms' onSubmit={handleSubmit}>
                    <div className='createIdentifier'>
                        <p><b>Criar Turma</b></p>
                    </div>
                    <div className="create_input_field">
                        <label><font>Abreviatura da Turma</font></label>
                        <input className='textbox_input' type="text" required value={turmaAbv} onChange={e => setTurmaAbv(e.target.value)} />
                    </div>
                    <div className="create_input_field">
                        <label><font>Curso</font></label>
                        <select className='input_dropdown' value={codCurso} onChange={e => setCodCurso(e.target.value)} required>
                            <option value="">Selecione um curso</option>
                            {cursos.map(curso => (
                                <option key={curso.Cod_Curso} value={curso.Cod_Curso}>{curso.Nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="create_input_field">
                        <label><font>Ano/Semestre</font></label>
                        <select className='input_dropdown' value={codAnoSemestre} onChange={e => setCodAnoSemestre(e.target.value)} required>
                            <option value="">Selecione o ano/semestre</option>
                            {anosSemestres.map(as => (
                                <option key={as.Cod_AnoSemestre} value={as.Cod_AnoSemestre}>{as.Nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="create_input_field">
                        <label><font>Ano da Turma</font></label>
                        <input className='textbox_input' type="number" min="1" required value={anoTurma} onChange={e => setAnoTurma(e.target.value)} />
                    </div>
                    <button className="botao_create" type='submit' >Criar</button>
                </form>
            </div>
        </div>
    )
}

export default TurmaCreate