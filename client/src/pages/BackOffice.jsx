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
  const [escola, setEscola] = useState("");
  const [escolas, setEscolas] = useState([]);

  // export feature
  const [showPopup, setShowPopup] = useState(false);
  const handleExportSubmit = (formData) => {
    const { turma, tipo } = formData;

    if (!turma || !tipo) {
      console.warn("Turma ou tipo de exportação em falta.");
      return;
    }

    if (tipo === "pdf") {
      exportToPdf(turma);
    } else if (tipo === "excel") {
      exportToExcel(turma);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch("http://localhost:5170/getEscola") // Ajusta o URL conforme necessário
      .then(res => res.json())
      .then(data => setEscolas(data))
      .catch(err => console.error("Erro ao buscar escolas:", err));
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
        <h3>Exportação com Pesquisa:</h3>
        <select value={escola} onChange={(e) => setEscola(e.target.value)}>
          <option value="" disabled>Escolher Escola</option>
          {escolas.map((e) => (
            <option key={e.Cod_Escola} value={e.Cod_Escola}>
              {e.Nome}
            </option>
          ))}
        </select>
        <div>
          <button onClick={() => setShowPopup(true)}>Procurar</button>
        </div>
        {showPopup && (
          <ExportPopup
            onClose={() => setShowPopup(false)}
            // callback function to handle form data submission
            onSubmit={handleExportSubmit}
            escola={escola}
          />
        )}
      </div>
    </div>
  );
};

export default Backoffice;