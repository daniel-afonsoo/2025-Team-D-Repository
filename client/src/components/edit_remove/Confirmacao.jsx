import React from "react";
import "../../styles/confirmacao.css"; 

// Recebe três props: isOpen (booleano para mostrar ou esconder o modal), onClose (função para fechar), onConfirm (função para confirmar)
const ConfirmacaoModal = ({ isOpen, onClose, onConfirm }) => {
    // Se o modal não estiver aberto (isOpen é false), não renderiza nada (retorna null)
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
