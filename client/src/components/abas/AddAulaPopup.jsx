import React from "react";

function AddAulaPopup({ newAula, setNewAula, addClass, setShowAddPopup, erro }) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Adicionar Aula</h3>
        {erro && <p className="error-message">{erro}</p>}
        <form>
          <label>
            Disciplina:
            <input
              type="text"
              value={newAula.subject}
              onChange={(e) => setNewAula({ ...newAula, subject: e.target.value })}
            />
          </label>
          <label>
            Local:
            <input
              type="text"
              value={newAula.location}
              onChange={(e) => setNewAula({ ...newAula, location: e.target.value })}
            />
          </label>
          <label>
            Dia:
            <select
              value={newAula.day}
              onChange={(e) => setNewAula({ ...newAula, day: e.target.value })}
            >
              <option value="">Selecione o dia</option>
              <option value="Segunda">Segunda</option>
              <option value="Terça">Terça</option>
              <option value="Quarta">Quarta</option>
              <option value="Quinta">Quinta</option>
              <option value="Sexta">Sexta</option>
              <option value="Sábado">Sábado</option>
            </select>
          </label>
          <label>
            Hora de Início:
            <input
              type="time"
              value={newAula.start}
              onChange={(e) => setNewAula({ ...newAula, start: e.target.value })}
            />
          </label>
          <label>
            Duração (minutos):
            <input
              type="number"
              value={newAula.duration}
              onChange={(e) => setNewAula({ ...newAula, duration: parseInt(e.target.value, 10) })}
            />
          </label>
          <div className="popup-buttons">
            <button type="button" onClick={addClass}>
              Adicionar
            </button>
            <button type="button" onClick={() => setShowAddPopup(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAulaPopup;