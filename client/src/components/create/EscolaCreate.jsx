import { useState } from 'react'
import "../../styles/createForms.css";
import axios from 'axios'


const EscolaCreate = () => {

    const [nome, setNome] = useState("");
    const [abreviatura, setAbreviatura] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


    const handleSubmit = async (e) => {
        //previne que a página de refresh, por default o onsubmit do forms da refresh na página
        e.preventDefault();
        //elimina todos os erros
        setError("");
        setSuccessMessage("");

        // Verifica se os campos estão vazios
        if (!nome.trim() || !abreviatura.trim()) {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        // Criar escola para mandar para o backend
        const novaEscola = {
            nome,
            abreviacao: abreviatura
        };

        //post no backend através de axios
        //dá post do nome, abreviatura, localidade no backend
        axios.post("http://localhost:5170/createEscola", novaEscola, {
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                if (response.status === 200) {
                    setSuccessMessage("Escola criada com sucesso!");
                    setNome("");
                    setAbreviatura("")
                }
            })
            .catch(err => {
                setError(err.response?.data?.error || "Erro ao criar Escola.");
            });

    };



    return (
        <div className="formulario">
            <div className='loginSquare'>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                <form className='forms' onSubmit={handleSubmit}>
                    <div className='createIdentifier'>
                        <p><b>Criar Escola</b></p>
                    </div>
                    <div className="create_input_field">
                        <label><font>Nome da Escola</font></label>
                        <input className='textbox_input' type="text" name="nome" required="" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </div>
                    <div className="create_input_field">
                        <label><font>Abreviatura da Escola</font></label>
                        <input className='textbox_input' type="text" name="abtr" required="" value={abreviatura} onChange={(e) => setAbreviatura(e.target.value)} />
                    </div>
                    <button className="botao_create" type='submit' >Criar</button>
                </form>
            </div>
        </div>

    )
}

export default EscolaCreate