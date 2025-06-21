import React from "react";
import Draggable from "./Draggable";
import Droppable from "./Droppable";

const AulasDisponiveisBox = ({
  searchQuery,
  setSearchQuery,
  filteredAulasDisponiveis,
  isBlocked,
  filtrosSelecionados,
  getNomeCurso,
  getNomeTurma,
  getNomeUC,
  getNomeDocente,
  getNomeSala,
}) => {
  return (
    <Droppable id="aulas-disponiveis" isBlocked={false}>
      <div className="aulas-disponiveis">
        <h3>Aulas Disponíveis</h3>
        <input
          type="text"
          placeholder="Pesquisar aulas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {filtrosSelecionados ? (
          filteredAulasDisponiveis.length > 0 ? (
            filteredAulasDisponiveis.map((aula) => (
              <Draggable
                key={aula.id}
                id={"disponivel_" + aula.id}
                isBlocked={isBlocked}
                aulaInfo={aula}
              >
                <div className="aula-disponivel">
                  <div className="aula-header">
                    <strong className="curso-nome">{getNomeCurso(aula.curso)}</strong>
                    <span className="ano-badge">{aula.ano}º Ano</span>
                  </div>

                  <div className="aula-info">
                    <div className="info-row">
                      <span className="info-label">Turma:</span>
                      <span className="info-value">{getNomeTurma(aula.turma)}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">UC:</span>
                      <span className="info-value">{getNomeUC(aula.subject)}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Docente:</span>
                      <span className="info-value">{getNomeDocente(aula.docente)}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Sala:</span>
                      <span className="info-value">{getNomeSala(aula.location)}</span>
                    </div>
                    <div className="info-row duracao">
                      <span className="info-label">Duração:</span>
                      <span className="info-value">{aula.duration} min</span>
                    </div>
                  </div>
                </div>
              </Draggable>
            ))
          ) : (
            <p>Nenhuma aula disponível.</p>
          )
        ) : (
          <p>Por favor, preencha os filtros para acessar as aulas disponíveis.</p>
        )}
      </div>
    </Droppable>
  );
};

export default AulasDisponiveisBox;
