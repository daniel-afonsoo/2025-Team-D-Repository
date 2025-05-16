const pool = require('../db/connection.js'); 

function formatAulaRow(row) {
    return {
        Cod_Aula: row.Cod_Aula,
        docente : row.Cod_Docente,
        location: row.Cod_Sala,
        turma: row.Cod_Turma,
        subject: row.Cod_Uc,
        course: row.Cod_Curso,
        anoSem: row.Cod_AnoSemestre,
        day: row.Dia,
        start: row.Inicio,
        end: row.Fim,
        duration: row.Duration
    };
}

// Add aula to DB
const addAulaToDB = async (aula) => {
    const query = `
        INSERT INTO aula (
            Cod_Aula, Cod_Docente, Cod_Sala, Cod_Turma, Cod_Uc,
            Cod_Curso, Cod_AnoSemestre, Dia, Inicio, Fim, Duration
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        aula.Cod_Aula, aula.docente, aula.location, aula.turma, aula.subject, aula.course, aula.anoSem, aula.day, aula.start, aula.end, aula.duration
    ];

    await pool.promise().query(query, values);
};

// Remove aula from DB
const removeAulaFromDB = async (codAula) => {
    const query = `DELETE FROM aula WHERE Cod_Aula = ?`;
    await pool.promise().query(query, [codAula]);
};

// Update only day/start time (can be expanded)
const updateAulaInDB = async (codAula, newDay, newStart) => {
    const query = `UPDATE aula SET Dia = ?, Inicio = ? WHERE Cod_Aula = ?`;
    await pool.promise().query(query, [newDay, newStart, codAula]);
};

module.exports = {
    formatAulaRow,
    addAulaToDB,
    removeAulaFromDB,
    updateAulaInDB
};