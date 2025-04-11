const express = require('express')
const router = express.Router()
const pool = require('../db/connection.js')

//FUNCIONA
router.get('/getAula',(req,res)=>{
    const query = "SELECT * FROM aula"
    pool.query(query,(err,rows)=>{
        if(err){
            console.log(err)
            return res.status(500).json({error: 'Internal Server Error'})
        }
        res.json(rows)
    })
})

//FUNCIONA
router.post('/createAula', async (req, res) => {
    const {Cod_Docente, Cod_Sala, Cod_Turma, Cod_Uc, Cod_Curso, Cod_AnoSemestre, Dia, Inicio, Fim} = req.body
    const query = `INSERT INTO aula (Cod_Docente, Cod_Sala, Cod_Turma, Cod_Uc, Cod_Curso, Cod_AnoSemestre, Dia, Inicio, Fim) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [Cod_Docente, Cod_Sala, Cod_Turma, Cod_Uc, Cod_Curso, Cod_AnoSemestre, Dia, Inicio, Fim]
    pool.query(query, values, (err) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Internal server error' })
        } else {
            return res.status(200).json({ message: 'Aula criada com sucesso' })
        }
    })
})

//FUNCIONA
router.post('/updateAula', async (req, res) => {  
    const { Cod_Docente, Cod_Sala, Cod_Turma, Cod_Uc, Cod_Curso, Cod_AnoSemestre, Dia, Inicio, Fim, Cod_Aula } = req.body;

    // Validação dos campos obrigatórios
    if (!Cod_Aula || !Cod_Docente || !Cod_Sala || !Cod_Turma || !Cod_Uc || !Cod_Curso || !Cod_AnoSemestre || !Dia || !Inicio || !Fim) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        const query = `UPDATE aula SET Cod_Docente = ?, Cod_Sala = ?, Cod_Turma = ?, Cod_Uc = ?, Cod_Curso = ?, Cod_AnoSemestre = ?, Dia = ?, Inicio = ?, Fim = ? WHERE Cod_Aula = ?`;
        const values = [Cod_Docente, Cod_Sala, Cod_Turma, Cod_Uc, Cod_Curso, Cod_AnoSemestre, Dia, Inicio, Fim, Cod_Aula];

        const [result] = await pool.promise().query(query, values);

        // Verificar se a aula foi encontrada e atualizada
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Aula não encontrada' });
        }

        return res.status(200).json({ message: 'Aula atualizada com sucesso' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


//FUNCIONA
router.delete('/deleteAula', async (req, res) => {
    const { Cod_Aula } = req.body;

    if (!Cod_Aula) {
        return res.status(400).json({ error: 'Cod_Aula é obrigatório' });
    }

    try {
        const query = `DELETE FROM aula WHERE Cod_Aula = ?`;
        const values = [Cod_Aula];
        const [result] = await pool.promise().query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Aula não encontrada' });
        }

        return res.status(200).json({ message: 'Aula eliminada com sucesso' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router