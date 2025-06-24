const express = require('express')
const router = express.Router()
const pool = require('../db/connection.js')


//FUNCIONA
// Endpoint para obter todas as salas
router.get('/getSala', (req,res) => {
    const query = "SELECT * FROM sala"
    pool.query(query, (err, results) => {
        if (err) {
            console.error("Erro na consulta à base de dados:", err)
            return res.status(500).json({ error: "Consulta à base de dados falhou" })
        }
        return res.status(200).json(results)
    })
})

//FUNCIONA
// Endpoint para criar uma nova sala
router.post('/createSala', async (req, res) => {
    const { nome, cod_escola } = req.body

    // Validação dos dados
    if (!nome || !cod_escola) {
        return res.status(400).json({ error: 'Nome e código da escola são obrigatórios' })
    }

    try {
        // Verificar se a sala já existe
        const [resultado] = await pool.promise().query(`SELECT * FROM sala WHERE Nome = ? AND Cod_Escola = ?`, [nome, cod_escola])
        if (resultado.length > 0) {
            return res.status(400).json({ error: 'Essa sala já existe na escola especificada' })
        }

        // Inserir a nova sala
        const query = `INSERT INTO sala (Nome, Cod_Escola) VALUES (?, ?)`
        const values = [nome, cod_escola]
        await pool.promise().query(query, values)

        return res.status(200).json({ message: 'Sala criada com sucesso' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})



//Endpoint para atualizar uma sala existente e verificar se a sala atualizada já existe
router.post('/updateSala', async (req, res) => {
    const { nome, cod_escola, cod_sala} = req.body

    // Validação dos dados
    if (!nome || !cod_escola) {
        return res.status(400).json({ error: 'Nome, código da escola e código da sala são obrigatórios' })
    }

    try {
        // Verificar se a sala já existe
       const [resultado] = await pool.promise().query(`SELECT * FROM sala WHERE Nome = ? and Cod_Escola = ?` , [nome, cod_escola])
       if(resultado.length > 0){
           return res.status(400).json({ error: 'Essa sala já existe na escola especificada' })
       }
        // Atualizar a sala
        const query = `UPDATE sala SET Nome = ?, Cod_Escola = ? WHERE Cod_Sala = ?`
        const values = [nome, cod_escola, cod_sala]
        await pool.promise().query(query, values)

        return res.status(200).json({ message: 'Sala atualizada com sucesso' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
)

router.delete('/deleteSala',(req,res)=>{
    const {cod_sala} = req.body
    const query = `DELETE FROM sala WHERE Cod_Sala = ?`
    const values = [cod_sala]
    pool.query(query,values, (err)=>{
        if(err){
            console.error(err)
            res.status(500).json({error: 'Internal server error'})
        }
        else{
            res.status(200).json({message: 'Escola eliminada com sucesso'})
        }
    })
})

module.exports = router 