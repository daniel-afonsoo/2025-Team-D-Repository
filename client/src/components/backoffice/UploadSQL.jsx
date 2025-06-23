import React, { useState } from "react";

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
    <div className="p-4 border rounded shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Upload de Ficheiro Excel</h2>
      <input type="file" accept=".xlsx" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Enviar e Baixar SQL
      </button>
      {status && <p className="mt-4 font-medium">{status}</p>}
    </div>
  );
};

export default UploadSQL;
