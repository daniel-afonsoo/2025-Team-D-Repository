import { useState } from 'react';
import '../../styles/createForms.css';
import axios from 'axios';

const SemestreCreate = ({ onCreated }) => {
    const [nome, setNome] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!nome.trim()) {
            setError("Por favor, preencha o nome.");
            return;
        }

        axios.post("http://localhost:5170/createAnoSemestre", { Nome: nome }, {
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                if (response.status === 200) {
                    setSuccessMessage("Ano/Semestre criado com sucesso!");
                    setNome("");
                    if (onCreated) onCreated();
                }
            })
            .catch(err => {
                setError(err.response?.data?.error || "Erro ao criar Ano/Semestre.");
            });
    };

    return (
        <div className="formulario">
            <div className='loginSquare'>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                <form className='forms' onSubmit={handleSubmit}>
                    <div className='createIdentifier'>
                        <p><b>Criar Ano/Semestre</b></p>
                    </div>
                    <div className="create_input_field">
                        <label><font>Nome do Ano/Semestre</font></label>
                        <input className='textbox_input' type="text" required value={nome} onChange={e => setNome(e.target.value)} />
                    </div>
                    <button className="botao_create" type='submit'>Criar</button>
                </form>
            </div>
        </div>
    );
};

export default SemestreCreate;
