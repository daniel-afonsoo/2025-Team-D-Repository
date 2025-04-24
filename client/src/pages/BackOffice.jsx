import React from 'react';
import "../styles/dashboard-backoffice.css"

const Backoffice = () => {


  return (
    <div className="area">
      <h1 className="titulo">BackOffice</h1>
      <div className="botoes-container">
        <button className="botao">Docentes</button>
        <button className="botao">Cursos</button>
        <button className="botao">unidades Curriculares</button>
        <button className="botao">Escolas</button>
        <button className="botao">Salas</button>
      </div>
    </div>
  );
};

export default Backoffice;
