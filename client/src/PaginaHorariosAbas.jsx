import { useState } from 'react';

//Material UI (MUI) é uma biblioteca de componentes de UI para React, inspirada no Material Design do Google. 
// O Material UI fornece componentes prontos e altamente personalizáveis para criar interfaces modernas e responsivas de forma rápida.
import { Tabs, Tab, Box, Typography } from '@mui/material';


import './PáginaHorários.css';


//A função TabPanel é responsável por mostrar ou esconder o conteúdo das abas. A função verifica qual aba está ativa e só exibe o conteúdo dessa aba
// A função recebe três coisas:
// >children → Representa o que estiver dentro do <TabPanel></TabPanel> . Em React, children representa o conteúdo dentro de um componente
// >value →  Índice da aba ativa(vem do useState), ou seja, qual é a aba que está atualmente selecionada.
// >index →  Índice da aba específica que o TabPanel representa
function TabPanel({ children, value, index }) {
  return (
    //Se value !== index, significa que essa aba não está ativa, então ela fica oculta (hidden=true)
    //Se value === index, significa que essa aba está ativa, então ela será exibida e ,por conseguinte, o codigo dentro será renderizado (hidden=false)
    //<TabPanel value={1} index={0}>Turmas</TabPanel>   // Escondido
    //<TabPanel value={1} index={1}>Docentes</TabPanel> // Mostrado
    //Aqui, apenas "Docentes" será exibido porque value === index
    //O hidden={value !== index} só esconde a aba inativa, mas mantém essa aba no DOM.
    //O {value === index && (...)} impede que o conteúdo seja processado quando a aba não está ativa.
    //Isto em conjunto garante um melhor controle do layout e do desempenho da aplicação! 
    <div hidden={value !== index}>
      {value === index && (
         //O Box é um componente do Material UI que serve como um container flexível, semelhante a uma <div>, mas com mais controle sobre o layout e estilos.
        //Neste caso estamos a usar um Box para organizar o conteúdo dentro das abas
        //p={6} → Adiciona espaçamento interno (padding) 
        <Box className="tab-content">
         {/*Typography é um estilo visual do Material UI*/}
          <Typography className="tab-text">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function TabsHorarios() {

  // Estado para controlar a aba ativa
  //useState(0) cria um estado inicial com o valor 0 ,ou seja, a primeira aba (Turmas) está ativa.
  //tabIndex →Valor atual do estado (qual aba está ativa).
  //setTabIndex(newIndex) → Função para atualizar tabIndex e re-renderizar o componente.
  //O utilziador clica na aba "Docentes" (segunda aba).
  //O newIndex será 1, pois "Docentes" está na posição 1.
  //O React executa:
  //setTabIndex(1); // Atualiza tabIndex para 1
  // O React re-renderiza o componente, agora com tabIndex = 1.
  // Como tabIndex mudou, a aba "Docentes" agora está ativa.
  //Quando chamamos setTabIndex(newIndex), o React atualiza o estado tabIndex com o novo valor
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box>
      {/*borderBottom: 1->Isso cria uma linha na parte inferior do elemento.*/}
      {/*O valor 3 significa que a borda tem uma espessura média-leve.*/}
      {/*O divider é uma cor padrão do Material UI, geralmente um cinza claro.*/}
      {/* mt: 1 ->Isso adiciona uma margem superior (margin-top) de 1 unidade.*/}
      <Box className="tabs-container">
        {/*Tabs	é o container que segura todas as abas.*/}
        <Tabs

          //value={tabIndex} → Controla qual a aba que está ativa no momento.
          value={tabIndex}

           //O estado tabIndex é um número (0, 1 ou 2), indicando a aba ativa.
          //Quando o utilizador clica numa aba, setTabIndex(newIndex) atualiza o estado para esse índice.
          //Isso faz com que o conteúdo da aba mude dinamicamente.
          //onChange → É acionado quando o utilizador clica numa aba.
          // O newIndex muda dinamicamente conforme o utilizador clica
          //Quando ele clica, setTabIndex(newIndex) atualiza o estado com o novo índice da aba ativa.
          //O e(evento) contém detalhes muito específicos do clique, como:
          // Qual elemento foi clicado (target)
          //A posição exata do clique na tela (screenX, screenY)
          //Se alguma tecla especial estava pressionada (ctrlKey, shiftKey, altKey) 
          onChange={(e, newIndex) => setTabIndex(newIndex)}
          aria-label="Basic Tabs Example"
          className="tabs-wrapper"
          centered // <- Centraliza as abas na tela do cliente
        >

        {/*Cada <Tab> representa uma aba, e label="..." define o nome dela.
            Os índices são automáticos:
            "Turmas" → index = 0
            "Docentes" → index = 1
            "Salas" → index = 2
          */}
          {/*Tab representa uma aba individual dentro de Tabs.*/}
          <Tab label="Turmas" />
          <Tab label="Docentes" />
          <Tab label="Salas" />
        </Tabs>
      </Box>
      {/* Conteúdo das abas */}
      {/*Somente o painel cujo index é igual ao value será exibido.*/}
      <TabPanel value={tabIndex} index={0}>Turmas</TabPanel>
      <TabPanel value={tabIndex} index={1}>Docentes</TabPanel>
      <TabPanel value={tabIndex} index={2}>Salas</TabPanel>
    </Box>
  );
}

export default TabsHorarios;
