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
          onClick={() => navigate('/HorariosESGT')}
        >
          Horários ESGT
        </button>

        {/* Botão Horários ESTT */}
        <button 
          className="botao" 
          onClick={() => navigate('/HorariosESTT')}
        >
          Horários ESTT
        </button>

        {/* Botão Horários ESTA */}
        <button 
          className="botao" 
          onClick={() => navigate('/HorariosESTA')}
        >
          Horários ESTA
        </button>
      </div>
    </div>
  );
};

export default Dashboard;