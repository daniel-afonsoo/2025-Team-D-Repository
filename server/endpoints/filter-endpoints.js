const express = require('express')
const router = express.Router()
const pool = require('../db/connection.js') 


router.get('/getDropdownFilters', async (req, res) => {
    //receber parametro 
    const {escola} = req.query

    try {

        const [anosemestre] = await pool.promise().query(
            `SELECT * FROM anosemestre`
        );

        const [cursos] = await pool.promise().query(
            `SELECT * FROM curso Where Cod_Escola = ?`, [escola]
        );


        const [turmas] = await pool.promise().query(
            `SELECT * FROM turma`
        );


        const [ucs] = await pool.promise().query(
            `SELECT * FROM uc`
        );


        const [salas] = await pool.promise().query(
            `SELECT * FROM sala`
        );

        const [docentes] = await pool.promise().query(
            `SELECT * FROM docente`
        );

        res.status(200).json({
            anosemestre,
            cursos,
            turmas,
            ucs,
            salas,
            docentes
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router