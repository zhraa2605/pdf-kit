import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
import fs from 'fs';
import path from 'path';
import { ReportInput, GeneratedReport } from '../models/reportStructure';
import dayjs from 'dayjs';

export const generateWordReport = async (reportData: ReportInput): Promise<GeneratedReport> => {
  const { date, items } = reportData;

  const fontSettings = {
    font: 'Calibri',
    size: 28, // Word uses half-points: 28 = 14pt
  };
  const formattedDate = dayjs().format('dddd, MMMM D, YYYY'); // Example: "Sunday, April 7, 2025"


  const tableRows = [
    // Header row
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'S.No', bold: true, ...fontSettings })], alignment: AlignmentType.CENTER
            }),
          ],
          shading: { fill: 'C0C0C0' }
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Task', bold: true, ...fontSettings })], alignment: AlignmentType.CENTER
            }),
          ],
          shading: { fill: 'C0C0C0' }
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Time (hrs)', bold: true, ...fontSettings })], alignment: AlignmentType.CENTER
            }),
          ],
          shading: { fill: 'C0C0C0' }
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Notes', bold: true, ...fontSettings })], alignment: AlignmentType.CENTER
            }),
          ],
          shading: { fill: 'C0C0C0' }
        }),
      ],
    }),

    // Item rows with auto-incrementing index
    ...items.map((item, index) =>
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: (index + 1).toString(), ...fontSettings })], alignment: AlignmentType.CENTER
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: item.task, ...fontSettings })], alignment: AlignmentType.CENTER
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: item.time.toString(), ...fontSettings })], alignment: AlignmentType.CENTER
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: item.notes, ...fontSettings })], alignment: AlignmentType.CENTER
              }),
            ],
          }),
        ],
      })
    ),
  ];

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `Report for ${formattedDate}`,
                bold: true,
                size: 28,
                font: 'Calibri',
              }),
            ],
            spacing: { after: 400 },
            alignment: AlignmentType.CENTER,
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  
  const fileName = `report_${formattedDate}.docx`.replace(/ /g, '_'); // Replacing spaces with underscores for valid filename

  const filePath = path.join(__dirname, '../../src/reports', fileName);

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);

  return {
    format: 'word',
    filePath,
    fileName,
    generatedAt: new Date().toISOString(),
  };
};
