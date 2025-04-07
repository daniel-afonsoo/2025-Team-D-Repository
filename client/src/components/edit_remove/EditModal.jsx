import React from 'react';
import "../../styles/editModal.css";

const ModalEdicao = ({ isOpen, onClose, onSave, campos, onChange, titulo }) => {
  if (!isOpen) return null;

  // Filtrando a chave 'id' para não ser exibida
  const camposSemId = Object.keys(campos).filter(key => key !== 'id');

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className='title'>{titulo}</h2> {/* Usando a prop 'titulo' aqui */}

        {/* Mapeando os campos dinamicamente, excluindo 'id' */}
        {camposSemId.map((key) => (
          <div key={key} className="input-field">
            <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input
              id={key}
              type="text"
              name={key}
              value={campos[key]}
              onChange={onChange}
              placeholder={`Digite o ${key}`}
            />
          </div>
        ))}

        <div className="modal-buttons">
          <button className="btSave" onClick={onSave}>Salvar</button>
          <button className="btRemove" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalEdicao;
