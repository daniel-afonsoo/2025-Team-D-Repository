import { useState, useEffect, use } from 'react'
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import axios from 'axios'
import ipt_tomar from '../images/ipt_campus_tomar.png'
import ipt_abrantes from '../images/ESTA_Abrantes-min.jpg'


const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [imageIndex, setImageIndex] = useState(0);

  const images = [
    ipt_tomar,
    ipt_abrantes
  ];

  const handleSubmit = async (e) => {
    //previne que a página de refresh, por default o onsubmit do forms da refresh na página
    e.preventDefault();
    //elimina todos os erros
    setError("");

    //post no backend através de axios
    //dá post do email e da password n backend
    await axios.post("http://localhost:5170/auth/login", {
      email: email,
      password: password,
    })
      //apresenta na consola a mensagem de sucesso
      .then(res => {
        console.log(res.data.message)
        setEmail("")
        setPassword("")
        navigate("/");
      })
      //apresenta na consola a mensagem de erro e limpa a variável da password
      .catch(error => {
        if (error.response) {
          const status = error.response.status;

          if (status === 401) {
            setError("Credenciais inválidas. Verifique o email e a password.");
          } else if (status === 429) {
            setError("Demasiadas tentativas. Tente novamente daqui a 15 minutos.");
          } else if (status === 500) {
            setError("Erro interno do servidor. Tente novamente mais tarde.");
          } else {
            setError(`Erro inesperado. Código: ${status}`);
          }

          console.error("Erro de resposta do servidor:", error.response.data);

        } else if (error.request) {
          // Requisição feita, mas sem resposta
          setError("Servidor indisponível. Verifique a ligação ou tente mais tarde.");
          console.error("Erro de requisição:", error.request);

        } else {
          // Erro na configuração da requisição
          setError("Ocorreu um erro. Tente novamente.");
          console.error("Erro desconhecido:", error.message);
        }

        setPassword(""); // Limpa a password
      });
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="loginBackground">
      <div
        className="login-background"
        style={{ backgroundImage: `url(${images[imageIndex]})` }}
      />
      <div className='centerDiv'>
        <div className="formulario">
          <div className='loginSquare'>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form className='forms' onSubmit={handleSubmit}>
              <div className='loginIdentifier'>
                <p><b>Login</b></p>
              </div>
              <div className="login_input_field">
                <label><font color="#75c734">Email IPT</font></label>
                <input type="email" name="user" required="" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="login_input_field">
                <label><font color="#75c734">Password</font></label>
                <input type="password" name="pass" required="" value={password} onChange={(e) => setPassword(e.target.value)} />
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