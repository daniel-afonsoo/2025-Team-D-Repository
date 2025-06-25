import React from "react";

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const AddAulaPopup = ({
  uc,
  setUc,
  sala,
  setSala,
  docente,
  setDocente,
  newAula,
  setNewAula,
  dropdownFilters,
  ucDisponiveis,
  show,
  setShow,
  erro,
  addClass,
  addAulaToSchedule,
  curso,
}) => {
  if (!show) return null;

  return (
    <div className="add-popup">
      <div className="popup-content">
        <h3>Adicionar Aula</h3>

        <select onChange={(e) => setUc(e.target.value)} value={uc} disabled={!curso}>
          <option value="" disabled>Escolha a UC</option>
          {ucDisponiveis.map((ucObj) => (
            <option key={ucObj.Cod_Uc} value={ucObj.Cod_Uc}>{ucObj.Nome}</option>
          ))}
        </select>

        <select onChange={(e) => setSala(e.target.value)} value={sala}>
          <option value="" disabled>Escolha a sala:</option>
          {dropdownFilters.salas.map((salaObj) => (
            <option key={salaObj.Cod_Sala} value={salaObj.Cod_Sala}>{salaObj.Nome}</option>
          ))}
        </select>

        <select onChange={(e) => setDocente(e.target.value)} value={docente}>
          <option value="" disabled>Escolha o Docente:</option>
          {dropdownFilters.docentes.map((docenteObj) => (
            <option key={docenteObj.Cod_Docente} value={docenteObj.Cod_Docente}>{docenteObj.Nome}</option>
          ))}
        </select>

        <input
          type="number"
          step="30"
          placeholder="Duração (minutos)"
          value={newAula.duration}
          onChange={(e) =>
            setNewAula({
              ...newAula,
              duration: parseInt(e.target.value, 10),
            })
          }
        />

        <div className="popup-buttons">
          <button onClick={addClass} className="btn-primary">Criar Bloco de Aula</button>
          <button onClick={() => setShow(false)} className="btn-secondary">Cancelar</button>
        </div>

        {erro && <div className="error-message">{erro}</div>}
      </div>
    </div>
  );
};

export default AddAulaPopup;
