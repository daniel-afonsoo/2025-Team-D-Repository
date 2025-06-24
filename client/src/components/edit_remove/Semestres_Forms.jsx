import { useState, useEffect } from 'react';
import '../../styles/edit_remove_Forms.css';
import ConfirmacaoModal from './Confirmacao';
import ModalEdicao from './EditModal';
import axios from 'axios';
import { TbEdit, TbTrash } from 'react-icons/tb';

const Semestres_Forms = ({ filtro, refresh }) => {
  const [dados, setDados] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [modalEdicaoAberta, setModalEdicaoAberta] = useState(false);
  const [idParaRemover, setIdParaRemover] = useState(null);
  const [editarItemId, setEditarItemId] = useState(null);
  const [editarCampos, setEditarCampos] = useState({});
  const [tituloModal, setTituloModal] = useState('Editar Ano/Semestre');

  const fetchDados = () => {
    axios.get('http://localhost:5170/getAnoSemestre')
      .then(response => setDados(response.data))
      .catch(error => console.error('Erro ao buscar anos/semestres:', error));
  };

  useEffect(() => {
    fetchDados();
  }, [refresh]);

  const dadosFiltrados = dados.filter((item) => {
    const filtroLower = filtro ? filtro.toLowerCase() : '';
    return item.Nome && item.Nome.toLowerCase().includes(filtroLower);
  });

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
      axios.delete('http://localhost:5170/deleteAnoSemestre', {
        data: { Cod_AnoSemestre: idParaRemover }
      })
        .then(() => {
          setDados(dados.filter(item => item.Cod_AnoSemestre !== idParaRemover));
          fecharModal();
        })
        .catch(error => {
          console.error('Erro ao remover ano/semestre:', error);
        });
    }
  };

  const abrirModalEdicao = (item) => {
    setEditarItemId(item.Cod_AnoSemestre);
    setEditarCampos(item);
    setTituloModal('Editar Ano/Semestre');
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
      Cod_AnoSemestre: editarCampos.Cod_AnoSemestre,
      Nome: editarCampos.Nome
    };
    axios.post('http://localhost:5170/updateAnoSemestre', dadosParaEnviar)
      .then(() => {
        setDados(prev => prev.map(item => item.Cod_AnoSemestre === editarCampos.Cod_AnoSemestre ? { ...item, Nome: editarCampos.Nome } : item));
        fecharModalEdicao();
      })
      .catch(error => {
        if (error.response) {
          console.error('Status:', error.response.status);
          console.error('Dados retornados:', error.response.data);
        } else {
          console.error('Erro ao atualizar ano/semestre:', error.message);
        }
      });
  };

  return (
    <div className="lista-container">
      <div className="lista">
        {dadosFiltrados.map((item) => (
          <div key={item.Cod_AnoSemestre} className="card">
            <div className="card-info">
              <h3>{item.Nome}</h3>
              <button className='btEdit' onClick={() => abrirModalEdicao(item)}>
                <TbEdit size={25} />
              </button>
              <button className='btRemove' onClick={() => abrirModal(item.Cod_AnoSemestre)}>
                <TbTrash size={25} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmacaoModal
        itemToRemove={`"${dados.find(item => item.Cod_AnoSemestre === idParaRemover)?.Nome}"`}
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
        // Nenhum campo extra além de Nome
      />
    </div>
  );
};

export default Semestres_Forms;
