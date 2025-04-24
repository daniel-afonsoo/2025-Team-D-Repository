import React from 'react';
import "../styles/dashboard-backoffice.css"

const Dashboard = () => {

    const nome = "Diogo Larangeira"; 

  return (
    <div className="area">
      <h1 className="titulo">Bem-vindo <span className="destaque">{nome}</span></h1>
      <div className="botoes-container">
        <button className="botao">Horários ESGT</button>
        <button className="botao">Horários ESTT</button>
        <button className="botao">Horários ESTA</button>
      </div>
    </div>
  );
};

export default Dashboard;
