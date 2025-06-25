// Imports
const express = require('express');
const pool = require('../db/connection.js');
const router = express.Router();

// Endpoint to fetch all Docentes (code + name)
router.get('/docentes', (req, res) => {
    const query = "SELECT DISTINCT Cod_Docente, Nome FROM docente";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching docentes:", err);
            return res.status(500).json({ error: "Failed to fetch docentes" });
        }
        res.json(results);
    });
});

// Endpoint to fetch all Escolas (code + name)
router.get('/escolas', (req, res) => {
    const query = "SELECT DISTINCT Cod_Escola, Nome FROM escola";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching escolas:", err);
            return res.status(500).json({ error: "Failed to fetch escolas" });
        }
        res.json(results);
    });
});

// Endpoint to fetch all Salas (code + name)
router.get('/salas', (req, res) => {
    const query = "SELECT DISTINCT Cod_Sala, Nome FROM sala";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching salas:", err);
            return res.status(500).json({ error: "Failed to fetch salas" });
        }
        res.json(results);
    });
});

// Endpoint to fetch all Turmas (code)
router.get('/turmas', (req, res) => {
    const query = "SELECT DISTINCT Cod_Turma FROM turma";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching turmas:", err);
            return res.status(500).json({ error: "Failed to fetch turmas" });
        }
        res.json(results);
    });
});

// Endpoint to fetch all UCs (code + name)
router.get('/ucs', (req, res) => {
    const query = "SELECT DISTINCT Cod_Uc, Nome FROM uc";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching UCs:", err);
            return res.status(500).json({ error: "Failed to fetch UCs" });
        }
        res.json(results);
    });
});

// Endpoint to fetch all Cursos (code + name)
router.get('/cursos', (req, res) => {
    const query = "SELECT DISTINCT Cod_Curso, Nome FROM curso";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching cursos:", err);
            return res.status(500).json({ error: "Failed to fetch cursos" });
        }
        res.json(results);
    });
});

// Endpoint to fetch all Anos (code + name if available)
router.get('/anos', (req, res) => {
    // If you have a Nome or description for AnoSemestre, include it here
    const query = "SELECT DISTINCT Cod_AnoSemestre, Ano FROM anosemestre";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching anos:", err);
            return res.status(500).json({ error: "Failed to fetch anos" });
        }
        res.json(results);
    });
});

module.exports = router;