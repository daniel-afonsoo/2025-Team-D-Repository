import React from "react";

const ControlButtons = ({
  isBlocked,
  setIsBlocked,
  setShowAddPopup,
  aulasMarcadas = [],
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

    </div>
  );
};

export default ControlButtons;
