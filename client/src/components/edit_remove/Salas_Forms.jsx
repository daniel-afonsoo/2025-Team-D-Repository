import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/edit_remove_Forms.css";
import bin from '../../images/bin.png';
import pencil from '../../images/pencil.png';
import ConfirmacaoModal from './Confirmacao';
import ModalEdicao from './EditModal';
import axios from 'axios'

import { TbEdit, TbTrash } from "react-icons/tb";

// Componente principal para listar, editar e remover salas
const Curso_edit_remove = ({ filtro }) => {
  // Estados para controlar dados, modais e campos de edição
  const [dados, setDados] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [modalEdicaoAberta, setModalEdicaoAberta] = useState(false);
  const [idParaRemover, setIdParaRemover] = useState(null);
  const [editarItemId, setEditarItemId] = useState(null);
  const [editarCampos, setEditarCampos] = useState({});
  const [tituloModal, setTituloModal] = useState('Editar Sala');
  const [escolas, setEscolas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5170/getSala')
      .then(response => {
        console.log("Resposta da API:", response.data);
        setDados(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar docentes:", error);
      });
    // Buscar escolas
    axios.get('http://localhost:5170/getEscola')
      .then(response => {
        setEscolas(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar escolas:", error);
      });
  }, []);

  const dadosFiltrados = dados.filter((sala) => {
    const filtroLower = filtro ? filtro.toLowerCase() : '';
    const escola = escolas.find(e => String(e.Cod_Escola) === String(sala.Cod_Escola));
    return (
      (sala.Nome && sala.Nome.toLowerCase().includes(filtroLower)) ||
      (sala.Cod_Escola && String(sala.Cod_Escola).toLowerCase().includes(filtroLower)) ||
      (escola && escola.Nome && escola.Nome.toLowerCase().includes(filtroLower))
    );
  });

  // Abre o modal de confirmação e define o ID da sala a remover
  const abrirModal = (id) => {
    setIdParaRemover(id);
    setModalAberta(true);
  };

  // Fecha o modal de confirmação e limpa o ID
  const fecharModal = () => {
    setModalAberta(false);
    setIdParaRemover(null);
  };

  // Remove a sala confirmada e fecha o modal
  const confirmarRemocao = () => {
    if (idParaRemover !== null) {
      axios.delete(`http://localhost:5170/deleteSala/` , {
        data: { cod_sala: idParaRemover }
      })
        .then(() => {
          console.log("ID para remover:", idParaRemover);
          setDados(dados.filter(item => item.Cod_Sala !== idParaRemover));
          fecharModal();
        })
        .catch(error => {
          console.error("Erro ao remover docente:", error);
        });
    }
  };

  // Abre o modal de edição com os dados da sala selecionada
  const abrirModalEdicao = (item) => {
    setEditarItemId(item.Cod_Escola);
    setEditarCampos(item);
    setTituloModal('Editar Sala');
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

  // Aplica as alterações e atualiza a lista de salas
  const confirmarEdicao = () => {
    const dadosParaEnviar = {
      nome: editarCampos.Nome,
      cod_escola: editarCampos.Cod_Escola,
      cod_sala: editarCampos.Cod_Sala
    };


    console.log('Dados enviados para updateSala:', dadosParaEnviar);

    axios.post(`http://localhost:5170/updateSala`, dadosParaEnviar)
      .then(() => {
        const updatedItem = {
          Nome: editarCampos.Nome,
          Cod_Escola: editarCampos.Cod_Escola,
          Cod_Sala: editarCampos.Cod_Sala
        };
        setDados(prev => prev.map(item => item.Cod_Sala === editarCampos.Cod_Sala ? updatedItem : item));

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

  return (
    <div className="lista-container">
      <div className="lista">
        {dadosFiltrados.map((item) => {
          const escola = escolas.find(e => String(e.Cod_Escola) === String(item.Cod_Escola));
          return (
            <div key={item.Cod_Sala} className="card">
              <div className="card-info">
                <h3>{item.Nome}</h3>
                <p><b>Escola:</b> {escola ? escola.Nome : item.Cod_Escola}</p>
                <button className='btEdit' onClick={() => abrirModalEdicao(item)}>
                  <TbEdit size={25} />
                </button>
                <button className='btRemove' onClick={() => abrirModal(item.Cod_Sala)}>
                  <TbTrash size={25} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmacaoModal
        itemToRemove={`"${dados.find(item => item.Cod_Sala === idParaRemover)?.Nome}"`}
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
        escolas={escolas}
      />
    </div>
  );
};

export default Curso_edit_remove;