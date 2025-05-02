// Imports
const express = require('express');
const pool = require('../db/connection.js');
const router = express.Router();

// Endpoint to fetch all Turmas
router.get('/turmas', (req, res) => {
    const query = "SELECT Cod_Turma, Cod_Curso, Cod_AnoSemestre FROM turma";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching turmas:", err);
            return res.status(500).json({ error: "Failed to fetch turmas" });
        }
        console.log(`Turmas endpoint hit successfully. Client's IP: ${req.ip}`);
        res.json(results);
    });
});

// Endpoint to fetch all Docentes
router.get('/docentes', (req, res) => {
    const query = "SELECT Cod_Docente, Nome, Email FROM docente";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching docentes:", err);
            return res.status(500).json({ error: "Failed to fetch docentes" });
        }
        console.log(`Docentes endpoint hit successfully. Client's IP: ${req.ip}`);
        res.json(results);
    });
});

// Endpoint to fetch all Aulas
router.get('/aulas', (req, res) => {
    const query = `
        SELECT Cod_Aula, Cod_Docente, Cod_Sala, Cod_Turma, Cod_Uc, Cod_Curso, Cod_AnoSemestre, Dia, Inicio, Fim
        FROM aula
    `;
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching aulas:", err);
            return res.status(500).json({ error: "Failed to fetch aulas" });
        }
        console.log(`Aulas endpoint hit successfully. Client's IP: ${req.ip}`);
        res.json(results);
    });
});

module.exports = router;