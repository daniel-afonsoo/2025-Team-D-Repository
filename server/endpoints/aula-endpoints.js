const express = require('express')
const router = express.Router()
const pool = require('../db/connection.js')
const { getSocketIOInstance } = require("../utils/socketInstance");

//FUNCIONA
router.get('/aulas', (req, res) => {
    const filters = [];
    const values = [];

    if (req.query.escola && req.query.escola !== "") {
        filters.push('Cod_Escola = ?');
        values.push(Number(req.query.escola));
    }
    if (req.query.docente && req.query.docente !== "") {
        filters.push('Cod_Docente = ?');
        values.push(Number(req.query.docente));
    }
    if (req.query.sala && req.query.sala !== "") {
        filters.push('Cod_Sala = ?');
        values.push(Number(req.query.sala));
    }
    if (req.query.turma && req.query.turma !== "") {
        filters.push('Cod_Turma = ?');
        values.push(Number(req.query.turma));
    }
    if (req.query.uc && req.query.uc !== "") {
        filters.push('Cod_Uc = ?');
        values.push(Number(req.query.uc));
    }
    if (req.query.curso && req.query.curso !== "") {
        filters.push('Cod_Curso = ?');
        values.push(Number(req.query.curso));
    }
    if (req.query.ano && req.query.ano !== "") {
        filters.push('Cod_AnoSemestre = ?');
        values.push(Number(req.query.ano));
    }

    if (filters.length === 0) {
        return res.json([]);
    }

    let query = "SELECT * FROM aula WHERE " + filters.join(" AND ");

    pool.query(query, values, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(rows);
    });
});

//getaulas por CodTurma
router.get('/aulas/turma/:Cod_Turma', (req, res) => {
    const Cod_Turma = req.params.Cod_Turma;

    if (!Cod_Turma) {
        return res.status(400).json({ error: 'Cod_Turma é obrigatório' });
    }

    const query = `SELECT * FROM aula WHERE Cod_Turma = ?`;
    pool.query(query, [Cod_Turma], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(rows);
    });
});

//getaulas por CodDocente e CodAnoSemestre
router.get('/aulas/docente/:Cod_Docente/ano/:Cod_AnoSemestre', (req, res) => {
    const Cod_Docente = req.params.Cod_Docente;
    const Cod_AnoSemestre = req.params.Cod_AnoSemestre;

    if (!Cod_Docente || !Cod_AnoSemestre) {
        return res.status(400).json({ error: 'Cod_Docente e Cod_AnoSemestre são obrigatórios' });
    }

    const query = `SELECT * FROM aula WHERE Cod_Docente = ? AND Cod_AnoSemestre = ?`;
    pool.query(query, [Cod_Docente, Cod_AnoSemestre], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(rows);
    });
});

//getaulas codsala e CodAnoSemestre
router.get('/aulas/sala/:Cod_Sala/ano/:Cod_AnoSemestre', (req, res) => {
    const Cod_Sala = req.params.Cod_Sala;
    const Cod_AnoSemestre = req.params.Cod_AnoSemestre;

    if (!Cod_Sala || !Cod_AnoSemestre) {
        return res.status(400).json({ error: 'Cod_Sala e Cod_AnoSemestre são obrigatórios' });
    }

    const query = `SELECT * FROM aula WHERE Cod_Sala = ? AND Cod_AnoSemestre = ?`;
    pool.query(query, [Cod_Sala, Cod_AnoSemestre], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(rows);
    });
});

//FUNCIONA
router.post('/createAula', async (req, res) => {
    const { Cod_Docente, Cod_Sala, Cod_Turma, Cod_Uc, Cod_Curso, Cod_AnoSemestre, Dia, Inicio, Fim, Duration } = req.body;
    console.log("REQ BODY RECEBIDO:", req.body);

    const checkQuery = `
      SELECT Cod_Aula FROM aula
      WHERE Cod_AnoSemestre = ?
        AND Dia = ?
        AND (
          (Inicio < ? AND Fim > ?) -- sobreposição
        )
        AND (
          Cod_Docente = ? OR
          Cod_Sala = ? OR
          Cod_Turma = ?
        )
    `;

    const checkValues = [Cod_AnoSemestre, Dia, Fim, Inicio, Cod_Docente, Cod_Sala, Cod_Turma];

    pool.query(checkQuery, checkValues, (err, results) => {
        if (err) {
            console.error("Erro na verificação de conflitos:", err);
            return res.status(500).json({ error: 'Erro ao verificar conflitos' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'Conflito de horário detectado (docente, sala ou turma)' });
        }

        // Sem conflitos, podemos inserir
        const insertQuery = `
          INSERT INTO aula (Cod_Docente, Cod_Sala, Cod_Turma, Cod_Uc, Cod_Curso, Cod_AnoSemestre, Dia, Inicio, Fim, Duration)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const insertValues = [Cod_Docente, Cod_Sala, Cod_Turma, Cod_Uc, Cod_Curso, Cod_AnoSemestre, Dia, Inicio, Fim, Duration];

        pool.query(insertQuery, insertValues, (insertErr) => {
            if (insertErr) {
                console.error(insertErr);
                return res.status(500).json({ error: 'Erro ao criar aula' });
            }

            const io = getSocketIOInstance();
            if (io) {
                io.emit("update-aulas", { Cod_Turma });
            }
            return res.status(200).json({ message: 'Aula criada com sucesso' });
        });
    });
});


router.post('/updateAula', async (req, res) => {
  const {
    Cod_Aula, Cod_Docente, Cod_Sala, Cod_Turma,
    Cod_Uc, Cod_Curso, Cod_AnoSemestre, Dia,
    Inicio, Fim, Duration
  } = req.body;

  console.log("🧾 RECEBIDO EM /updateAula:", req.body);

  if (!Cod_Aula || !Cod_Docente || !Cod_Sala || !Cod_Turma || !Cod_Uc || !Cod_Curso || !Cod_AnoSemestre || !Dia || !Inicio || !Fim || Duration == null) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const conflictQuery = `
      SELECT Cod_Aula FROM aula
      WHERE Cod_AnoSemestre = ?
        AND Dia = ?
        AND Cod_Aula != ? -- exclui a própria aula
        AND (
          (Inicio < ? AND Fim > ?) -- sobreposição de tempo
        )
        AND (
          Cod_Docente = ? OR
          Cod_Sala = ? OR
          Cod_Turma = ?
        )
    `;

    const conflictValues = [
      Cod_AnoSemestre, Dia, Cod_Aula,
      Fim, Inicio,
      Cod_Docente, Cod_Sala, Cod_Turma
    ];

    const [conflicts] = await pool.promise().query(conflictQuery, conflictValues);

    if (conflicts.length > 0) {
      return res.status(400).json({ error: 'Conflito de horário detectado (docente, sala ou turma)' });
    }

    const updateQuery = `
      UPDATE aula SET
        Cod_Docente = ?, Cod_Sala = ?, Cod_Turma = ?, Cod_Uc = ?, Cod_Curso = ?,
        Cod_AnoSemestre = ?, Dia = ?, Inicio = ?, Fim = ?, Duration = ?
      WHERE Cod_Aula = ?
    `;

    const updateValues = [
      Cod_Docente, Cod_Sala, Cod_Turma, Cod_Uc, Cod_Curso,
      Cod_AnoSemestre, Dia, Inicio, Fim, Duration,
      Cod_Aula
    ];

    const [result] = await pool.promise().query(updateQuery, updateValues);

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