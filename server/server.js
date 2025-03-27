// imports
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
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

        // Convert data to SQL INSERT statements
        let sqlStatements = generateSQL(data);

        // Save SQL to a file
        const sqlFilePath = path.join(__dirname, "docentes.sql");
        fs.writeFileSync(sqlFilePath, sqlStatements, "utf-8");

        console.log(`SQL file saved at: ${sqlFilePath}`);

        res.json({ success: true, message: "SQL file generated!", filePath: sqlFilePath });
    } catch (error) {
        console.error("Erro ao processar o Excel:", error);
        res.status(500).json({ error: "Erro ao processar o arquivo" });
    }
});

// Function to generate SQL INSERT statements
function generateSQL(data) {
    let sql = "USE easyscheduleipt;\n\n";

    data.forEach((row) => {
        if (!row.ID || !row.Nome || !row.Email || !row.Password) return;

        sql += `INSERT INTO Docente (ID, Nome, Email, Password) VALUES (${row.ID}, '${row.Nome}', '${row.Email}', '${row.Password}');\n`;
    });

    return sql;
}
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
