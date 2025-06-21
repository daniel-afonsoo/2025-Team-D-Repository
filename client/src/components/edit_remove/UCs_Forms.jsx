import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/edit_remove_Forms.css";
import bin from '../../images/bin.png';
import pencil from '../../images/pencil.png';
import ConfirmacaoModal from './Confirmacao';
import ModalEdicao from './EditModal';
import axios from 'axios'

import { TbEdit, TbTrash } from "react-icons/tb";

// Componente principal para listar, editar e remover unidades curriculares
const UCs_edit_remove = ({ filtro }) => {
  // Estados para controlar dados, modais e campos de edição
  const [dados, setDados] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [modalEdicaoAberta, setModalEdicaoAberta] = useState(false);
  const [idParaRemover, setIdParaRemover] = useState(null);
  const [editarItemId, setEditarItemId] = useState(null);
  const [editarCampos, setEditarCampos] = useState({});
  const [tituloModal, setTituloModal] = useState('Editar Curso');

  useEffect(() => {
    axios.get('http://localhost:5170/getUC')
      .then(response => {
        console.log("Resposta da API:", response.data);
        setDados(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar docentes:", error);
      });
    // Buscar cursos
    axios.get('http://localhost:5170/getCurso')
      .then(response => {
        setCursos(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar cursos:", error);
      });
  }, []);

  const dadosFiltrados = dados.filter((uc) => {
    const filtroLower = filtro ? filtro.toLowerCase() : '';
    const curso = cursos.find(c => String(c.Cod_Curso) === String(uc.Cod_Curso));
    return (
      (uc.Nome && uc.Nome.toLowerCase().includes(filtroLower)) ||
      (uc.Horas && uc.Horas.toLowerCase().includes(filtroLower)) ||
      (uc.Cod_Curso && String(uc.Cod_Curso).toLowerCase().includes(filtroLower)) ||
      (curso && curso.Nome && curso.Nome.toLowerCase().includes(filtroLower))
    );
  });

  // Abrir o modal de confirmação e guardar o ID do item a remover
  const abrirModal = (id) => {
    setIdParaRemover(id);
    setModalAberta(true);
  };

  // Fechar o modal de confirmação
  const fecharModal = () => {
    setModalAberta(false);
    setIdParaRemover(null);
  };

  // Confirmar e aplicar a remoção do item
  const confirmarRemocao = () => {
    if (idParaRemover !== null) {
      axios.delete(`http://localhost:5170/deleteUC/`, {
        data: { Cod_Uc: idParaRemover } 
      })
        .then(() => {
          console.log("ID para remover:", idParaRemover);
          setDados(dados.filter(item => item.Cod_Uc !== idParaRemover));
          fecharModal();
        })
        .catch(error => {
          console.error("Erro ao remover docente:", error);
        });
    }
  };

  // Abrir o modal de edição e preencher os campos com os dados do item
  const abrirModalEdicao = (item) => {
    setEditarItemId(item.Cod_Uc);
    setEditarCampos(item);
    setTituloModal('Editar Unidade Curricular');
    setModalEdicaoAberta(true);
  };

  // Fechar o modal de edição e limpar os dados
  const fecharModalEdicao = () => {
    setModalEdicaoAberta(false);
    setEditarItemId(null);
    setEditarCampos({});
  };

  // Atualizar campos do formulário conforme o utilizador edita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditarCampos(prev => ({ ...prev, [name]: value }));
  };

  // Confirmar e aplicar as alterações no item editado
  const confirmarEdicao = () => {
    const dadosParaEnviar = {
      Nome: editarCampos.Nome,
      Cod_Curso: editarCampos.Cod_Curso,
      Cod_Uc: editarCampos.Cod_Uc
    };


    console.log('Dados enviados para updateUC:', dadosParaEnviar);

    axios.post(`http://localhost:5170/updateUC`, dadosParaEnviar)
      .then(() => {
        const updatedItem = {
          Nome: editarCampos.Nome,
          Cod_Curso: editarCampos.Cod_Curso,
          Cod_Uc: editarCampos.Cod_Uc,
        };
        setDados(prev => prev.map(item => item.Cod_Uc === editarCampos.Cod_Uc ? updatedItem : item));

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
          const curso = cursos.find(c => String(c.Cod_Curso) === String(item.Cod_Curso));
          return (
            <div key={item.Cod_Uc} className="card">
              <div className="card-info">
                <h3>{item.Nome}</h3>
                <p><b>Curso:</b> {curso ? curso.Nome : item.Cod_Curso}</p>
                <button className='btEdit' onClick={() => abrirModalEdicao(item)}>
                  <TbEdit size={25} />
                </button>
                <button className='btRemove' onClick={() => abrirModal(item.Cod_Uc)}>
                  <TbTrash size={25} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmacaoModal
        itemToRemove={`"${dados.find(item => item.Cod_Uc === idParaRemover)?.Cod_Curso} - ${dados.find(item => item.Cod_Uc === idParaRemover)?.Nome}"`}
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
        cursos={cursos}
      />
    </div>
  );
};

export default UCs_edit_remove;