import React from 'react';
import "../../styles/editModal.css";

import { VscCheck, VscChromeClose } from "react-icons/vsc";

// Componente de modal de edição genérico
const ModalEdicao = ({ isOpen, onClose, onSave, campos, onChange, titulo, escolas = [], cursos = [], anosemestres = [] }) => {
  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  // Remove o campo 'id' da lista de inputs (não precisa ser editado)
  const camposSemId = Object.keys(campos).filter(key => key !== 'id');

  // Mapeamento de labels amigáveis
  const fieldLabels = {
    Cod_Escola: 'Escola',
    Cod_Curso: 'Curso',
    Cod_AnoSemestre: 'Ano/Semestre',
    Nome: 'Nome',
    Abreviacao: 'Abreviação',
    Horas: 'Horas',
    Turma_Abv: 'Turma',
    AnoTurma: 'Ano da Turma',
    Email: 'Email',
    Password: 'Password',
    // Adicione outros campos se necessário
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className='title'>{titulo}</h2>
        {camposSemId.map((key) => (
          <div key={key} className="input-field">
            <label htmlFor={key}>
              {fieldLabels[key] || key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            {key === 'Cod_Escola' && escolas.length > 0 ? (
              <select
                id={key}
                name={key}
                value={campos[key] || ''}
                onChange={onChange}
              >
                <option value="">Selecione a escola</option>
                {escolas.map((escola) => (
                  <option key={escola.Cod_Escola} value={escola.Cod_Escola}>
                    {escola.Nome}
                  </option>
                ))}
              </select>
            ) : key === 'Cod_Curso' && cursos.length > 0 ? (
              <select
                id={key}
                name={key}
                value={campos[key] || ''}
                onChange={onChange}
              >
                <option value="">Selecione o curso</option>
                {cursos.map((curso) => (
                  <option key={curso.Cod_Curso} value={curso.Cod_Curso}>
                    {curso.Nome}
                  </option>
                ))}
              </select>
            ) : key === 'Cod_AnoSemestre' && anosemestres.length > 0 ? (
              <select
                id={key}
                name={key}
                value={campos[key] || ''}
                onChange={onChange}
              >
                <option value="">Selecione o Ano/Semestre</option>
                {anosemestres.map((a) => (
                  <option key={a.Cod_AnoSemestre} value={a.Cod_AnoSemestre}>
                    {a.Nome}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={key}
                type="text"
                name={key}
                value={campos[key]}
                onChange={onChange}
                placeholder={`Digite o ${key}`}
              />
            )}
          </div>
        ))}

        <div className="modal-buttons">
          <button className="btSave" onClick={onSave}><VscCheck size={30}/></button>
          <button className="btSave" onClick={onClose}><VscChromeClose size={30}/></button>
        </div>
      </div>
    </div>
  );
};

export default ModalEdicao;
