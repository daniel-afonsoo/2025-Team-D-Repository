import React from "react";

const ControlButtons = ({
  isBlocked,
  setIsBlocked,
  setShowAddPopup,
  setShowEditPopup,
  aulasMarcadas,
}) => {
  return (
    <div className="filters-and-buttons">
      <button onClick={() => setShowAddPopup(true)} className="add-class-button">
        Adicionar Aula
      </button>

      <button
        onClick={() => setIsBlocked((prev) => !prev)}
        className="block-btn"
        style={{
          backgroundColor: isBlocked ? "#dc3545" : "#28a745",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {isBlocked ? "🔴 Desbloquear Horário" : "🟢 Bloquear Horário"}
      </button>

      <button
        onClick={() => setShowEditPopup(true)}
        className="edit-class-button"
        disabled={aulasMarcadas.length === 0}
      >
        Editar Aula
      </button>
    </div>
  );
};

export default ControlButtons;
