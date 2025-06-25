const express = require('express')
const router = express.Router()
const pool = require('../db/connection.js')

// GET todas as entradas de anosemestre
router.get('/getAnoSemestre', (req, res) => {
    const query = "SELECT * FROM anosemestre"
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Erro na consulta à base de dados:", err)
            return res.status(500).json({ error: "Consulta à base de dados falhou" })
        }
        return res.status(200).json(results)
    })
})

// CREATE nova entrada
router.post('/createAnoSemestre', async (req, res) => {
    const { Nome } = req.body
    if (!Nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' })
    }
    // Verificar se já existe
    const [resultado] = await pool.promise().query("SELECT * FROM anosemestre WHERE Nome = ?", [Nome])
    if (resultado.length > 0) {
        return res.status(400).json({ error: 'Esse nome já existe' })
    }
    const query = `INSERT INTO anosemestre (Nome) VALUES (?)`
    const values = [Nome]
    pool.query(query, values, (err) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Internal server error' })
        }
        return res.status(200).json({ message: 'AnoSemestre criado com sucesso' })
    })
})

// UPDATE entrada existente
router.post('/updateAnoSemestre', async (req, res) => {
    const { Cod_AnoSemestre, Nome } = req.body
    if (!Cod_AnoSemestre || !Nome) {
        return res.status(400).json({ error: 'Código e nome são obrigatórios' })
    }
    // Verificar se já existe outro com o mesmo nome
    const [resultado] = await pool.promise().query("SELECT * FROM anosemestre WHERE Nome = ? AND Cod_AnoSemestre != ?", [Nome, Cod_AnoSemestre])
    if (resultado.length > 0) {
        return res.status(400).json({ error: 'Já existe um registro com esse nome' })
    }
    const query = `UPDATE anosemestre SET Nome = ? WHERE Cod_AnoSemestre = ?`
    const values = [Nome, Cod_AnoSemestre]
    pool.query(query, values, (err) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Internal server error' })
        }
        return res.status(200).json({ message: 'AnoSemestre atualizado com sucesso' })
    })
})

// DELETE entrada
router.delete('/deleteAnoSemestre', (req, res) => {
    const { Cod_AnoSemestre } = req.body
    if (!Cod_AnoSemestre) {
        return res.status(400).json({ error: 'Código do ano/semestre é obrigatório' })
    }
    const query = `DELETE FROM anosemestre WHERE Cod_AnoSemestre = ?`
    const values = [Cod_AnoSemestre]
    pool.query(query, values, (err) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Internal server error' })
        } else {
            return res.status(200).json({ message: 'AnoSemestre eliminado com sucesso' })
        }
    })
})

module.exports = router