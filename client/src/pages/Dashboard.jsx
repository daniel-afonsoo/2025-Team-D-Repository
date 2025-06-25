// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('Visitante');
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Verifica se o usuário está autenticado
    axios.get('http://localhost:5170/auth/verify', { withCredentials: true })
      .then(response => {
        setRole(response.data.role);
        setNome(response.data.nome || 'Visitante');
      })
      .catch(() => {
        // redireciona para o login se autenticação falhar
        navigate('/login');
      });
  }, [navigate]);

  return (
    <div className="area_dashboard">
      <div className="dashboard-content">
        <h1 className="titulo_dashboard">
          Bem-vindo{" "}
          <span className="destaque_dashboard">{nome}</span>
        </h1>

        <div className="botoes-container">
          <div>
            <button className="botao_dashboard" onClick={() => navigate("/horariosESGT")}>
              Horários ESGT
            </button>
            {['comissao', 'diretor', 'admin'].includes(role) && (
              <Link className="linksEdit" to="/horariosESGT">
                Editar Horário
              </Link>
            )}
          </div>

          <div>
            <button className="botao_dashboard" onClick={() => navigate("/horariosESTT")}>
              Horários ESTT
            </button>
            {['comissao', 'diretor', 'admin'].includes(role) && (
              <Link className="linksEdit" to="/horariosESTT">
                Editar Horário
              </Link>
            )}
          </div>

          <div>
            <button className="botao_dashboard" onClick={() => navigate("/horariosESTA")}>
              Horários ESTA
            </button>
            {['comissao', 'diretor', 'admin'].includes(role) && (
              <Link className="linksEdit" to="/horariosESTA">
                Editar Horário
              </Link>
            )}
          </div>
        </div>

        <div  style={{ marginTop: '2rem' }}>
          <button className="botao_backoffice_dashboard" onClick={() => navigate("/exportar-aulas")}>
            Exportar Horários
          </button>
        </div>

        {['diretor', 'admin'].includes(role) && (
          <div className="backoffice-container_dashboard">
            <button
              className="botao_backoffice_dashboard"
              onClick={() => navigate("/backoffice")}
            >
              Backoffice
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
