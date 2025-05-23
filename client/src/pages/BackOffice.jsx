import React, { useEffect } from 'react';
import "../styles/backoffice.css";
import { useNavigate } from 'react-router-dom';
import ConsoleViewer from '../components/backoffice/ConsoleViewer';
import ipt_background from '../images/background_ipt_logo.svg'

const Backoffice = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="area_backoffice" style={{ backgroundImage: `url(${ipt_background})` }}>
  
      <div>
        <ConsoleViewer />
      </div>

      <div className="container_back">
        <h2>Administração de Entidades</h2>
        <div className="botoes-container_backoffice">
          {/* Botão Docentes */}
          <button className="botao_backoffice" onClick={() => navigate('/backoffice/docentes')}>Docentes</button>
          {/* Botão Cursos */}
          <button className="botao_backoffice" onClick={() => navigate('/backoffice/cursos')}>Cursos</button>
          {/* Botão Unidades Curriculares */}
          <button className="botao_backoffice" onClick={() => navigate('/backoffice/unidades-curriculares')}>Unidades Curriculares</button>
          {/* Botão Escolas */}
          <button className="botao_backoffice" onClick={() => navigate('/backoffice/escolas')}>Escolas</button>
          {/* Botão Salas */}
          <button className="botao_backoffice" onClick={() => navigate('/backoffice/salas')}>Salas</button>
          {/* Botão Turas */}
          <button className="botao_backoffice" onClick={() => navigate('/backoffice/turmas')}>Turmas</button>
        </div>
      </div>

      <div className="container_back">
        <h2>Carregar Dados</h2>
      </div>

      <div className="container_back">
        <h2>Exportar Aulas</h2>
      </div>

    </div>
  );
};

export default Backoffice;