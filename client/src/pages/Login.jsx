import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import ipt_tomar from '../images/ipt_campus_tomar.png';
import ipt_abrantes from '../images/ESTA_Abrantes-min.jpg';

axios.defaults.withCredentials = true;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [imageIndex, setImageIndex] = useState(0);

  const navigate = useNavigate();

  // Limpa storage no mount
  useEffect(() => {
  }, []);

  // Carousel de imagens de fundo
  useEffect(() => {
    const images = [ipt_tomar, ipt_abrantes];
    const interval = setInterval(() => {
      setImageIndex(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5170/auth/login', {
        email,
        password,
      },{ withCredentials: true })

      setEmail('');
      setPassword('');
      navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          setError('Credenciais inválidas. Verifique o email e a password.');
        } else if (status === 429) {
          setError('Demasiadas tentativas. Tente novamente daqui a 15 minutos.');
        } else if (status === 500) {
          setError('Erro interno do servidor. Tente novamente mais tarde.');
        } else {
          setError(`Erro inesperado. Código: ${status}`);
        }
        console.error('Erro de resposta do servidor:', error.response.data);
      } else if (error.request) {
        setError('Servidor indisponível. Verifique a ligação ou tente mais tarde.');
        console.error('Erro de requisição:', error.request);
      } else {
        setError('Ocorreu um erro. Tente novamente.');
        console.error('Erro desconhecido:', error.message);
      }
      setPassword('');
    }
  };

  const images = [ipt_tomar, ipt_abrantes];

  return (
    <div className="loginBackground">
      <div
        className="login-background"
        style={{ backgroundImage: `url(${images[imageIndex]})` }}
      />
      <div className="centerDiv">
        <div className="formulario">
          <div className="loginSquare">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form className="forms" onSubmit={handleSubmit}>
              <div className="loginIdentifier">
                <p><b>Login</b></p>
              </div>
              <div className="login_input_field">
                <label><font color="#75c734">Email IPT</font></label>
                <input
                  type="email"
                  name="user"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="login_input_field">
                <label><font color="#75c734">Password</font></label>
                <input
                  type="password"
                  name="pass"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <button id="botao_login" type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
