import React from "react";

const EditAulaPopup = ({
  aulasMarcadas,
  editingAula,
  setEditingAula,
  show,
  setShow,
  getNomeUC,
  getNomeSala,
  handleAulaChange,
  saveEditedAula,
  deleteAula,
}) => {
  if (!show) return null;

  return (
    <div className="add-popup">
      <div className="popup-content">
        <h3>Editar Aula</h3>

        <select onChange={handleAulaChange} value={editingAula?.Cod_Aula || ""}>
          <option value="" disabled>Selecione uma aula</option>
          {aulasMarcadas.map((aula) => (
            <option key={aula.Cod_Aula} value={aula.Cod_Aula}>
              {getNomeUC(aula.subject)} - {getNomeSala(aula.location)}
            </option>
          ))}
        </select>

        {editingAula && (
          <>
            <input
              type="text"
              placeholder="Disciplina"
              value={editingAula.subject}
              onChange={(e) =>
                setEditingAula({
                  ...editingAula,
                  subject: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Localização"
              value={editingAula.location}
              onChange={(e) =>
                setEditingAula({
                  ...editingAula,
                  location: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Duração (minutos)"
              value={editingAula.duration}
              onChange={(e) =>
                setEditingAula({
                  ...editingAula,
                  duration: parseInt(e.target.value, 10),
                })
              }
            />
            <button onClick={saveEditedAula}>Salvar</button>
            <button onClick={() => deleteAula(editingAula.Cod_Aula)}>Excluir</button>
          </>
        )}

        <button onClick={() => setShow(false)}>Cancelar</button>
      </div>
    </div>
  );
};

export default EditAulaPopup;
