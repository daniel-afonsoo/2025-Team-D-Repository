import { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import "../styles/horarios.css"; // Ensure the correct relative path to the CSS file// Importa o ficheiro de CSS

// Definição dos dias da semana
const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// Gera as faixas horárias do horário (das 8:30 às 24:00)
const horas = Array.from({ length: 31 }, (_, i) => {
  const startHour = 8 + Math.floor((i + 1) / 2); // Calcula a hora inicial
  const startMinutes = i % 2 === 0 ? "30" : "00"; // Define os minutos (30 ou 00)
  const endHour = startMinutes === "30" ? startHour + 1 : startHour; // Calcula a hora final
  const endMinutes = startMinutes === "30" ? "00" : "30"; // Define os minutos finais
  return `${startHour}:${startMinutes} - ${endHour === 24 ? "00" : endHour}:${endMinutes}`;
});

// Componente que representa uma aula arrastável
function Draggable({ id, children, isBlocked }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled: isBlocked, // Desativa o arrastar se o horário estiver bloqueado
  });

  // Aplica estilo para simular o movimento ao arrastar
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: isBlocked ? "not-allowed" : "grab", // Altera o cursor se bloqueado
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="aula">
      {children}
    </div>
  );
}

// Componente que representa um bloco onde as aulas podem ser soltas (drop target)
function Droppable({ id, aulas, children, isBlocked }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  // Altera o fundo do bloco se estiver a ser alvo de um arrastar (hover)
  const style = { backgroundColor: isOver && !isBlocked ? "lightblue" : undefined };

  return (
    <td ref={setNodeRef} style={style} className="empty-slot">
      {/* Renderiza todas as aulas que estão dentro do bloco */}
      {aulas.map((aula) => (
        <Draggable key={aula} id={aula} isBlocked={isBlocked}>
          {aula}
        </Draggable>
      ))}
      {children}
    </td>
  );
}

// Componente principal que contém o horário
function Horarios() {
  // Estados para armazenar os filtros
  const [escola, setEscola] = useState("");
  const [curso, setCurso] = useState("");
  const [ano, setAno] = useState("");
  const [turma, setTurma] = useState("");

  // Estado para armazenar as aulas colocadas no horário
  const [aulas, setAulas] = useState({});

  // Estado com a lista de aulas disponíveis para arrastar
  const [disponiveis, setDisponiveis] = useState([
    "Matemática II - Sala B257",
    "Introdução à Programação - Sala B128",
    "Programação Web - Sala B255",
  ]);

  // Estado para controlar se o horário está bloqueado
  const [isBlocked, setIsBlocked] = useState(false);

  // Estado para armazenar mensagens de erro
  const [erro, setErro] = useState("");

  // Função chamada quando uma aula é solta (drag and drop)
  const handleDragEnd = (event) => {
    if (isBlocked) return; // Impede mudanças se o horário estiver bloqueado

    const { active, over } = event;

    // Verifica se o drop foi no mesmo bloco onde a aula já está
    if (over && aulas[over.id] === active.id) {
      return; // Não faz nada se a aula já estiver no bloco de destino
    }

    if (!over) {
      // Se a aula for solta fora de um bloco válido, adiciona de volta à lista de disponíveis
      setDisponiveis((prevDisponiveis) => {
        if (!prevDisponiveis.includes(active.id)) {
          return [...prevDisponiveis, active.id];
        }
        return prevDisponiveis;
      });

      // Remove a aula do horário (estado de aulas)
      setAulas((prevAulas) => {
        const newAulas = { ...prevAulas };
        Object.keys(newAulas).forEach((key) => {
          if (newAulas[key] === active.id) {
            delete newAulas[key];
          }
        });
        return newAulas;
      });

      return;
    }

    setAulas((prevAulas) => {
      const newAulas = { ...prevAulas };

      // Verifica se o bloco já tem uma aula
      if (newAulas[over.id]) {
        setErro("Este bloco já tem uma aula!"); // Define a mensagem de erro

        // Garante que a aula não seja adicionada à aba de disponíveis se já estiver no horário
        if (!Object.values(prevAulas).includes(active.id)) {
          setDisponiveis((prevDisponiveis) => {
            if (!prevDisponiveis.includes(active.id)) {
              return [...prevDisponiveis, active.id];
            }
            return prevDisponiveis;
          });
        }

        return prevAulas; // Mantém o estado sem alterações
      }

      // Remove a aula da posição anterior
      Object.keys(newAulas).forEach((key) => {
        if (newAulas[key] === active.id) {
          delete newAulas[key];
        }
      });

      // Adiciona a aula à nova posição
      newAulas[over.id] = active.id;

      // Limpa a mensagem de erro, se houver
      setErro("");

      return newAulas;
    });

    // Remove a aula da lista de disponíveis apenas se o drop for válido
    setDisponiveis((prevDisponiveis) =>
      prevDisponiveis.filter((aula) => aula !== active.id)
    );
  };

  return (
    <DndContext modifiers={[restrictToWindowEdges]} onDragEnd={handleDragEnd}>
      <div className="horarios-container">
        {/* Botão para bloquear/desbloquear o horário */}
        <button onClick={() => setIsBlocked((prev) => !prev)} className="block-btn">
          {isBlocked ? "Desbloquear Horário" : "Bloquear Horário"}
        </button>

        {/* Exibe a mensagem de erro, se houver */}
        {erro && <div className="error-message">{erro}</div>}

        <div className="conteudo">
          {/* Tabela de horários */}
          <table className="timetable">
            <thead>
              <tr>
                <th>Horas</th>
                {diasSemana.map((dia) => (
                  <th key={dia}>{dia}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horas.map((hora, index) => (
                <tr key={index}>
                  <td className="hora">{hora}</td>
                  {diasSemana.map((dia) => (
                    <Droppable
                      key={`${dia}-${hora}`}
                      id={`${dia}-${hora}`}
                      aulas={aulas[`${dia}-${hora}`] ? [aulas[`${dia}-${hora}`]] : []}
                      isBlocked={isBlocked}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Filtros e aba de aulas */}
          <div className="filtros-e-aulas">
            {/* Filtros para seleção de escola, curso, ano e turma */}
            <div className="filtros">
              <select onChange={(e) => setEscola(e.target.value)}>
                <option value="">Escolher Escola</option>
                <option value="ESTT">ESTT</option>
                <option value="ESGT">ESGT</option>
              </select>
              <select onChange={(e) => setCurso(e.target.value)}>
                <option value="">Escolher Curso</option>
                <option value="Engenharia Informática">Engenharia Informática</option>
                <option value="Gestão">Gestão</option>
              </select>
              <select onChange={(e) => setAno(e.target.value)}>
                <option value="">Escolher Ano</option>
                <option value="1">1º Ano</option>
                <option value="2">2º Ano</option>
                <option value="3">3º Ano</option>
              </select>
              <select onChange={(e) => setTurma(e.target.value)}>
                <option value="">Escolher Turma</option>
                <option value="A">Turma A</option>
                <option value="B">Turma B</option>
              </select>
            </div>

            {/* Aba de aulas disponíveis */}
            <div className="aulas">
              <h3>Aulas Disponíveis</h3>
              {disponiveis.map((aula) => (
                <Draggable key={aula} id={aula} isBlocked={isBlocked}>
                  <div className="aula">{aula}</div>
                </Draggable>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default Horarios;
