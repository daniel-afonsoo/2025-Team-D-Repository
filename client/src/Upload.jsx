// imports
import { useState, useEffect } from 'react';
import axios from 'axios';

function Upload() {
  // estado para o upload do ficheiro
  const [file, setFile] = useState(null);

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
      {/* Upload de ficheiro */}
      <h2>Upload de Horários</h2>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <button onClick={handleUpload}>Enviar</button>
    </>
  );
}

export default Upload;
