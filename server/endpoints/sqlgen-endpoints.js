const express = require("express");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");

const router = express.Router();
const { uploadFile } = require("../scripts-sql/uploadHandler");
const { processExcelFile } = require("../scripts-sql/sqlGenerator");

router.post("/uploadSQL", uploadFile(), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo foi enviado ao servidor" });
    }

    try {
        const { folderPath, files } = processExcelFile(req.file.path);
        fs.unlinkSync(req.file.path); // delete the uploaded .xlsx file

        const zipName = path.basename(folderPath) + ".zip";

        // 📁 NEW: zip output path outside the folder being zipped
        const zipOutputDir = path.join(__dirname, "../scripts-sql/zips");
        fs.mkdirSync(zipOutputDir, { recursive: true }); // ensure directory exists
        const zipPath = path.join(zipOutputDir, zipName);
        const downloadUrl = `/download/${zipName}`;

        // Create ZIP
        await new Promise((resolve, reject) => {
            const output = fs.createWriteStream(zipPath);
            const archive = archiver("zip", { zlib: { level: 9 } });

            output.on("close", resolve);
            archive.on("error", reject);

            archive.pipe(output);
            archive.directory(folderPath, false); // ✅ now zip only the .sqls
            archive.finalize();
        });

        res.json({
            success: true,
            folderPath,
            fileCount: files.length,
            downloadUrl,
            message: `Ficheiro ${req.file.originalname} processado com sucesso.`
        });

    } catch (error) {
        console.error("Erro ao processar:", error);
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: "Erro ao processar o arquivo" });
    }
});

router.get("/download/:zipName", (req, res) => {
    const zipPath = path.join(__dirname, "../scripts-sql/zips", req.params.zipName);
    if (fs.existsSync(zipPath)) {
        res.download(zipPath);
    } else {
        res.status(404).json({ error: "Arquivo ZIP não encontrado." });
    }
});

module.exports = router;
