import React from 'react';
import "../styles/dashboard.css";
import { useNavigate, Link } from 'react-router-dom'; // Importe useNavigate

const Dashboard = () => {
  const navigate = useNavigate(); // Inicialize o hook useNavigate
  const nome = "Diogo Larangeira";

  return (
    <div className="area">
      <h1 className="titulo">Bem-vindo <span className="destaque">{nome}</span></h1>

      <div className="botoes-container">

        <div>
          {/* Botão Horários ESGT */}
          <button className="botao" onClick={() => navigate('/horariosESGT')}>Horários ESGT</button>
          <Link className='linksEdit' to="/horariosESGT">Editar Horário</Link>
        </div>

        <div>
          {/* Botão Horários ESTT */}
          <button className="botao" onClick={() => navigate('/horariosESTT')} > Horários ESTT </button>
          <Link className='linksEdit' to="/horariosESTT">Editar Horário</Link>
        </div>

        <div>
          {/* Botão Horários ESTA */}
        <button  className="botao" onClick={() => navigate('/horariosESTA')}> Horários ESTA </button>
         <Link className='linksEdit' to="/horariosESTA">Editar Horário</Link>
        </div>
        
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