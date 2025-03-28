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
      
      alert(response.data.message)
      
    } catch (error) {
      alert(`Erro ao enviar o ficheiro:\n ${error}`);
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
