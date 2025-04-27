import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { ReportInput, GeneratedReport } from "../models/reportStructure";
import dayjs from "dayjs";

export const generatePDFReport = async (
  reportData: ReportInput
): Promise<GeneratedReport> => {
  const { date, items } = reportData;
  const formattedDate = dayjs().format('dddd, MMMM D, YYYY'); // Example: "Sunday, April 7, 2025"
  

  const doc = new PDFDocument();
  const fileName = `report_${formattedDate}.pdf`;
  const filePath = path.join(__dirname, "../../src/reports", fileName);

  doc.pipe(fs.createWriteStream(filePath));

  // Title of the report
  doc.fontSize(20).text("Report", { align: "center" });
  doc.moveDown();

  // Table Header
  const tableHeaders = ["#", "Task", "Time (hours)", "Notes"];
  const columnWidth = [50, 150, 100, 150]; // Adjust column widths as necessary
  let yPosition = doc.y; // Store the current y position to keep it consistent across columns

  // Draw Table Headers
  tableHeaders.forEach((header, index) => {
    doc.fontSize(12).text(header, 50 + columnWidth.slice(0, index).reduce((acc, width) => acc + width, 0), yPosition, {
      width: columnWidth[index],
      align: "center",
    });
  });
  doc.moveDown();

  // Draw a line under the header row
  doc
    .moveTo(50, doc.y)
    .lineTo(
      50 + columnWidth.reduce((acc, width) => acc + width, 0),
      doc.y
    )
    .stroke();

  doc.moveDown(2); // Move down for the next row

  // Table Data with auto-incremented Serial number
  items.forEach((item, index) => {
    yPosition = doc.y; // Reset y position for each row

    // Serial column (auto-incremented number)
    doc.fontSize(10).text((index + 1).toString(), 50, yPosition, {
      width: columnWidth[0],
      align: "center",
    });
    
    // Task column
    doc.text(item.task, 50 + columnWidth[0], yPosition, {
      width: columnWidth[1],
      align: "center",
    });

    // Time column
    doc.text(item.time.toString(), 50 + columnWidth[0] + columnWidth[1], yPosition, {
      width: columnWidth[2],
      align: "center",
    });

    // Notes column
    doc.text(item.notes.toString(), 50 + columnWidth[0] + columnWidth[1] + columnWidth[2], yPosition, {
      width: columnWidth[3],
      align: "center",
    });

    doc.moveDown(); // Move to the next row
  });

  // End of the document
  doc.end();

  return {
    format: "pdf",
    filePath,
    fileName,
    generatedAt: new Date().toISOString(),
  };
};
