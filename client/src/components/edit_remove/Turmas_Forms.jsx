import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/edit_remove_Forms.css";
import bin from '../../images/bin.png';
import pencil from '../../images/pencil.png';
import ConfirmacaoModal from './Confirmacao';
import ModalEdicao from './EditModal';

// Componente principal para listar, editar e remover salas
const Turma_Forms = ({ filtro }) => {
    // Estados para controlar dados, modais e campos de edição
    const [dados, setDados] = useState([]);
    const [modalAberta, setModalAberta] = useState(false);
    const [modalEdicaoAberta, setModalEdicaoAberta] = useState(false);
    const [idParaRemover, setIdParaRemover] = useState(null);
    const [editarItemId, setEditarItemId] = useState(null);
    const [editarCampos, setEditarCampos] = useState({});
    const [tituloModal, setTituloModal] = useState('Editar Turma');

    // Carrega dados simulados ao montar o componente
    useEffect(() => {
        const dadosSimulados = [
            { id: 1, nome: "A", escola: "ESTT", codCurso: "911", ano: "2" },
            { id: 2, nome: "B", escola: "ESTT", codCurso: "911", ano: "3" },
            { id: 3, nome: "A", escola: "ESTA", codCurso: "910", ano: "1" },
            { id: 4, nome: "B", escola: "ESGT", codCurso: "951", ano: "3" },
            { id: 5, nome: "C", escola: "ESTA", codCurso: "845", ano: "1" }
        ];
        setDados(dadosSimulados);
    }, []);

    const dadosFiltrados = dados.filter((turma) =>
        turma.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        turma.escola.toLowerCase().includes(filtro.toLowerCase()) ||
        turma.codCurso.toLowerCase().includes(filtro.toLowerCase()) ||
        turma.ano.toLowerCase().includes(filtro.toLowerCase())
    );

    // Abre o modal de confirmação e define o ID da Turma a remover
    const abrirModal = (id) => {
        setIdParaRemover(id);
        setModalAberta(true);
    };

    // Fecha o modal de confirmação e limpa o ID
    const fecharModal = () => {
        setModalAberta(false);
        setIdParaRemover(null);
    };

    // Remove a Turma confirmada e fecha o modal
    const confirmarRemocao = () => {
        if (idParaRemover !== null) {
            setDados(dados.filter(item => item.id !== idParaRemover));
        }
        fecharModal();
    };

    // Abre o modal de edição com os dados da Turma selecionada
    const abrirModalEdicao = (item) => {
        setEditarItemId(item.id);
        setEditarCampos(item);
        setTituloModal('Editar Turma');
        setModalEdicaoAberta(true);
    };

    // Fecha o modal de edição e limpa os campos
    const fecharModalEdicao = () => {
        setModalEdicaoAberta(false);
        setEditarItemId(null);
        setEditarCampos({});
    };

    // Atualiza os campos enquanto o utilizador edita o formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditarCampos(prev => ({ ...prev, [name]: value }));
    };

    // Aplica as alterações e atualiza a lista de Turmas
    const confirmarEdicao = () => {
        setDados(dados.map(item => item.id === editarItemId ? editarCampos : item));
        fecharModalEdicao();
    };

    return (
        <div className="lista-container">
            <div className="lista">
                {dadosFiltrados.map((item) => (
                    <div key={item.id} className="card">
                        <div className="card-info">
                            <h3>{item.nome}</h3>
                            <p>Código de Curso: {item.codCurso}</p>
                            <p>Ano da Turma {item.nome}: {item.ano}</p>
                            <p>Escola: {item.escola}</p>
                            <button className='btEdit' onClick={() => abrirModalEdicao(item)}>
                                <img src={pencil} alt="Editar" width="20" height="20" />
                            </button>
                            <button className='btRemove' onClick={() => abrirModal(item.id)}>
                                <img src={bin} alt="Remover" width="20" height="20" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmacaoModal
                isOpen={modalAberta}
                onClose={fecharModal}
                onConfirm={confirmarRemocao}
            />

            <ModalEdicao
                isOpen={modalEdicaoAberta}
                onClose={fecharModalEdicao}
                onChange={handleChange}
                campos={editarCampos}
                onSave={confirmarEdicao}
                titulo={tituloModal}
            />
        </div>
    );
};

export default Turma_Forms;