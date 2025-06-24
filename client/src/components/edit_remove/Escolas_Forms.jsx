// Importações de pacotes, estilos, imagens e componentes
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/edit_remove_Forms.css";
import bin from '../../images/bin.png';
import pencil from '../../images/pencil.png';
import ConfirmacaoModal from './Confirmacao';
import ModalEdicao from './EditModal';
import axios from 'axios'

import { TbEdit, TbTrash } from "react-icons/tb";


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

  useEffect(() => {
    axios.get('http://localhost:5170/getEscola')
      .then(response => {
        console.log("Resposta da API:", response.data);
        setDados(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar docentes:", error);
      });
  }, []);

  const dadosFiltrados = dados.filter((escola) =>
    escola.Nome.toLowerCase().includes(filtro.toLowerCase()) ||
    escola.Abreviacao.toLowerCase().includes(filtro.toLowerCase())
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
    console.log("idapra remover", idParaRemover)
    if (idParaRemover !== null) {
      axios.delete(`http://localhost:5170/deleteEscola/`, {
        data: { cod_escola: idParaRemover }
      })
        .then(() => {
          console.log("ID para remover:", idParaRemover);
          setDados(dados.filter(item => item.Cod_Escola !== idParaRemover));
          fecharModal();
        })
        .catch(error => {
          console.error("Erro ao remover docente:", error);
        });
    }
  };

  // Abre o modal de edição com os dados da escola
  const abrirModalEdicao = (item) => {
    setEditarItemId(item.Cod_Escola);
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
    // Criar objeto com as keys minúsculas
    const dadosParaEnviar = {
      nome: editarCampos.Nome,
      abreviacao: editarCampos.Abreviacao,
      cod_escola: editarCampos.Cod_Escola,
    };


    console.log('Dados enviados para updateEscola:', dadosParaEnviar);

    axios.post(`http://localhost:5170/updateEscola`, dadosParaEnviar)
      .then(() => {
        const updatedItem = {
          Nome: editarCampos.Nome,
          Abreviacao: editarCampos.Abreviacao,
          Cod_Escola: editarCampos.Cod_Escola,
        };
        setDados(prev => prev.map(item => item.Cod_Escola === editarCampos.Cod_Escola ? updatedItem : item));

        console.log('Dados depois de atualizar', dados);
        fecharModalEdicao();
      })
      .catch(error => {
        if (error.response) {
          console.error('Status:', error.response.status);
          console.error('Dados retornados:', error.response.data);
        } else {
          console.error('Erro ao atualizar docente:', error.message);
        }
      });
  };

  // Renderização dos cartões e modais
  return (

    <div className="lista-container">
      <div className="lista">
        {dadosFiltrados.map((item) => (
          <div key={item.Cod_Escola} className="card">
            <div className="card-info">
              <h3>{item.Nome}</h3>
              <p><b>Código:</b> {item.Cod_Escola}</p>
              <p><b>Abreviatura:</b> {item.Abreviacao}</p>
              <button className='btEdit' onClick={() => abrirModalEdicao(item)}>
                <TbEdit size={25} />
              </button>
              <button className='btRemove' onClick={() => abrirModal(item.Cod_Escola)}>
                <TbTrash size={25} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmacaoModal
        itemToRemove={`"${dados.find(item => item.Cod_Escola === idParaRemover)?.Nome}"`}
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