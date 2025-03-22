// imports
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");

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

// multer setup (para upload de ficheiros)
const upload = multer({ dest: "uploads/" });

// base endpoint
app.get("/", (req, res) => {
    console.log(`Base endpoint hit. Client's IP: ${req.ip}`);
    res.json({ message: "Hello from the server's backend!" });
});
console.log("A rota /upload foi registada!"); // DEBUG
// rota para upload do Excel
app.post("/upload", upload.single("file"), (req, res) => {
    console.log("Recebendo arquivo:", req.file); // DEBUG

    if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo foi enviado" });
    }

    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        console.log("Folha selecionada:", sheetName); // DEBUG

        const sheet = workbook.Sheets[sheetName];

        // Opção: Definir que queremos todas as colunas, incluindo vazias
        const data = xlsx.utils.sheet_to_json(sheet, { defval: "" }); 

        console.log("Dados convertidos:", data); // DEBUG

        res.json({ success: true, data });
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
