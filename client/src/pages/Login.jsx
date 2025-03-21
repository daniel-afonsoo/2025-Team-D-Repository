import { useState, useEffect, use } from 'react'
import "../styles/login.css";
import iptLogo from "../images/ipt_logo.jpg"

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    
  
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
                        <form className='forms' >
                            <div className='loginIdentifier'>
			                    <p><b>Login</b></p>
			                </div>
                            <div className="login_input_field">
                                <label><font color="#75c734">Email IPT</font></label>
                                <input type="email" name="user" required=""/>
                            </div>
                            <div className="login_input_field">
                                <label><font color="#75c734">Password</font></label>
                                <input type="password" name="pass" required=""/>
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