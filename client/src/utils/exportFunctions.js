import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import ExcelJS from "exceljs";

// Dias da semana
const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const horas = Array.from({ length: 31 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  const start = `${hour.toString().padStart(2, "0")}:${minutes}`;
  const endHour = minutes === "30" ? hour + 1 : hour;
  const endMinutes = minutes === "30" ? "00" : "30";
  const end = `${endHour.toString().padStart(2, "0")}:${endMinutes}`;
  return `${start} - ${end}`;
});

// Helper to fetch and adapt aulas
async function fetchAulasByTurma(codTurma) {
  const res = await fetch(`/api/aulas/turma/${codTurma}`);
  if (!res.ok) throw new Error("Erro ao buscar aulas da turma");
  const raw = await res.json();

  return raw.map(a => ({
    day: a.Dia,
    start: a.Inicio,
    duration: a.Duration,
    subject: `UC ${a.Cod_Uc}`,
    location: `Sala ${a.Cod_Sala}`
  }));
}

export const exportToPdf = async (codTurma) => {
  console.log("Exportando turma para PDF:", codTurma);
  try {
    const aulas = await fetchAulasByTurma(codTurma);
    const doc = new jsPDF();
    const head = [['Horas', ...diasSemana]];
    const body = [];
    const skip = Array(diasSemana.length).fill(0);

    horas.forEach((hora, index) => {
      const [start] = hora.split(' - ');
      const row = [hora];

      diasSemana.forEach((dia, di) => {
        if (skip[di] > 0) {
          skip[di]--;
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
              minCellHeight: duracaoBlocos === 1 ? 3 : 7,
              halign: 'center',
              valign: 'middle'
            }
          });
          skip[di] = duracaoBlocos - 1;
        } else {
          row.push({
            content: '',
            styles: {
              fillColor: false,
              lineColor: [0, 0, 0],
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
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      margin: { top: 20 },
      didParseCell: (data) => {
        if (data.row.index > 0 && data.cell.raw?.rowSpan) {
          Object.assign(data.cell, {
            rowSpan: data.cell.raw.rowSpan,
            content: data.cell.raw.content,
            styles: data.cell.raw.styles
          });
        }
        data.cell.styles.lineColor = [0, 0, 0];
        data.cell.styles.lineWidth = 0.1;
      }
    });

    doc.save('horario.pdf');
  } catch (error) {
    console.error("Erro na exportação PDF:", error);
    alert("Erro ao exportar para PDF.");
  }
};

export const exportToExcel = async (codTurma) => {
  console.log("Exportando turma para Excel:", codTurma);
  try {
    const aulas = await fetchAulasByTurma(codTurma);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Horário", {
      properties: { defaultRowHeight: 40 },
      views: [{ showGridLines: true }],
    });

    worksheet.columns = [
      { header: "Horas", key: "Horas", width: 20 },
      ...diasSemana.map(dia => ({ header: dia, key: dia, width: 20 }))
    ];

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

    horas.forEach((hora, idx) => {
      const [start] = hora.split(" - ");
      const rowData = { Horas: hora };
      diasSemana.forEach(dia => {
        const aula = aulas.find(a => a.day === dia && a.start === start);
        rowData[dia] = aula ? `${aula.subject}\n${aula.location}` : "";
      });
      worksheet.addRow(rowData);
    });

    horas.forEach((hora, idx) => {
      const [start] = hora.split(" - ");
      diasSemana.forEach((dia, di) => {
        const aula = aulas.find(a => a.day === dia && a.start === start);
        if (!aula) return;
        const blocks = aula.duration / 30;
        const startRow = idx + 2;
        const col = di + 2;
        const endRow = startRow + blocks - 1;

        worksheet.mergeCells(startRow, col, endRow, col);

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

    const buf = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "horario.xlsx";
    link.click();
  } catch (error) {
    console.error("Erro na exportação Excel:", error);
    alert("Erro ao exportar para Excel.");
  }
};
