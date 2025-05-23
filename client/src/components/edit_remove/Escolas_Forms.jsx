// Importações de pacotes, estilos, imagens e componentes
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/edit_remove_Forms.css";
import bin from '../../images/bin.png';
import pencil from '../../images/pencil.png';
import ConfirmacaoModal from './Confirmacao';
import ModalEdicao from './EditModal';

import { TbEdit, TbTrash  } from "react-icons/tb";


// Componente principal para listar, editar e remover escolas
const Curso_edit_remove = ({ filtro }) => {
  // Estados para controlar dados, modais e campos de edição
  const [dados, setDados] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [modalEdicaoAberta, setModalEdicaoAberta] = useState(false);
  const [idParaRemover, setIdParaRemover] = useState(null);
  const [editarItemId, setEditarItemId] = useState(null);
  const [editarCampos, setEditarCampos] = useState({});

  // Título do modal de edição
  const [tituloModal, setTituloModal] = useState('Editar Escola');

  // Simula os dados ao iniciar o componente
  useEffect(() => {
    const dadosSimulados = [
      { id: 1, nome: "Escola Superior de Gestão de Tomar", abreviatura: "ESGT" },
      { id: 2, nome: "Escola Superior de Técnologia de Tomar", abreviatura: "ESTT" },
      { id: 3, nome: "Escola Superior de Técnologia de Abrantes", abreviatura: "ESTA" },
    ];
    setDados(dadosSimulados);
  }, []);

  const dadosFiltrados = dados.filter((escola) =>
    escola.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    escola.abreviatura.toLowerCase().includes(filtro.toLowerCase())
  );

  // Abre o modal de confirmação de remoção
  const abrirModal = (id) => {
    setIdParaRemover(id);
    setModalAberta(true);
  };

  // Fecha o modal de remoção
  const fecharModal = () => {
    setModalAberta(false);
    setIdParaRemover(null);
  };

  // Remove uma escola
  const confirmarRemocao = () => {
    if (idParaRemover !== null) {
      setDados(dados.filter(item => item.id !== idParaRemover));
    }
    fecharModal();
  };

  // Abre o modal de edição com os dados da escola
  const abrirModalEdicao = (item) => {
    setEditarItemId(item.id);
    setEditarCampos(item);
    setTituloModal('Editar Escola');
    setModalEdicaoAberta(true);
  };

  // Fecha o modal de edição
  const fecharModalEdicao = () => {
    setModalEdicaoAberta(false);
    setEditarItemId(null);
    setEditarCampos({});
  };

  // Atualiza os campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditarCampos(prev => ({ ...prev, [name]: value }));
  };

  // Salva as alterações feitas na escola
  const confirmarEdicao = () => {
    setDados(dados.map(item => item.id === editarItemId ? editarCampos : item));
    fecharModalEdicao();
  };

  // Renderização dos cartões e modais
  return (

    <div className="lista-container">
      <div className="lista">
        {dadosFiltrados.map((item) => (
          <div key={item.id} className="card">
            <div className="card-info">
              <h3>{item.nome}</h3>
              <p><b>Código:</b> {item.id}</p>
              <p><b>Abreviatura:</b> {item.abreviatura}</p>
              <button className='btEdit' onClick={() => abrirModalEdicao(item)}>
                <TbEdit size={25}/>
              </button>
              <button className='btRemove' onClick={() => abrirModal(item.id)}>
                <TbTrash size={25}/>
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmacaoModal
        itemToRemove={`"${dados.find(item => item.id === idParaRemover)?.nome}"`}
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

export default Curso_edit_remove;