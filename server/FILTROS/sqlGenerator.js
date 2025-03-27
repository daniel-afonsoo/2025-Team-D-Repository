// sqlGenerator.js

const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

function generateSQL(data) {
    let sql = "USE easyscheduleipt;\n\n";

    data.forEach((row) => {
        if (!row.ID || !row.Nome || !row.Email || !row.Password) return;

        sql += `INSERT INTO Docente (ID, Nome, Email, Password) VALUES (${row.ID}, '${row.Nome}', '${row.Email}', '${row.Password}');\n`;
    });

    return sql;
}

function processExcelFile(filePath) {
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];

        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet, { defval: "" });

        const sqlStatements = generateSQL(data);

        const sqlFilePath = path.join(__dirname, "docentes.sql");
        fs.writeFileSync(sqlFilePath, sqlStatements, "utf-8");

        return sqlFilePath;  // Return the path where SQL file was saved
    } catch (error) {
        throw new Error("Erro ao processar o arquivo: " + error.message);
    }
}

module.exports = {
    processExcelFile
};
