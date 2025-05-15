const express = require('express')
const router = express.Router()
const pool = require('../db/connection.js') 


router.get('/getDropdownFilters', async (req, res) => {
    try {
        // Query para obter as escolas
        const escolasQuery = `SELECT Cod_Escola, Abreviacao FROM escola`;
        const [escolas] = await pool.promise().query(escolasQuery);

        // Query para obter os cursos
        const cursosQuery = `SELECT Cod_Curso, Nome FROM curso`;
        const [cursos] = await pool.promise().query(cursosQuery);

        // Query para obter as turmas
        const turmasQuery = `SELECT Cod_Turma, Turma, AnoTurma FROM turma`;
        const [turmas] = await pool.promise().query(turmasQuery);

        // Estrutura JSON
        const response = {
            filtrosEscolas: escolas.map(escola => ({
                Cod_Escola: escola.Cod_Escola,
                Abreviacao: escola.Abreviacao
            })),
            filtrosCursos: cursos.map(curso => ({
                Cod_Curso: curso.Cod_Curso,
                Nome: curso.Nome
            })),
            filtrosTurma: turmas.map(turma => ({
                Cod_Turma: turma.Cod_Turma,
                Turma: turma.Turma,
                AnoTurma: turma.AnoTurma
            }))
        };

        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router