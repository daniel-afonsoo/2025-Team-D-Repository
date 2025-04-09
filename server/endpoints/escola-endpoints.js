const express = require('express')
const router = express.Router()
const pool = require('../db/connection.js')

//FUNCIONA
router.get('/getEscola',(res)=>{
    const query = "SELECT * FROM escola"
    pool.query(query, (err,results)=>{
        if(err){
            console.error("Erro na consulta à base de dados:",err)
            return res.status(500).json({error:"Consulta à base de dados falhou"})
        }else{
            res.status(200).json(results)
            res.json(results)
        }
    })
})

//FUNCIONA
router.post('/createEscola',async(req,res)=>{
    const {nome,abreviacao} = req.body
    // Validação dos dados
    if (!nome || !abreviacao) {
        return res.status(400).json({ error: 'Nome e abreviação são obrigatórios' })
    }

    // Verificar se a escola já existe
    const [resultado] = await pool.promise().query(`SELECT * FROM escola WHERE Nome = ? and Abreviacao = ?`,[nome, abreviacao])
    if(resultado.length > 0){
        return res.status(400).json({ error: 'Esta escola já existe' })
    }

    const query = `INSERT INTO escola (Nome, Abreviacao) VALUES (?,?)`
    const values = [nome,abreviacao]

    pool.query(query,values,(err) => {
        if(err) {
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        }
        return res.status(200).json({message: 'Escola criada com sucesso'})
    }
    )
})


//FUNCIONA
router.post('/updateEscola', async(req,res)=>{
    const {nome,abreviacao,cod_escola} = req.body
    // Validação dos dados
    if (!nome || !abreviacao || !cod_escola) {
        return res.status(400).json({ error: 'Nome, abreviação e código da escola são obrigatórios' })
    }

    // Verificar se a escola já existe
    const [resultado] = await pool.promise().query(`SELECT * FROM escola WHERE Nome = ? and Abreviacao = ? and Cod_Escola = ?`,[nome, abreviacao, cod_escola])
    if(resultado.length > 0){
        return res.status(400).json({ error: 'Essa escola já existe' })
    }

    const query = `UPDATE escola SET Nome = ?, Abreviacao = ? WHERE Cod_Escola = ?`
    const values = [nome,abreviacao,cod_escola]
    pool.query(query,values, (err)=>{
        if(err){
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        }
        else{
            return res.status(200).json({message: 'Escola atualizada com sucesso'})
        }
    })
})


//FUNCIONA
router.post('/deleteEscola',(req,res)=>{
    const {cod_escola} = req.body
    const query = `DELETE FROM escola WHERE Cod_Escola = ?`
    const values = [cod_escola]
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