import React, { useState } from "react";
import "../../styles/backoffice.css"; // ou outro ficheiro de estilos onde definirás as classes

const UploadSQL = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("");
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Selecione um ficheiro Excel (.xlsx).");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5170/uploadSQL", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Erro no servidor");

      setStatus(result.message);

      const downloadRes = await fetch(`http://localhost:5170${result.downloadUrl}`);
      const blob = await downloadRes.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = result.downloadUrl.split("/").pop();
      a.click();
      URL.revokeObjectURL(a.href);

    } catch (err) {
      console.error(err);
      setStatus("Erro durante o upload ou download.");
    }
  };

  return (
    <div className="upload-sql-wrapper">
      <h2 className="upload-title">Upload de Ficheiro Excel</h2>
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="upload-input"
      />
      <button onClick={handleUpload} className="upload-button">
        Enviar e Baixar SQL
      </button>
      {status && <p className="upload-status">{status}</p>}
    </div>
  );
};

export default UploadSQL;
