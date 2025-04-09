const express = require('express')
const router = express.Router()
const pool = require('../db/connection.js')

router.get('/getAula',(res)=>{
    const query = "SELECT docente.Nome, sala.Nome, Cod_Turma, uc.Nome, curso.Nome, anosemestre.Ano FROM aula inner join docente on aula.Cod_Docente = docente.Cod_Docente inner join sala on aula.Cod_Sala = sala.Cod_Sala inner join turma on aula.Cod_Turma = turma.Cod_Turma inner join uc on aula.Cod_Uc = uc.Cod_Uc inner join curso on aula.Cod_Curso = curso.Cod_Curso inner join anosemestre on aula.Cod_AnoSemestre = anosemestre.Cod_AnoSemestre"
    pool.query(query,(err,rows)=>{
        if(err){
            console.log(err)
            return res.status(500).json({error: 'Internal Server Error'})
        }
        res.json(rows)
    })
})

router.post('/createAula', async (req, res) => {
    const { turma_nome, uc_nome, docente_nome, sala_nome, curso_nome, ano_semestre, semestre_semestre, dia, inicio, fim } = req.body

    try {
        // Encontrar as foreign keys na base de dados
        const [turma] = await pool.promise().query(`SELECT Cod_Turma FROM turma inner join curso on turma.Cod_Curso = curso.Cod_curso inner join anosemestre. WHERE Nome = ?`, [turma_nome])
        const [uc] = await pool.promise().query(`SELECT Cod_Uc FROM uc WHERE Nome = ?`, [uc_nome])
        const [docente] = await pool.promise().query(`SELECT ID FROM docente WHERE Nome = ?`, [docente_nome])
        const [sala] = await pool.promise().query(`SELECT Cod_Sala FROM sala WHERE Nome = ?`, [sala_nome])
        const [curso] = await pool.promise().query(`SELECT Cod_Curso FROM curso WHERE Nome = ?`, [curso_nome])
        const [anoSemestre] = await pool.promise().query(`SELECT Cod_AnoSemestre FROM anosemestre WHERE Ano = ? and Semestre = ?`, [ano_semestre], [semestre_semestre])
        

        // Verificar se todas as foreign keys foram encontradas
        if (!turma.length || !uc.length || !docente.length || !sala.length || !curso.length || !anoSemestre.length) {
            return res.status(400).json({ error: 'Alguma das informações fornecidas não foram encontradas na base de dados' })
        }

        // Obter os valores das foreign keys
        const cod_turma = turma[0].Cod_Turma
        const cod_uc = uc[0].Cod_Uc
        const cod_docente = docente[0].ID
        const cod_sala = sala[0].Cod_Sala
        const cod_curso = curso[0].Cod_Curso
        const cod_anosemestre = anoSemestre[0].Cod_AnoSemestre

        // Executar o INSERT na tabela aula
        const query = `INSERT INTO aula (Cod_Turma, Cod_Uc, ID_Docente, Cod_Sala, Cod_Curso, Cod_AnoSemestre, Dia, Inicio, Fim) VALUES (?,?,?,?,?,?,?,?,?)`
        const values = [cod_turma, cod_uc, cod_docente, cod_sala, cod_curso, cod_anosemestre, dia, inicio, fim]
        await pool.promise().query(query, values)

        return res.status(200).json({ message: 'Aula criada com sucesso' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

router.post('/updateAula',(req,res)=>{  
    const {cod_turma,cod_uc,cod_docente,cod_sala,cod_curso,cod_anosemestre, dia, inicio, fim, id} = req.body
    const query = `UPDATE aula SET Cod_Turma = ?, Cod_Uc = ?, ID_Docente = ?, Cod_Sala = ?, Cod_Curso = ?, Cod_AnoSemestre = ?, Dia = ?, Inicio = ?, Fim = ? WHERE ID = ?`
    const values = [cod_turma, cod_uc, cod_docente, cod_sala, cod_curso, cod_anosemestre, dia, inicio, fim, id]
    pool.query(query,values,(err)=>{
        if(err){
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        }
        else{
            return res.status(200).json({message: 'Aula atualizada com sucesso'})
        }
    })
})

router.post('/deleteAula',(req,res)=>{
    const {id} = req.body
    const query = `DELETE FROM aula where id = ?`
    const values = [id]
    pool.query(query,values,(err)=>{
        if(err){
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        }
        else{
            return res.status(200).json({message: 'Aula eliminada com sucesso'})
        }
    })
})

module.exports = router