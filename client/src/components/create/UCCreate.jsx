import { useState, useEffect } from 'react'
import "../../styles/createForms.css";
import axios from 'axios'


const UCCreate = () => {
    const [nome, setNome] = useState("");
    const [codCurso, setCodCurso] = useState("");
    const [cursosDisponiveis, setCursosDisponiveis] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


    useEffect(() => {
        axios.get("http://localhost:5170/getCurso")
            .then(response => {
                setCursosDisponiveis(response.data);
            })
            .catch(() => {
                setError("Erro ao buscar cursos.");
            });
    }, []);

    const handleSubmit = async (e) => {
        //previne que a página de refresh, por default o onsubmit do forms da refresh na página
        e.preventDefault();
        //elimina todos os erros
        setError("");
        setSuccessMessage("");

        // Verifica se os campos estão vazios
        if (!nome.trim() || !codCurso) {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        // Criar Unidade Curricular para mandar para o backend
        const novaUC = {
            Nome: nome,
            Cod_Curso: codCurso
        };

        //post no backend através de axios
        //dá post do nome, horas, curso, codUC no backend
        axios.post("http://localhost:5170/createUC", novaUC, {
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                if (response.status === 200) {
                    setSuccessMessage("UC criada com sucesso!");
                    setNome("");
                    setCodCurso("");
                }
            })
            .catch(err => {
                setError(err.response?.data?.error || "Erro ao criar UC.");
            });

    };


    return (
        <div className="formulario">
            <div className='loginSquare'>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                <form className='forms' onSubmit={handleSubmit}>
                    <div className='createIdentifier'>
                        <p><b>Criar Unidade Curricular</b></p>
                    </div>
                    <div className="create_input_field">
                        <label><font>Nome da UC</font></label>
                        <input className='textbox_input' type="text" name="nome" required="" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </div>
                    <div className="create_input_field">
                        <label><font>Curso</font></label>
                        <select
                            className='input_dropdown'
                            value={codCurso}
                            onChange={e => setCodCurso(e.target.value)}
                            required
                        >
                            <option value="">Selecione um Curso</option>
                            {cursosDisponiveis.map((curso) => (
                                <option key={curso.Cod_Curso} value={curso.Cod_Curso}>{curso.Nome}</option>
                            ))}
                        </select>
                    </div>
                    <button className="botao_create" type='submit' >Criar</button>
                </form>
            </div>
        </div>

    )
}

export default UCCreate