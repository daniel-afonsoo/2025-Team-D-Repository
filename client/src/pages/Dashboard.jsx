import React  from 'react';
import "../styles/dashboard.css";
import { useNavigate, Link } from 'react-router-dom'; // Importe useNavigate
import ipt_background from '../images/novo_backgound_logo_ipt.svg'


const Dashboard = () => {
  const navigate = useNavigate(); // Inicialize o hook useNavigate
  const nome = "Diogo Larangeira";



  return (
    <div className="area_dashboard">
      <div
        className="dashboard-background"
        style={{ backgroundImage: `url(${ipt_background})` }}
      />

      {/* Conteúdo principal por cima da imagem */}
      <div className="dashboard-content">
        <h1 className="titulo_dashboard">Bem-vindo <span className="destaque_dashboard">{nome}</span></h1>

        <div className="botoes-container">
          <div>
            <button className="botao_dashboard" onClick={() => navigate('/horariosESGT')}>Horários ESGT</button>
            <Link className='linksEdit' to="/horariosESGT">Editar Horário</Link>
          </div>

          <div>
            <button className="botao_dashboard" onClick={() => navigate('/horariosESTT')}>Horários ESTT</button>
            <Link className='linksEdit' to="/horariosESTT">Editar Horário</Link>
          </div>

          <div>
            <button className="botao_dashboard" onClick={() => navigate('/horariosESTA')}>Horários ESTA</button>
            <Link className='linksEdit' to="/horariosESTA">Editar Horário</Link>
          </div>
        </div>

        <div className="backoffice-container_dashboard">
          <button className="botao_backoffice_dashboard" onClick={() => navigate('/backoffice')}>Backoffice</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;