import React, { useState, useEffect } from 'react';
import "../styles/backoffice.css";
import { useNavigate } from 'react-router-dom';
import ConsoleViewer from '../components/backoffice/ConsoleViewer';
import ExportPopup from '../components/backoffice/ExportPopup';
import UploadSQL from '../components/backoffice/UploadSQL';
import { exportToPdf, exportToExcel } from '../utils/exportFunctions';

const Backoffice = () => {
  
  const navigate = useNavigate();

  const [codTurma, setCodTurma] = useState("");

  // export feature
  const [showPopup, setShowPopup] = useState(false);
  const handleExportSubmit = (formData) => {
    // ADD CLASSES LOADING AND EXPORT LOGIC LATER
    console.log('Form Data:', formData);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="area_backoffice">

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
          {/* Botão Turmas */}
          <button className="botao_backoffice" onClick={() => navigate('/backoffice/turmas')}>Turmas</button>
           {/* Botão Semestres */}
          <button className="botao_backoffice" onClick={() => navigate('/backoffice/semestres')}>Semestres</button>
        </div>  
      </div>

      <div className="container_back">
        <h2>Gerar Dados em .SQL</h2>
        <UploadSQL />
      </div>

      <div className="container_back">
        <h2>Exportar Aulas</h2>
        <h3>Exportação Rápida:</h3>
        <input
          type="text"
          placeholder="Insira o Codigo da turma:"
          value={codTurma}
          onChange={(e) => setCodTurma(e.target.value)}
        />
        <button onClick={() => exportToPdf(codTurma)}>PDF</button>
        <button onClick={() => exportToExcel(codTurma)}>Excel</button>
        <div>
          <button onClick={() => setShowPopup(true)}>Exportação com Pesquisa</button>
        </div>
        {showPopup && (
          <ExportPopup
            onClose={() => setShowPopup(false)}
            // callback function to handle form data submission
            onSubmit={handleExportSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Backoffice;