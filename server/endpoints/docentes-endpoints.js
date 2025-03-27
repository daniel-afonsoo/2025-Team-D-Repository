const express = require('express')
const router = express.Router()
const pool = require('../db/connection.js')

router.get('/getDocente',(req,res)=>{
    const query = "SELECT * FROM docente"
    pool.query(query, (err,results)=>{
        if(err){
            console.error("Erro na consulta à base de dados:",err)
            return res.status(500).json({error:"Consulta à base de dados falhou"})
        }else{
            res.json(results)
        }
    })
})

router.post('/createDocente',(req,res)=>{
    const {nome,email,password} = req.body
    const query = `INSERT INTO docente (Nome,Email,Password) VALUES (?,?,?)`
    const values = [nome,email,password]
    pool.query(query,values,(err,result) => {
        if(err) {
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        }
        return res.status(200).json({message: 'Docente criado com sucesso'})
    }
    )
})

router.post('/updateDocente',(req,res)=>{
    const {id,nome,email,password} = req.body
    const query = `PUT INTO docente (Nome,Email,Password) VALUES (?,?,?) Where id = ?`
    const values = [nome,email,password,id]
    pool.query(query,values,(err,result)=>{
        if(err){
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
            res.json({message: 'Docente atualizado com sucesso'})
        }
    })

})

router.post('/deleteDocente',(req,res)=>{
    const {id} = req.body
    const query = `DELETE FROM docente WHERE id = ?`
    const values = [id]
    pool.query(query,values, (err,result)=>{
        if(err){
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
            res.json({message: 'Docente eliminado com sucesso'})
        }
    })
})

module.exports = router