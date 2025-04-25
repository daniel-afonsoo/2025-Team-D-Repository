import React from 'react';
import "../styles/dashboard-backoffice.css"
import { Link } from 'react-router-dom'; // Importe o Link

const Dashboard = () => {

    const nome = "Diogo Larangeira"; 

  return (
    <div className="area">
      <h1 className="titulo">Bem-vindo <span className="destaque">{nome}</span></h1>
      <div className="botoes-container">
         <Link to="/HorariosESGT" className="botao">Horários ESGT</Link>
         <Link to="/HorariosESTT" className="botao">Horários ESTT</Link>
         <Link to="/HorariosESTA" className="botao">Horários ESTA</Link>
      </div>
    </div>
  );
};

export default Dashboard;
