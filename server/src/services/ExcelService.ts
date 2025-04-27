// src/services/excel.service.ts
import ExcelJS from 'exceljs';
import path from 'path';
import { ReportInput, GeneratedReport } from '../models/reportStructure';

export const generateExcelReport = async (reportData: ReportInput): Promise<GeneratedReport> => {
  const { date, items } = reportData;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');

  worksheet.columns = [
    { header: 'تسلسل', key: 'serial', width: 10 },
    { header: 'Task', key: 'task', width: 30 },
    { header: 'Time (hours)', key: 'time', width: 15 },
    { header: 'Notes', key: 'notes', width: 50 },

  ];

  items.forEach((item, index) => {
    // Add the serial number based on the index (index + 1 for 1-based counting)
    worksheet.addRow({
      serial: index + 1,  // Auto-increment serial number starting from 1
      task: item.task,
      time: item.time,
      notes: item.notes,
    });
  });


  const fileName = `report_${date}.xlsx`;
  const filePath = path.join(__dirname, '../../src/reports', fileName);

  await workbook.xlsx.writeFile(filePath);

  return {
    format: 'excel',
    filePath,
    fileName,
    generatedAt: new Date().toISOString(),
  };
};
