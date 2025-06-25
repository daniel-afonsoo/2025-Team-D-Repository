const express = require('express')
const router = express.Router()
const pool = require('../db/connection.js')

//FUNCIONA
router.get('/getUC',(req,res)=>{
    const query = "SELECT * FROM uc"
    pool.query(query, (err,results)=>{
        if(err){
            console.error("Erro na consulta à base de dados:",err)
            return res.status(500).json({error:"Consulta à base de dados falhou"})
        }else{
            res.status(200).json(results)
        }
    })
})

router.get('/getUC/:Cod_Uc', (req, res) => {
  const { Cod_Uc } = req.params;

  if (!Cod_Uc) {
    return res.status(400).json({ error: "Cod_Uc é obrigatório" });
  }

  const query = "SELECT * FROM uc WHERE Cod_Uc = ?";
  pool.query(query, [Cod_Uc], (err, results) => {
    if (err) {
      console.error("Erro na consulta à base de dados:", err);
      return res.status(500).json({ error: "Consulta à base de dados falhou" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "UC não encontrada" });
    }

    res.status(200).json(results[0]);
  });
});



//FUNCIONA
router.post('/createUC',async(req,res)=>{
    const {Nome, Cod_Curso} = req.body
    // Validação dos dados
    if (!Nome || !Cod_Curso) {
        return res.status(400).json({ error: 'Nome, horas e código do curso são obrigatórios' })
    }
    // Verificar se a UC já existe
    const [resultado] = await pool.promise().query(`SELECT * FROM uc WHERE Nome = ? and Cod_Curso = ?`,[Nome, Cod_Curso])
    if(resultado.length > 0){
        return res.status(400).json({ error: 'Essa UC já existe' })
    }
    // Inserir nova UC
    const query = `INSERT INTO uc (Nome, Cod_Curso) VALUES (?,?)`
    const values = [Nome, Cod_Curso]
    pool.query(query,values,(err) => {
        if(err) {
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        }
        return res.status(200).json({message: 'UC criada com sucesso'})
    })
})


//FUNCIONA
router.post('/updateUC', async(req,res)=>{
    const {Nome, Cod_Curso, Cod_Uc} = req.body
    // Validação dos dados
    if (!Nome || !Cod_Curso || !Cod_Uc) {
        return res.status(400).json({ error: 'Nome, código do curso e código da UC são obrigatórios' })
    }
    // Verificar se já existe outra UC com o mesmo nome e curso (mas diferente Cod_Uc)
    const [resultado] = await pool.promise().query(
        `SELECT * FROM uc WHERE Nome = ? and Cod_Curso = ? and Cod_Uc != ?`,
        [Nome, Cod_Curso, Cod_Uc]
    )
    if(resultado.length > 0){
        return res.status(400).json({ error: 'Já existe uma UC com esse nome e curso' })
    }
    // Atualizar UC
    const query = `UPDATE uc SET Nome = ?, Cod_Curso = ? WHERE Cod_Uc = ?`
    const values = [Nome, Cod_Curso, Cod_Uc]
    pool.query(query,values,(err)=>{
        if(err){
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        }
        return res.status(200).json({message: 'UC atualizada com sucesso'})
    })
})


//FUNCIONA
router.delete('/deleteUC', async(req,res)=>{
    const {Cod_Uc} = req.body
    // Validação dos dados
    if (!Cod_Uc) {
        return res.status(400).json({ error: 'Código da UC é obrigatório' })
    }
    // Verificar se a UC existe
    const [resultado] = await pool.promise().query(`SELECT * FROM uc WHERE Cod_Uc = ?`,[Cod_Uc])
    if(resultado.length === 0){
        return res.status(400).json({ error: 'Essa UC não existe' })
    }

    // Remover UC
    const query = `DELETE FROM uc WHERE Cod_Uc = ?`
    const values = [Cod_Uc]
    pool.query(query,values,(err)=>{
        if(err){
            console.error(err)
            return res.status(500).json({error: 'Internal server error, provavelmente a UC é referenciada em outra tabela'})
        }
        return res.status(200).json({message: 'UC removida com sucesso'})
    })
})


module.exports = router