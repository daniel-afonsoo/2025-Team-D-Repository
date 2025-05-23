import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/edit_remove_Forms.css";
import bin from '../../images/bin.png';
import pencil from '../../images/pencil.png';
import ConfirmacaoModal from './Confirmacao';
import ModalEdicao from './EditModal'; // Componente do modal de edição

import { TbEdit, TbTrash  } from "react-icons/tb";

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
    const dadosSimulados = [
      { id: 1, nome: "Engenharia Informática", abreviatura: "LEI", codCurso: "911", escola: "ESTT" },
      { id: 2, nome: "Engenharia Eletrotécnica e de Computadores", abreviatura: "LEEC", codCurso: "912", escola: "ESTT" },
      { id: 3, nome: "Engenharia Mecanica", abreviatura: "EMC", codCurso: "824", escola: "ESTT" },
      { id: 4, nome: "Engenharia Bioquimica", abreviatura: "EBQ", codCurso: "45", escola: "ESTA" },
      { id: 5, nome: "Engenharia Eletrotécnica ", abreviatura: "LE", codCurso: "910", escola: "ESTT" },
      { id: 6, nome: "Recursos Humanos", abreviatura: "RH", codCurso: "885", escola: "ESGT" },
      { id: 7, nome: "Contabilidade", abreviatura: "Ct", codCurso: "820", escola: "ESGT" },
      { id: 8, nome: "Psicologia", abreviatura: "PS", codCurso: "42", escola: "ESCT" }
    ];
    setDados(dadosSimulados);
  }, []);

  const dadosFiltrados = dados.filter((curso) =>
    curso.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    curso.abreviatura.toLowerCase().includes(filtro.toLowerCase()) ||
    curso.codCurso.toLowerCase().includes(filtro.toLowerCase()) ||
    curso.escola.toLowerCase().includes(filtro.toLowerCase())
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
      setDados(dados.filter(item => item.id !== idParaRemover));
    }
    fecharModal();
  };

  const abrirModalEdicao = (item) => {
    setEditarItemId(item.id);
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
              <p><b>Abreviatura:</b> {item.abreviatura}</p>
              <p><b>Código do Curso:</b> {item.codCurso}</p>
              <p><b>Escola:</b> {item.escola}</p>
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