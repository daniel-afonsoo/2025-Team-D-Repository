// imports
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // base endpoint message
  const [baseMessage, setBaseMessage] = useState("fetching server's base endpoint...");

  // estado para o upload do ficheiro
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  // fetch base endpoint message
  useEffect(() => {
    axios.get('http://localhost:5170/')
      .then(res => setBaseMessage(res.data.message))
      .catch(err => {
        console.log("Error: Fetch to base endpoint. " + err);
        setBaseMessage("Error: Fetch to base endpoint.");
      });
  }, []);

  // Função para capturar o ficheiro selecionado
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Função para enviar o ficheiro para o backend
  const handleUpload = async () => {
    if (!file) return alert("Escolha um ficheiro Excel!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5170/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Resposta do backend:", response.data); // DEBUG: Ver se os dados chegaram

      if (response.data.success) {
        setData(response.data.data); // Armazena os dados recebidos do backend
      } else {
        alert("Erro ao processar o ficheiro.");
      }
    } catch (error) {
      console.error("Erro ao enviar o ficheiro:", error);
      alert("Erro ao enviar o ficheiro.");
    }
  };

  return (
    <>
      <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" target='_blank'>
        <h1>Eazy Schedule IPT</h1>
      </a>
      <h3>{baseMessage}</h3>

      {/* Upload de ficheiro */}
      <h2>Upload de Horários</h2>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <button onClick={handleUpload}>Enviar</button>

      {/* Tabela de dados */}
      <h2>Dados do Excel:</h2>
      {data.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default App;
