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
          <option value="" disabled>Escolher UC</option>
          {ucDisponiveis.map((ucObj) => (
            <option key={ucObj.Cod_Uc} value={ucObj.Cod_Uc}>{ucObj.Nome}</option>
          ))}
        </select>

        <select onChange={(e) => setSala(e.target.value)} value={sala}>
          <option value="" disabled>Escolher Localização</option>
          {dropdownFilters.salas.map((salaObj) => (
            <option key={salaObj.Cod_Sala} value={salaObj.Cod_Sala}>{salaObj.Nome}</option>
          ))}
        </select>

        <select onChange={(e) => setDocente(e.target.value)} value={docente}>
          <option value="" disabled>Escolher docente</option>
          {dropdownFilters.docentes.map((docenteObj) => (
            <option key={docenteObj.Cod_Docente} value={docenteObj.Cod_Docente}>{docenteObj.Nome}</option>
          ))}
        </select>

        <select onChange={(e) => setNewAula({ ...newAula, day: e.target.value })} value={newAula.day}>
          <option value="" disabled>Escolher Dia</option>
          {diasSemana.map((dia) => (
            <option key={dia} value={dia}>{dia}</option>
          ))}
        </select>

        <input
          type="time"
          placeholder="Hora de início"
          value={newAula.start}
          onChange={(e) => setNewAula({ ...newAula, start: e.target.value })}
        />

        <input
          type="number"
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
          <button onClick={addClass} className="btn-primary">Criar Aula Disponível</button>
          <button onClick={addAulaToSchedule} className="btn-success">Adicionar ao Horário</button>
          <button onClick={() => setShow(false)} className="btn-secondary">Cancelar</button>
        </div>

        {erro && <div className="error-message">{erro}</div>}
      </div>
    </div>
  );
};

export default AddAulaPopup;
