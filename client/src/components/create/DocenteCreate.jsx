import { useState, useEffect, use } from 'react'
import "../../styles/createForms.css";
import axios from 'axios'


const DocenteCreate = () => {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("1234");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha

    const handleSubmit = async (e) => {
        //previne que a página de refresh, por default o onsubmit do forms da refresh na página
        e.preventDefault();
        //elimina todos os erros
        setError("");

        // Verifica se os campos estão vazios
        if (!nome.trim() || !password.trim() || !email.trim()) {
            setError("Por favor, preencha todos os campos.");
            return;
        }

    };

    // Função para alternar a visibilidade da senha
    const togglePasswordVisibility = () => {
        //altera o estado da variável
        setShowPassword(!showPassword);
    };

    return (
        <div className="formulario">
            <div className='loginSquare'>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form className='forms' onSubmit={handleSubmit}>
                    <div className='createIdentifier'>
                        <p><b>Criar Docente</b></p>
                    </div>
                    <div className="create_input_field">
                        <label><font color="#75c734">Nome do Docente</font></label>
                        <input className='textbox_input' type="text" name="nome" required="" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </div>
                    <div className="create_input_field">
                        <label><font color="#75c734">Email IPT</font></label>
                        <input className='textbox_input' type="email" name="user" required="" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="create_input_field">
                        <label><font color="#75c734">Password</font></label>
                        <input className='textbox_input'  type={showPassword ? "text" : "password"} name="pass" required="" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button className="botao_create" type="button" onClick={togglePasswordVisibility} style={{ marginTop: '5px' }}>
                            {showPassword ? "Ocultar" : "Mostrar"} Senha
                        </button>
                    </div>
                    <button className="botao_create" type='submit' >Criar</button>
                </form>
            </div>
        </div>

    )
}

export default DocenteCreate