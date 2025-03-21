// imports
import { useState, useEffect } from 'react';
import axios from 'axios';
import Horarios from './horarios'; // Importa a página de horários
import './horarios.css'; // Importa os estilos

function App() {
  // base endpoint message
  const [baseMessage, setBaseMessage] = useState("fetching server's base endpoint...");

  // fetch base endpoint message
  useEffect(() => {
    axios.get('http://localhost:5170/')
      .then(res => setBaseMessage(res.data.message))
      .catch(err => {
        console.log("Error: Fetch to base endpoint. " + err);
        setBaseMessage("Error: Fetch to base endpoint.");
      });
  }, []);

  return (
    <>
      <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" target="_blank">
        <h1>Eazy Schedule IPT</h1>
      </a>
      <h3>{baseMessage}</h3>

      {/* Renderiza a página de horários */}
      <Horarios />
    </>
  );
}

export default App;