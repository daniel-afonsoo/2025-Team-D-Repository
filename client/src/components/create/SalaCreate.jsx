import { useState, useEffect } from 'react'
import "../../styles/createForms.css";
import axios from 'axios'


const SalaCreate = () => {
    const [nome, setNome] = useState("");
    const [codEscola, setCodEscola] = useState("");
    const [escolasDisponiveis, setEscolasDisponiveis] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5170/getEscola")
            .then(response => {
                setEscolasDisponiveis(response.data);
            })
            .catch(() => {
                setError("Erro ao buscar escolas.");
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!nome.trim() || !codEscola) {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        const novaSala = {
            nome,
            cod_escola: codEscola
        };

        axios.post("http://localhost:5170/createSala", novaSala, {
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                if (response.status === 200) {
                    setSuccessMessage("Sala criada com sucesso!");
                    setNome("");
                    setCodEscola("");
                }
            })
            .catch(err => {
                setError(err.response?.data?.error || "Erro ao criar Sala.");
            });
    };

    return (
        <div className="formulario">
            <div className='loginSquare'>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                <form className='forms' onSubmit={handleSubmit}>
                    <div className='createIdentifier'>
                        <p><b>Criar Sala</b></p>
                    </div>
                    <div className="create_input_field">
                        <label><font>Nome/Número da Sala</font></label>
                        <input className='textbox_input' type="text" name="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
                    </div>
                    <div className="create_input_field">
                        <label><font>Escola da Sala</font></label>
                        <select
                            className='input_dropdown'
                            value={codEscola}
                            onChange={e => setCodEscola(e.target.value)}
                            required
                        >
                            <option value="">Selecione uma escola</option>
                            {escolasDisponiveis.map((escola) => (
                                <option key={escola.Cod_Escola} value={escola.Cod_Escola}>{escola.Nome}</option>
                            ))}
                        </select>
                    </div>
                    <button className="botao_create" type='submit' >Criar</button>
                </form>
            </div>
        </div>

    )
}

export default SalaCreate