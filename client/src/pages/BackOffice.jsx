import React from 'react';
import "../styles/backoffice.css";
import { useNavigate } from 'react-router-dom';
import ConsoleViewer from '../components/backoffice/ConsoleViewer';

const Backoffice = () => {
  const navigate = useNavigate();

  return (
    <div className="area_backoffice">
      <h1 className="titulo_backoffice">BackOffice</h1>
      <ConsoleViewer />
      <div className="botoes-container_backoffice">
        {/* Botão Docentes */}
        <button 
          className="botao" 
          onClick={() => navigate('/backoffice/docentes')}
        >
          Docentes
        </button>

        {/* Botão Cursos */}
        <button 
          className="botao" 
          onClick={() => navigate('/backoffice/cursos')}
        >
          Cursos
        </button>

        {/* Botão Unidades Curriculares */}
        <button 
          className="botao" 
          onClick={() => navigate('/backoffice/unidades-curriculares')}
        >
          Unidades Curriculares
        </button>

        {/* Botão Escolas */}
        <button 
          className="botao" 
          onClick={() => navigate('/backoffice/escolas')}
        >
          Escolas
        </button>

        {/* Botão Salas */}
        <button 
          className="botao" 
          onClick={() => navigate('/backoffice/salas')}
        >
          Salas
        </button>
        {/* Botão Turas */}
        <button 
          className="botao" 
          onClick={() => navigate('/backoffice/turmas')}
        >
          Turmas
        </button>
      </div>
    </div>
  );
};

export default Backoffice;