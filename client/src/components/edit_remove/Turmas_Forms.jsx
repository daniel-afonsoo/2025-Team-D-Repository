import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/edit_remove_Forms.css";
import bin from '../../images/bin.png';
import pencil from '../../images/pencil.png';
import ConfirmacaoModal from './Confirmacao';
import ModalEdicao from './EditModal';
import axios from 'axios'

import { TbEdit, TbTrash  } from "react-icons/tb";

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

    useEffect(() => {
        axios.get('http://localhost:5170/getTurma')
          .then(response => {
            console.log("Resposta da API:", response.data);
            setDados(response.data);
          })
          .catch(error => {
            console.error("Erro ao buscar docentes:", error);
          });
      }, []);

    const dadosFiltrados = dados.filter((turma) =>
        
        turma.Turma_Abv.toLowerCase().includes(filtro.toLowerCase())

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
          axios.delete(`http://localhost:5170/deleteTurma/` , {
            data: { Cod_Turma: idParaRemover }
          })
            .then(() => {
              console.log("ID para remover:", idParaRemover);
              setDados(dados.filter(item => item.Cod_Turma !== idParaRemover));
              fecharModal();
            })
            .catch(error => {
              console.error("Erro ao remover docente:", error);
            });
        }
      };

    // Abre o modal de edição com os dados da Turma selecionada
    const abrirModalEdicao = (item) => {
        setEditarItemId(item.Cod_Turma);
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
        const dadosParaEnviar = {
            Cod_Turma: editarCampos.Cod_Turma,
            Cod_Curso: editarCampos.Cod_Curso,
            Cod_AnoSemestre: editarCampos.Cod_AnoSemestre,
            Turma_Abv: editarCampos.Turma_Abv,
            AnoTurma: editarCampos.AnoTurma
        };
    
        console.log('Dados enviados para updateTurma:', dadosParaEnviar);
    
        axios.post(`http://localhost:5170/updateTurma`, dadosParaEnviar)
          .then(() => {
            const updatedItem = {
                Cod_Turma: editarCampos.Cod_Turma,
                Cod_Curso: editarCampos.Cod_Curso,
                Cod_AnoSemestre: editarCampos.Cod_AnoSemestre,
                Turma_Abv: editarCampos.Turma_Abv,
                AnoTurma: editarCampos.AnoTurma
            };
            setDados(prev => prev.map(item =>item.Cod_Turma === editarCampos.Cod_Turma ? updatedItem : item )  );
            
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
                    <div key={item.id} className="card">
                        <div className="card-info">
                            <h3>{item.Turma_Abv}</h3>
                            <p><b>Código de Curso:</b> {item.Cod_Curso}</p>
                            <p><b>Ano da Turma</b>: {item.AnoTurma}º Ano</p>
                            <p><b>Código Ano Semestre</b>: {item.Cod_AnoSemestre}</p>
                            <button className='btEdit' onClick={() => abrirModalEdicao(item)}>
                                <TbEdit size={25}/>
                            </button>
                            <button className='btRemove' onClick={() => abrirModal(item.Cod_Turma)}>
                                <TbTrash size={25}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmacaoModal
                itemToRemove={`Ano_Semestre "${dados.find(item => item.Cod_Turma === idParaRemover)?.Cod_AnoSemestre} -  Turma ${dados.find(item => item.Cod_Turma === idParaRemover)?.Turma_Abv}"`}
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