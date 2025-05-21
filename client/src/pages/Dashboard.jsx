import React, { useEffect, useState } from 'react';
import "../styles/dashboard.css";
import { useNavigate, Link } from 'react-router-dom'; // Importe useNavigate
import ipt_tomar from '../images/ipt_campus_tomar.png'
import ipt_abrantes from '../images/ESTA_Abrantes-min.jpg'

const Dashboard = () => {
  const navigate = useNavigate(); // Inicialize o hook useNavigate
  const nome = "Diogo Larangeira";

  const [imageIndex, setImageIndex] = useState(0);

  const images = [
    ipt_tomar,
    ipt_abrantes
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="area_dashboard">
  {/* Background com imagem e opacidade */}
  <div
    className="dashboard-background"
    style={{ backgroundImage: `url(${images[imageIndex]})` }}
  />

  {/* Conteúdo principal por cima da imagem */}
  <div className="dashboard-content">
    <h1 className="titulo_dashboard">Bem-vindo <span className="destaque_dashboard">{nome}</span></h1>

    <div className="botoes-container">
      <div>
        <button className="botao" onClick={() => navigate('/horariosESGT')}>Horários ESGT</button>
        <Link className='linksEdit' to="/horariosESGT">Editar Horário</Link>
      </div>

      <div>
        <button className="botao" onClick={() => navigate('/horariosESTT')}>Horários ESTT</button>
        <Link className='linksEdit' to="/horariosESTT">Editar Horário</Link>
      </div>

      <div>
        <button className="botao" onClick={() => navigate('/horariosESTA')}>Horários ESTA</button>
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