const express = require('express')
const router = express.Router()
const pool = require('../db/connection.js')

//FUNCIONA
router.get('/getAnoSemestre',(req,res)=>{
    const query = "SELECT * FROM anosemestre"
    pool.query(query, (err,results)=>{
        if(err){
            console.error("Erro na consulta à base de dados:",err)
            return res.status(500).json({error:"Consulta à base de dados falhou"})
        }else{
            res.status(200).json(results)
        }
    })
})

//FUNCIONA
router.post('/createAnoSemestre',async(req,res)=>{
    const {Ano,Semestre}=req.body
    // Validação dos dados
    if (!Ano || !Semestre) {
        return res.status(400).json({ error: 'Ano e semestre são obrigatórios' })
    }
    query = "SELECT * FROM anosemestre WHERE Ano = ? and Semestre = ?"
    values = [Ano,Semestre]
    const [resultado] = await pool.promise().query(query,values)
    if(resultado.length > 0){
        return res.status(400).json({ error: 'Esse ano e semestre já existe' })
    }
    query = `INSERT INTO anosemestre (Ano, Semestre) VALUES (?,?)`
    values = [Ano,Semestre]
    pool.query(query,values,(err) => {
        if(err) {
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        }
        return res.status(200).json({message: 'AnoSemestre criado com sucesso'})
    })

})

//FUNCIONA
router.post('/updateAnoSemestre', async(req,res)=>{
    const {Ano,Semestre,Cod_AnoSemestre} = req.body
    // Validação dos dados
    if (!Ano || !Semestre || !Cod_AnoSemestre) {
        return res.status(400).json({ error: 'Ano, semestre e código do ano e semestre são obrigatórios' })
    }
    // Verificar se o ano e semestre já existe
    const [resultado] = await pool.promise().query(`SELECT * FROM anosemestre WHERE Ano = ? and Semestre = ?`,[Ano, Semestre, Cod_AnoSemestre])
    if(resultado.length > 0){
        return res.status(400).json({ error: 'Esse ano e semestre já existe' })
    }
    const query = `UPDATE anosemestre SET Ano = ?, Semestre = ? WHERE Cod_AnoSemestre = ?`
    const values = [Ano,Semestre,Cod_AnoSemestre]
    pool.query(query,values,(err)=>{
        if(err){
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        }
        return res.status(200).json({message: 'AnoSemestre atualizado com sucesso'})
    })

})

//FUNCIONA
router.delete('/deleteAnoSemestre',(req,res)=>{
    const {Cod_AnoSemestre} = req.body
    const query = `DELETE FROM anosemestre WHERE Cod_AnoSemestre = ?`
    const values = [Cod_AnoSemestre]
    pool.query(query,values, (err)=>{
        if(err){
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        }else{
            return res.status(200).json({message: 'AnoSemestre eliminado com sucesso'})
        }
    })
})



module.exports = router