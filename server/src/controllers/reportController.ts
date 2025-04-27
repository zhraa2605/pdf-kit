import { Request, Response } from 'express';
import { generatePDFReport } from '../services/PdfService';
import { generateWordReport } from '../services/WordService';
import { generateExcelReport } from '../services/ExcelService';
import ReportMetadata from '../models/reportModel';

export const generateReport = async (req: Request, res: Response): Promise<Response> => {
  const { format, reportData } = req.body;

  try {
    let generatedReport;

    // Generate the appropriate report based on the requested format
    if (format === 'pdf') {
      generatedReport = await generatePDFReport(reportData);
    } else if (format === 'word') {
      generatedReport = await generateWordReport(reportData);
    } else if (format === 'excel') {
      generatedReport = await generateExcelReport(reportData);
    } else {
      return res.status(400).json({ message: 'Invalid format' });
    }

    // Save report metadata to MongoDB
    const reportMetadata = new ReportMetadata({
      format,
      filePath: generatedReport.filePath,
      fileName: generatedReport.fileName,
      generatedAt: generatedReport.generatedAt,
      reportData,
    });

    await reportMetadata.save();

    return res.status(201).json({ message: 'Report generated successfully', report: generatedReport });
  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({ message: 'Error generating report' });
  }
};
