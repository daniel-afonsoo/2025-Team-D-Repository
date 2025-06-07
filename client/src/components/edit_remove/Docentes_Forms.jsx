// Importações de dependências, estilos, imagens e componentes auxiliares
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/edit_remove_Forms.css";
import bin from '../../images/bin.png';
import pencil from '../../images/pencil.png';
import ConfirmacaoModal from './Confirmacao';
import ModalEdicao from './EditModal';
import axios from 'axios'

import { TbUserEdit, TbTrash } from "react-icons/tb";


// Componente principal que permite listar, editar e remover docentes
const Docente_edit_remove = ({ filtro }) => {
  // Estados para controlar dados, modais e campos de edição
  const [dados, setDados] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [modalEdicaoAberta, setModalEdicaoAberta] = useState(false);
  const [idParaRemover, setIdParaRemover] = useState(null);
  const [editarItemId, setEditarItemId] = useState(null);
  const [editarCampos, setEditarCampos] = useState({});

  // Título do modal de edição
  const [tituloModal, setTituloModal] = useState('Editar Docente');

  useEffect(() => {
    axios.get('http://localhost:5170/getDocente')
      .then(response => {
        console.log("Resposta da API:", response.data);
        setDados(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar docentes:", error);
      });
  }, []);


  const dadosFiltrados = dados.filter((docente) =>
    docente?.Nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    docente?.Email?.toLowerCase().includes(filtro.toLowerCase())
  );

  // Abre o modal de confirmação de remoção
  const abrirModal = (id) => {
    setIdParaRemover(id);
    setModalAberta(true);
  };

  // Fecha o modal de confirmação
  const fecharModal = () => {
    setModalAberta(false);
    setIdParaRemover(null);
  };

  // Remove o docente selecionado
  const confirmarRemocao = () => {
    if (idParaRemover !== null) {
      axios.delete(`http://localhost:5170/deleteDocente/` , {
        data: { cod_docente: idParaRemover }
      })
        .then(() => {
          console.log("ID para remover:", idParaRemover);
          setDados(dados.filter(item => item.Cod_Docente !== idParaRemover));
          fecharModal();
        })
        .catch(error => {
          console.error("Erro ao remover docente:", error);
        });
    }
  };

  // Abre o modal de edição e preenche os campos
  const abrirModalEdicao = (item) => {
    setEditarItemId(item.Cod_Docente);
    setEditarCampos(item);
    setTituloModal('Editar Docente');
    setModalEdicaoAberta(true);
  };

  // Fecha o modal de edição
  const fecharModalEdicao = () => {
    setModalEdicaoAberta(false);
    setEditarItemId(null);
    setEditarCampos({});
  };

  // Atualiza os campos conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditarCampos(prev => ({ ...prev, [name]: value }));
  };

  // Salva as alterações feitas no docente
  const confirmarEdicao = () => {
    // Criar objeto com as keys minúsculas
    const dadosParaEnviar = {
      cod_docente: editarCampos.Cod_Docente,
      nome: editarCampos.Nome,
      email: editarCampos.Email,
      password: editarCampos.Password,
    };


    console.log('Dados enviados para updateDocente:', dadosParaEnviar);

    axios.post(`http://localhost:5170/updateDocente`, dadosParaEnviar)
      .then(() => {
        const updatedItem = {
          Cod_Docente: editarCampos.Cod_Docente,
          Nome: editarCampos.Nome,
          Email: editarCampos.Email,
          Password: editarCampos.Password
        };
        setDados(prev => prev.map(item =>item.Cod_Docente === editarCampos.Cod_Docente ? updatedItem : item )  );
        
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
          <div key={item.Cod_Docente} className="card">
            <div className="card-info">
              <h3>{item.Nome}</h3>
              <p><b>Email:</b> {item.Email}</p>
              <p className="limited-password"><b>Password:</b>  {item.Password}</p>
              <button className='btEdit' onClick={() => abrirModalEdicao(item)}>
                {/* <img src={pencil} alt="Editar" width="20" height="20" /> */}
                <TbUserEdit size={25} />
              </button>
              <button className='btRemove' onClick={() => abrirModal(item.Cod_Docente)}>
                {/* <img src={bin} alt="Remover" width="20" height="20" /> */}
                <TbTrash size={25} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmacaoModal
        itemToRemove={`"${idParaRemover ? dados.find(item => item.Cod_Docente === idParaRemover).nome : ''}"`}
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

export default Docente_edit_remove;