// sqlGenerator.js

const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

// Função para gerar os comandos SQL para uma tabela
function generateSQL(tableName, data) {
    let sql = `USE easyscheduleipt;\n\n`;

    data.forEach((row) => {
        // A lógica de verificação pode ser ajustada conforme necessário para cada tabela
        const columns = Object.keys(row).join(", ");
        const values = Object.values(row)
            .map(value => {
                if (typeof value === "string") {
                    return `'${value.replace(/'/g, "''")}'`; // Escape single quotes for SQL
                }
                return value;
            })
            .join(", ");

        sql += `INSERT INTO ${tableName} (${columns}) VALUES (${values});\n`;
    });

    return sql;
}

// Função para processar o arquivo Excel e gerar arquivos SQL para cada folha
function processExcelFile(filePath) {
    try {
        const workbook = xlsx.readFile(filePath);

        // Para cada folha na planilha, gerar um arquivo SQL correspondente
        let generatedFiles = [];
        
        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet, { defval: "" });

            // Determinar o nome da tabela com base na folha (sheetName)
            const tableName = sheetName.trim();  // Evitar problemas de espaços

            if (!tableName) {
                throw new Error("A folha do Excel não tem um nome válido para a tabela.");
            }

            // Gerar comandos SQL para a tabela
            const sqlStatements = generateSQL(tableName, data);

            // Salvar o arquivo SQL
            const sqlFilePath = path.join(__dirname, `${tableName}.sql`);
            fs.writeFileSync(sqlFilePath, sqlStatements, "utf-8");

            generatedFiles.push(sqlFilePath); // Armazenar o caminho do arquivo gerado
        });

        return generatedFiles;  // Retornar os caminhos dos arquivos gerados
    } catch (error) {
        throw new Error("Erro ao processar o arquivo: " + error.message);
    }
}

module.exports = {
    processExcelFile
};
