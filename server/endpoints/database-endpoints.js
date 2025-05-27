// Imports
const express = require('express');
const pool = require('../db/connection.js');
const router = express.Router();

// Endpoint to fetch all Docentes
router.get('/docentes', (req, res) => {
    const query = "SELECT DISTINCT Cod_Docente FROM docente";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching docentes:", err);
            return res.status(500).json({ error: "Failed to fetch docentes" });
        }
        res.json(results.map(row => row.Cod_Docente));
    });
});

// Endpoint to fetch all Escolas
router.get('/escolas', (req, res) => {
    const query = "SELECT DISTINCT Cod_Escola FROM escola";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching escolas:", err);
            return res.status(500).json({ error: "Failed to fetch escolas" });
        }
        res.json(results.map(row => row.Cod_Escola));
    });
});

// Endpoint to fetch all Salas
router.get('/salas', (req, res) => {
    const query = "SELECT DISTINCT Cod_Sala FROM sala";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching salas:", err);
            return res.status(500).json({ error: "Failed to fetch salas" });
        }
        res.json(results.map(row => row.Cod_Sala));
    });
});

// Endpoint to fetch all Turmas
router.get('/turmas', (req, res) => {
    const query = "SELECT DISTINCT Cod_Turma FROM turma";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching turmas:", err);
            return res.status(500).json({ error: "Failed to fetch turmas" });
        }
        res.json(results.map(row => row.Cod_Turma));
    });
});

// Endpoint to fetch all UCs
router.get('/ucs', (req, res) => {
    const query = "SELECT DISTINCT Cod_Uc FROM uc";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching UCs:", err);
            return res.status(500).json({ error: "Failed to fetch UCs" });
        }
        res.json(results.map(row => row.Cod_Uc));
    });
});

// Endpoint to fetch all Cursos
router.get('/cursos', (req, res) => {
    const query = "SELECT DISTINCT Cod_Curso FROM curso";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching cursos:", err);
            return res.status(500).json({ error: "Failed to fetch cursos" });
        }
        res.json(results.map(row => row.Cod_Curso));
    });
});

// Endpoint to fetch all Anos
router.get('/anos', (req, res) => {
    const query = "SELECT DISTINCT Cod_AnoSemestre FROM aula";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching anos:", err);
            return res.status(500).json({ error: "Failed to fetch anos" });
        }
        res.json(results.map(row => row.Cod_AnoSemestre));
    });
});

// Endpoint to fetch all Aulas (filtered by escola, curso, ano, turma)
// router.get('/aulas', (req, res) => {
//     const { escola, curso, ano, turma } = req.query;

//     let query = `
//         SELECT Cod_Aula, Cod_Docente, Cod_Sala, Cod_Turma, Cod_Uc, Cod_Curso, Cod_AnoSemestre, Dia, Inicio, Fim, Cod_Escola
//         FROM aula
//         WHERE 1=1
//     `;

//     const params = [];

//     if (escola) {
//         query += `
//             AND Cod_Curso IN (
//                 SELECT Cod_Curso
//                 FROM curso
//                 WHERE Cod_Escola = ?
//             )
//         `;
//         params.push(escola);
//     }
//     if (curso) {
//         query += " AND Cod_Curso = ?";
//         params.push(curso);
//     }
//     if (ano) {
//         query += " AND Cod_AnoSemestre = ?";
//         params.push(ano);
//     }
//     if (turma) {
//         query += " AND Cod_Turma = ?";
//         params.push(turma);
//     }

//     console.log("Executing query:", query);
//     console.log("With parameters:", params);

//     pool.query(query, params, (err, results) => {
//         if (err) {
//             console.error("Error fetching aulas:", err);
//             return res.status(500).json({ error: "Failed to fetch aulas" });
//         }
//         res.json(results);
//     });
// });

module.exports = router;