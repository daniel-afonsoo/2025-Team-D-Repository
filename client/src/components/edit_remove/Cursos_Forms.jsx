import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/edit_remove_Forms.css";
import bin from '../../images/bin.png';
import pencil from '../../images/pencil.png';
import ConfirmacaoModal from './Confirmacao';
import ModalEdicao from './EditModal'; // Componente do modal de edição
import axios from 'axios'

import { TbEdit, TbTrash } from "react-icons/tb";

// Componente principal responsável pela listagem, edição e remoção de cursos
const Curso_edit_remove = ({ filtro }) => {
  // Estados para controlar dados, modais e campos de edição
  const [dados, setDados] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [modalEdicaoAberta, setModalEdicaoAberta] = useState(false);
  const [idParaRemover, setIdParaRemover] = useState(null);
  const [editarItemId, setEditarItemId] = useState(null);
  const [editarCampos, setEditarCampos] = useState({});
  const [tituloModal, setTituloModal] = useState('Editar Curso');

  // Carrega dados simulados ao iniciar o componente
  useEffect(() => {
    axios.get('http://localhost:5170/getCurso')
      .then(response => {
        console.log("Resposta da API:", response.data);
        setDados(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar docentes:", error);
      });
  }, []);

  const dadosFiltrados = dados.filter((curso) =>
    curso.Nome.toLowerCase().includes(filtro.toLowerCase()) ||
    curso.Abreviasao.toLowerCase().includes(filtro.toLowerCase()) ||
    curso.Cod_Curso.toLowerCase().includes(filtro.toLowerCase()) ||
    curso.Cod_Escola.toLowerCase().includes(filtro.toLowerCase())
  );

  // Funções auxiliares para abrir/fechar modais e manipular dados
  const abrirModal = (id) => {
    setIdParaRemover(id);
    setModalAberta(true);
  };

  const fecharModal = () => {
    setModalAberta(false);
    setIdParaRemover(null);
  };

  const confirmarRemocao = () => {
    if (idParaRemover !== null) {
      axios.delete('http://localhost:5170/deleteCurso/', {
        data: { cod_curso: idParaRemover }
      })
        .then(() => {
          setDados(dados.filter(item => item.Cod_Curso !== idParaRemover));
          fecharModal();
        })
        .catch(error => {
          console.error("Erro ao remover curso:", error);
        });
    }
  };

  const abrirModalEdicao = (item) => {
    setEditarItemId(item.Cod_Curso);
    setEditarCampos(item);
    setTituloModal('Editar Curso');
    setModalEdicaoAberta(true);
  };

  const fecharModalEdicao = () => {
    setModalEdicaoAberta(false);
    setEditarItemId(null);
    setEditarCampos({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditarCampos(prev => ({ ...prev, [name]: value }));
  };

  const confirmarEdicao = () => {
    const dadosParaEnviar = {
      Nome: editarCampos.Nome,
      Abreviacao: editarCampos.Abreviacao,
      Cod_Escola: editarCampos.Cod_Escola,
      Cod_Curso: editarCampos.Cod_Curso,
    };

    console.log('Dados enviados para updateCurso:', dadosParaEnviar);
    axios.post(`http://localhost:5170/updateCurso`, dadosParaEnviar)
      .then(() => {
        const updatedItem = {
          Nome: editarCampos.Nome,
          Abreviacao: editarCampos.Abreviacao,
          Cod_Escola: editarCampos.Cod_Escola,
          Cod_Curso: editarCampos.Cod_Curso
        };
        setDados(prev => prev.map(item => item.Cod_Curso === editarCampos.Cod_Curso ? updatedItem : item));

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
        {dadosFiltrados.map((item) => (
          <div key={item.Cod_Curso} className="card">
            <div className="card-info">
              <h3>{item.Nome}</h3>
              <p><b>Abreviatura:</b> {item.Abreviacao}</p>
              <p><b>Código do Curso:</b> {item.Cod_Curso}</p>
              <p><b>Escola:</b> {item.Cod_Escola}</p>
              <button className='btEdit' onClick={() => abrirModalEdicao(item)}>
                <TbEdit size={25} />
              </button>
              <button className='btRemove' onClick={() => abrirModal(item.Cod_Curso)}>
                <TbTrash size={25} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmacaoModal
        itemToRemove={`"${dados.find(item => item.Cod_Curso === idParaRemover)?.Nome}"`}
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