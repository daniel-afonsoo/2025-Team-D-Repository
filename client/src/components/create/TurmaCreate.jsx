import { useState, useEffect, use } from 'react'
import "../../styles/createForms.css";
import axios from 'axios'


const TurmaCreate = () => {

    const [nome, setNome] = useState("");
    const [escola, setEscola] = useState([""]);
    const [codCurso, setCodCurso] = useState("")
    const [ano, setAno] = useState("")
    const [error, setError] = useState("");
    const opcoesEscolas = ["Escola A", "Escola B", "Escola C"]; // Simulação de dados do backend

    const handleSubmit = async (e) => {
        //previne que a página de refresh, por default o onsubmit do forms da refresh na página
        e.preventDefault();
        //elimina todos os erros
        setError("");

        // Verifica se os campos estão vazios
        if (!nome.trim() ||  escola[0] == "" || codCurso === null || codCurso === "" || ano === null || ano === "") {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        // Criar curso para mandar para o backend
        const novaTurma = {
            nome,
            escola,
            codCurso,
            ano
        };

        //post no backend através de axios
        //dá post do nome, escola no backend
        axios.post("http://localhost:5170/createTurma", novaTurma, {
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                if (response.status === 200) {
                    setSuccessMessage("Turma criada com sucesso!");
                    setNome("");
                    setEscola("")
                    setCodCurso("")
                    setAno("")
                }
            })
            .catch(err => {
                setError(err.response?.data?.message || "Erro ao criar Turma.");
            });

    };

    // Função para adicionar uma nova dropdown ao array de escolas
    const adicionarDropdown = () => {
        // Adiciona uma nova escola vazia ao array
        setEscola([...escola, ""]);
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
                <form className='forms' onSubmit={handleSubmit}>
                    <div className='createIdentifier'>
                        <p><b>Criar Turma</b></p>
                    </div>
                    <div className="create_input_field">
                        <label><font color="#75c734">Turma</font></label>
                        <input className='textbox_input' type="text" name="nome" required="" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </div>
                    <div className="create_input_field">
                        <label><font color="#75c734">Código Curso</font></label>
                        <input className='textbox_input' type="text" name="nome" required="" value={codCurso} onChange={(e) => setCodCurso(e.target.value)} />
                    </div>
                    <div className="create_input_field">
                        <label><font color="#75c734">Ano</font></label>
                        <input className='textbox_input' type="text" name="nome" required="" value={ano} onChange={(e) => setAno(e.target.value)} />
                    </div>
                    <div className="create_input_field">
                        <label><font color="#75c734">Escola da Turma</font></label>
                        {escola.map((escola, index) => (
                            <select
                                key={index}
                                className='input_dropdown'
                                value={escola}
                                onChange={(e) => handleChange(index, e.target.value)}
                            >
                                <option value="">Selecione uma escola</option>
                                {opcoesEscolas.map((opcao, idx) => (
                                    <option key={idx} value={opcao}>{opcao}</option>
                                ))}
                            </select>
                        ))}
                        <button className="botao_create" type="button" onClick={adicionarDropdown} style={{ marginTop: '5px' }}>Adicionar outra escola</button>
                    </div>
                    <button className="botao_create" type='submit' >Criar</button>
                </form>
            </div>
        </div>

    )
}

export default TurmaCreate