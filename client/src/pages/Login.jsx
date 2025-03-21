import { useState, useEffect, use } from 'react'
import "../styles/login.css";
import iptLogo from "../images/ipt_logo.jpg"
import axios from 'axios'


const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
    
        try {
          const response = await axios.post("/login", {
            email: email,
            password: password,
          });
    
          console.log("Login bem-sucedido!", response.data);
          // Aqui você pode salvar o token e redirecionar o usuário
        } catch (error) {
          setError("Erro ao fazer login. Verifique suas credenciais.");
          console.error(error);
        }
      };



  
    return (
        <div className="loginBackground">
            <div className='centerDiv'>
                <img src={iptLogo}
                 alt="Logo do Instituto Politécnico de Tomar"
                 width= "30%"
                />
                <h1 className='titulo'>Horários IPT</h1>
                
                <div className="formulario">
                    <div className='loginSquare'>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <form className='forms' onSubmit={handleSubmit}>
                            <div className='loginIdentifier'>
			                    <p><b>Login</b></p>
			                </div>
                            <div className="login_input_field">
                                <label><font color="#75c734">Email IPT</font></label>
                                <input type="email" name="user" required=""  onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="login_input_field">
                                <label><font color="#75c734">Password</font></label>
                                <input type="password" name="pass" required="" onChange={(e) => setPassword(e.target.value)}/>
                            </div>
			                <button id="botao_login" type='submit' >Login</button>
                        </form>
                    </div>
                </div>
            
            </div>
        </div>

    )
  }
  
  export default Login