import React from "react";
import "../../styles/confirmacao.css"; 

const ConfirmacaoModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Confirmação</h3>
                <p>Tem certeza que deseja remover este item?</p>
                <div className="modal-buttons">
                    <button className="confirmar" onClick={onConfirm}>Sim</button>
                    <button className="cancelar" onClick={onClose}>Não</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmacaoModal;
