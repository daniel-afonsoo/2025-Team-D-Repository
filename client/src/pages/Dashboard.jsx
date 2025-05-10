import React from 'react';
import "../styles/dashboard-backoffice.css";
import { useNavigate } from 'react-router-dom'; // Importe useNavigate

const Dashboard = () => {
  const navigate = useNavigate(); // Inicialize o hook useNavigate
  const nome = "Diogo Larangeira"; 

  return (
    <div className="area">
      <h1 className="titulo">Bem-vindo <span className="destaque">{nome}</span></h1>
      <div className="botoes-container">
        {/* Botão Horários ESGT */}
        <button 
          className="botao" 
          onClick={() => navigate('/horariosESGT')}
        >
          Horários ESGT
        </button>

        {/* Botão Horários ESTT */}
        <button 
          className="botao" 
          onClick={() => navigate('/horariosESTT')}
        >
          Horários ESTT
        </button>

        {/* Botão Horários ESTA */}
        <button 
          className="botao" 
          onClick={() => navigate('/horariosESTA')}
        >
          Horários ESTA
        </button>
      </div>
      {/* Botão Backoffice centralizado */}
      <div className="backoffice-container">
        <button 
          className="botao backoffice" 
          onClick={() => navigate('/backoffice')}
        >
          Backoffice
        </button>
      </div>
    </div>
  );
};

export default Dashboard;