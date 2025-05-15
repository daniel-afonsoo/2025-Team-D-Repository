const express = require('express')
const router = express.Router()
const { uploadFile } = require("../scripts-sql/uploadHandler")  // Importando o handler de upload
const { processExcelFile } = require("../scripts-sql/sqlGenerator")  // Importando o gerador de SQL

// Rota para upload do arquivo Excel e geração dos arquivos SQL
router.post("/upload", uploadFile(), (req, res) => {
    console.log("Recebendo arquivo:", req.file); // DEBUG

    if (!req.file) {
        console.log("Upload request recieved without any files!")
        return res.status(400).json({ error: "Nenhum arquivo foi enviado ao servidor" });
    }

    try {
        // Processar o arquivo Excel e gerar os arquivos SQL para cada folha
        const generatedFiles = processExcelFile(req.file.path);

        console.log(`Arquivos SQL gerados em: ${generatedFiles}`);

        res.json({
            success: true,
            message: `Ficheiro ${req.file.filename} recebido com sucesso.\n ${generatedFiles.length} scripts SQL gerados!`
        });

    } catch (error) {
        console.error("Erro ao processar o Excel:", error);
        res.status(500).json({ error: "Erro ao processar o arquivo" });
    }
});

module.exports = router