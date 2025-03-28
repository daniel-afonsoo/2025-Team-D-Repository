// server.js

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const { uploadFile } = require("./FILTROS/uploadHandler");  // Importando o handler de upload
const { processExcelFile } = require("./FILTROS/sqlGenerator");  // Importando o gerador de SQL
const fs = require("fs");

// express instance & server port
const app = express();
const backendPort = 5170;
app.use(cors());

// socket.io server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // aceitando solicitações de todos os origens por enquanto
    },
});

// base endpoint
app.get("/", (req, res) => {
    console.log(`Base endpoint hit. Client's IP: ${req.ip}`);
    res.json({ message: "Hello from the server's backend!" });
});

// Rota para upload do arquivo Excel e geração dos arquivos SQL
app.post("/upload", uploadFile(), (req, res) => {
    console.log("Recebendo arquivo:", req.file); // DEBUG

    if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo foi enviado" });
    }

    try {
        // Processar o arquivo Excel e gerar os arquivos SQL para cada folha
        const generatedFiles = processExcelFile(req.file.path);

        console.log(`Arquivos SQL gerados em: ${generatedFiles}`);

        res.json({
            success: true,
            message: "Arquivos SQL gerados!",
            files: generatedFiles,  // Retorna os caminhos dos arquivos gerados
        });
    } catch (error) {
        console.error("Erro ao processar o Excel:", error);
        res.status(500).json({ error: "Erro ao processar o arquivo" });
    }
});

// socket.io connection event
io.on("connection", (socket) => {
    console.log(`A new user has connected. User ID: ${socket.id}`);
});

// starting the server
server.listen(backendPort, () => {
    console.log("\n=============== Easy Schedule IPT - Backend ===============");
    console.log(`Server started. Listening on port ${backendPort}.`);
    console.log("Socket.io server is running...");
    console.log("\n");
});
