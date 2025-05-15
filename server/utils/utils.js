
function formatAulaRow(row) {
    return {
        Cod_Aula: row.Cod_Aula,
        day: row.Dia,
        start: row.Inicio,
        end: row.Fim,
        subject: row.Cod_Uc,
        location: row.Cod_Sala,
        duration: row.Duration
    };
}

module.exports = {
    formatAulaRow
};