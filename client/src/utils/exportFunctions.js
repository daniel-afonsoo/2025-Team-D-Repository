import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import ExcelJS from "exceljs";


// Dias da semana
const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
// Gera intervalos de 08:00 a 23:30 (31 blocos de 30min)
const horas = Array.from({ length: 31 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  const start = `${hour.toString().padStart(2, "0")}:${minutes}`;
  const endHour = minutes === "30" ? hour + 1 : hour;
  const endMinutes = minutes === "30" ? "00" : "30";
  const end = `${endHour.toString().padStart(2, "0")}:${endMinutes}`;
  return `${start} - ${end}`;
});

//////////// exportar para PDF ////////////
export const exportToPdf = (aulas) => {
    const doc = new jsPDF();
    const head = [['Horas', ...diasSemana]];
    const body = [];
    const skip = Array(diasSemana.length).fill(0);

    horas.forEach((hora, index) => {
        const [start] = hora.split(' - ');
        const row = [hora];

        diasSemana.forEach((dia, di) => {
            if (skip[di] > 0) {
                skip[di]--; // Ignora células mescladas
                return;
            }

            const aula = aulas.find(a =>
                a.day === dia &&
                horas.findIndex(h => h.startsWith(a.start)) === index
            );

            if (aula) {
                const duracaoBlocos = aula.duration / 30;
                row.push({
                    content: `${aula.subject}\n${aula.location}`,
                    rowSpan: duracaoBlocos,
                    styles: {
                        fillColor: '#007bff',
                        textColor: '#ffffff',
                        fontStyle: 'bold',
                        fontSize: duracaoBlocos === 1 ? 7 : 8,
                        cellPadding: duracaoBlocos === 1 ? 3 : 4.2,
                        lineHeight: 1.2,
                        minCellHeight: duracaoBlocos === 1 ? 3 : 7, // Tamanho menor para aulas de 30 minutos
                        halign: 'center',
                        valign: 'middle'
                    }
                });
                skip[di] = duracaoBlocos - 1;
            } else {
                // Células vazias como slots individuais
                row.push({
                    content: '',
                    styles: {
                        fillColor: false, // Sem cor
                        lineColor: [0, 0, 0], // Borda preta
                        lineWidth: 0.1
                    }
                });
            }
        });

        body.push(row);
    });

    autoTable(doc, {
        head,
        body,
        theme: 'grid',
        styles: {
            fontSize: 8,
            cellPadding: 2,
            lineColor: [0, 0, 0], // Bordas pretas para todas as células
            lineWidth: 0.1
        },
        margin: { top: 20 },
        didParseCell: (data) => {
            if (data.row.index > 0) {
                if (data.cell.raw.rowSpan) {
                    data.cell.rowSpan = data.cell.raw.rowSpan;
                    data.cell.content = data.cell.raw.content;
                    data.cell.styles = data.cell.raw.styles;
                }
                // Força bordas em todas as células
                data.cell.styles.lineColor = [0, 0, 0];
                data.cell.styles.lineWidth = 0.1;
            }
        }
    });

    doc.save('horario.pdf');
};

////////// Exportar para Excel //////////
export const exportToExcel = async (aulas) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Horário", {
        properties: { defaultRowHeight: 40 },
        views: [{ showGridLines: true }],
    });

    // 1) Define colunas
    worksheet.columns = [
        { header: "Horas", key: "Horas", width: 20 },
        ...diasSemana.map(dia => ({ header: dia, key: dia, width: 20 }))
    ];

    // 2) Estiliza cabeçalho (borda incluída)
    worksheet.getRow(1).eachCell(cell => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD3D3D3" } };
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // 3) Preenche linhas
    horas.forEach((hora, idx) => {
        const [start] = hora.split(" - ");
        const rowData = { Horas: hora };
        diasSemana.forEach(dia => {
            const aula = aulas.find(a => a.day === dia && a.start === start);
            rowData[dia] = aula ? `${aula.subject}\n${aula.location}` : "";
        });
        worksheet.addRow(rowData);
    });

    // 4) Mescla e estiliza blocos de aula
    horas.forEach((hora, idx) => {
        const [start] = hora.split(" - ");
        diasSemana.forEach((dia, di) => {
            const aula = aulas.find(a => a.day === dia && a.start === start);
            if (!aula) return;
            const blocks = aula.duration / 30;
            const startRow = idx + 2;       // Excel row index (1-based + cabeçalho)
            const col = di + 2;              // coluna (1 = Horas, +1 por ser 1-based)
            const endRow = startRow + blocks - 1;

            // mescla
            worksheet.mergeCells(startRow, col, endRow, col);

            // aplica estilos em todas as células do merge
            for (let r = startRow; r <= endRow; r++) {
                const cell = worksheet.getCell(r, col);
                cell.alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF007BFF" } };
                cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
                worksheet.getRow(r).height = 40;
            }
        });
    });

    // 5) Garante bordas nas células vazias
    worksheet.eachRow(row => {
        row.eachCell(cell => {
            if (!cell.border) {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            }
        });
    });

    // 6) Exporta
    const buf = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "horario.xlsx";
    link.click();
};