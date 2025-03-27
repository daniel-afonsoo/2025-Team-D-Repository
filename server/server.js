// server.js

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const { uploadFile } = require("./FILTROS/uploadHandler");  // Import the upload handler
const { processExcelFile } = require(".//FILTROS/sqlGenerator");  // Import the SQL generator
const fs = require("fs");

// express instance & server port
const app = express();
const backendPort = 5170;
app.use(cors());

// socket.io server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // accepting requests from all origins for now
    },
});

// base endpoint
app.get("/", (req, res) => {
    console.log(`Base endpoint hit. Client's IP: ${req.ip}`);
    res.json({ message: "Hello from the server's backend!" });
});

// Route for uploading Excel file and generating SQL
app.post("/upload", uploadFile(), (req, res) => {
    console.log("Recebendo arquivo:", req.file); // DEBUG

    if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo foi enviado" });
    }

    try {
        // Process the uploaded file and generate SQL file
        const sqlFilePath = processExcelFile(req.file.path);

        console.log(`SQL file saved at: ${sqlFilePath}`);

        res.json({ success: true, message: "SQL file generated!", filePath: sqlFilePath });
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
