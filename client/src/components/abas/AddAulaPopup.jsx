import React from "react";

function AddAulaPopup({ newAula, setNewAula, addClass, setShowAddPopup, erro }) {
  return (
    <div className="add-popup">
      <div className="popup-content">
        <h3>Adicionar Aula</h3>
        <input
          type="text"
          placeholder="Disciplina"
          value={newAula.subject}
          onChange={(e) => setNewAula({ ...newAula, subject: e.target.value })}
        />
        <input
          type="text"
          placeholder="Localização"
          value={newAula.location}
          onChange={(e) => setNewAula({ ...newAula, location: e.target.value })}
        />
        <input
          type="number"
          placeholder="Duração (minutos)"
          value={newAula.duration}
          onChange={(e) => setNewAula({ ...newAula, duration: parseInt(e.target.value, 10) })}
        />
        <button onClick={addClass}>Salvar</button>
        <button onClick={() => setShowAddPopup(false)}>Cancelar</button>
        {erro && <div className="error-message">{erro}</div>}
      </div>
    </div>
  );
}

export default AddAulaPopup;