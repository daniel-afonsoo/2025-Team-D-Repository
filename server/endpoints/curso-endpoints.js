const express = require('express')
const router = express.Router()
const pool = require('../db/connection.js')

//FUNCIONA
router.get('/getCurso',(req,res)=>{
    const query = "SELECT * FROM curso"
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
router.post('/createCurso',async(req,res)=>{
    const {Nome, Abreviacao, Cod_Escola} = req.body
    // Validação dos dados
    if (!Nome || !Abreviacao || !Cod_Escola) {
        return res.status(400).json({ error: 'Nome, abreviação e código da escola são obrigatórios' })
    }
    // Verificar se o curso já existe
    const [resultado] = await pool.promise().query(`SELECT * FROM curso WHERE Nome = ? and Abreviacao = ? and Cod_Escola = ?`,[Nome, Abreviacao, Cod_Escola])
    if(resultado.length > 0){
        return res.status(400).json({ error: 'Esse curso já existe' })
    }
    // Inserir novo curso
    const query = `INSERT INTO curso (Nome, Abreviacao, Cod_Escola) VALUES (?,?,?)`
    const values = [Nome, Abreviacao, Cod_Escola]
    pool.query(query,values,(err) => {
        if(err) {
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        }
        return res.status(200).json({message: 'Curso criado com sucesso'})
    })
})


//FUNCIONA
router.post('/updateCurso', async(req,res)=>{
    const {Nome, Abreviacao, Cod_Escola, Cod_Curso} = req.body
    // Validação dos dados
    if (!Nome || !Abreviacao || !Cod_Escola || !Cod_Curso) {
        return res.status(400).json({ error: 'Nome, abreviação, código da escola e código do curso são obrigatórios' })
    }
    // Verificar se o curso já existe
    const [resultado] = await pool.promise().query(`SELECT * FROM curso WHERE Nome = ? and Abreviacao = ? and Cod_Escola = ? and Cod_Curso = ?`,[Nome, Abreviacao, Cod_Escola, Cod_Curso])
    if(resultado.length > 0){
        return res.status(400).json({ error: 'Esse curso já existe' })
    }
    // Atualizar curso
    const query = `UPDATE curso SET Nome = ?, Abreviacao = ?, Cod_Escola = ? WHERE Cod_Curso = ?`
    const values = [Nome, Abreviacao, Cod_Escola, Cod_Curso]
    pool.query(query,values,(err)=>{
        if(err){
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        }
        return res.status(200).json({message: 'Curso atualizado com sucesso'})
    })
})


//FUNCIONA
router.delete('/deleteCurso', async(req,res)=>{
    const {Cod_Curso} = req.body
    // Validação dos dados
    if (!cod_curso) {
        return res.status(400).json({ error: 'Código do curso é obrigatório' })
    }
    // Verificar se o curso existe
    const [resultado] = await pool.promise().query(`SELECT * FROM curso WHERE Cod_Curso = ?`,[Cod_Curso])
    if(resultado.length === 0){
        return res.status(400).json({ error: 'Esse curso não existe' })
    }
    
    //query para remover o curso
    const query = `DELETE FROM curso WHERE Cod_Curso = ?`
    const values = [Cod_Curso]
    pool.query(query,values,(err)=>{
        if(err){
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        }
        return res.status(200).json({message: 'Curso removido com sucesso'})
    })
})






module.exports = router