import { useState, useEffect } from 'react'
import "../../styles/createForms.css";
import axios from 'axios'


const CursoCreate = () => {
    const [nome, setNome] = useState("");
    const [abreviatura, setAbreviatura] = useState("");
    const [escola, setEscola] = useState([""]);
    const [duracao, setDuracao] = useState("");
    const [error, setError] = useState("");
    const [escolasDisponiveis, setEscolasDisponiveis] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");


    useEffect(() => {
        axios.get("http://localhost:5170/getEscola")
            .then(response => {
                setEscolasDisponiveis(response.data);
            })
            .catch(error => {
                setError("Erro ao buscar escolas.");
            });
    }, []);

    const handleSubmit = async (e) => {
        //previne que a página de refresh, por default o onsubmit do forms da refresh na página
        e.preventDefault();
        //elimina todos os erros
        setError("");
        setSuccessMessage("");

        // Verifica se os campos estão vazios
        if (!nome.trim() || !abreviatura.trim() || escola[0] === "" || duracao === "") {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        // Enviar apenas o id da escola (Cod_Escola)
        const novoCurso = {
            Nome: nome,
            Abreviacao: abreviatura,
            Cod_Escola: escola[0],
            Duracao: parseInt(duracao, 10)
        };

        //post no backend através de axios
        //dá post do nome, abreviatura, escola, codCurso no backend
        axios.post("http://localhost:5170/createCurso", novoCurso, {
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                if (response.status === 200) {
                    setSuccessMessage("Curso criado com sucesso!");
                    setNome("");
                    setAbreviatura("");
                    setEscola([""]);
                    setDuracao("");
                }
            })
            .catch(err => {
                setError(err.response?.data?.error || "Erro ao criar Curso.");
            });

    };

    // Função para atualizar o valor da dropdown quando o utilizador seleciona uma opção
    const handleChange = (index, value) => {
        // Cria uma cópia do array atual de escolas
        const novasEscolas = [...escola];
        // Atualiza o valor da escola na posição selecionada
        novasEscolas[index] = value;
        // Atualiza o estado com a nova lista de escolas
        setEscola(novasEscolas);
    };


    return (
        <div className="formulario">
            <div className='loginSquare'>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                <form className='forms' onSubmit={handleSubmit}>
                    <div className='createIdentifier'>
                        <p><b>Criar Curso</b></p>
                    </div>
                    <div className="create_input_field">
                        <label><font>Nome do Curso</font></label>
                        <input className='textbox_input' type="text" name="nome" required="" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </div>
                    <div className="create_input_field">
                        <label><font>Abreviatura do curso</font></label>
                        <input className='textbox_input' type="text" name="abrt" required="" value={abreviatura} onChange={(e) => setAbreviatura(e.target.value)} />
                    </div>
                    <div className="create_input_field">
                        <label><font>Duração do Curso (anos)</font></label>
                        <input className='textbox_input' type="number" min="1" name="duracao" required value={duracao} onChange={(e) => setDuracao(e.target.value)} />
                    </div>
                    <div className="create_input_field" style={{ fontWeight: 'bold' }}>
                        <label><font>Escolas do Curso</font></label>
                        {escola.map((escolaId, index) => (
                            <select
                                key={index}
                                className='input_dropdown'
                                value={escolaId}
                                onChange={(e) => handleChange(index, e.target.value)}
                            >
                                <option value="">Selecione uma escola</option>
                                {escolasDisponiveis.map((opcao) => (
                                    <option key={opcao.Cod_Escola} value={opcao.Cod_Escola}>{opcao.Nome}</option>
                                ))}
                            </select>
                        ))}
                    </div>
                    <button className="botao_create" type='submit' >Criar</button>
                </form>
            </div>
        </div>

    )
}

export default CursoCreate