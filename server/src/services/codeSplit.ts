// src/services/pdfService.ts
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

/**
 * Splits the given PDF file into the specified number of parts.
 * @param fileBuffer - The buffer of the uploaded PDF file.
 * @param numParts - The number of parts to split the PDF into.
 * @returns The paths to the split PDF files.
 */
export const splitPDF = async (fileBuffer: Buffer, numParts: number): Promise<string[]> => {
  try {
    // Load the PDF from the buffer
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const pageCount = pdfDoc.getPageCount();

    // Calculate number of pages per part
    const pagesPerPart = Math.ceil(pageCount / numParts);

    if (pageCount === 1) {
      throw new Error('PDF has only one page, cannot split further');

    }

    // Check if the number of parts exceeds the number of pages
    if (numParts > pageCount) {
      throw new Error('Number of parts cannot be greater than the number of pages in the PDF');
    }

  

    // Define the output directory for split files
    const outputDir = path.join(process.cwd(), 'src', 'uploads', 'splitted');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const splitFiles: string[] = [];

    // Split the PDF into the desired number of parts
    for (let partIndex = 0; partIndex < numParts; partIndex++) {
      const newPdf = await PDFDocument.create();
      const startPage = partIndex * pagesPerPart;
      const endPage = Math.min(startPage + pagesPerPart, pageCount);

      // Copy the pages for this part
      const copiedPages = await newPdf.copyPages(pdfDoc, Array.from({ length: endPage - startPage }, (_, i) => i + startPage));
      copiedPages.forEach((page) => newPdf.addPage(page));

      const newPdfBytes = await newPdf.save();
      const outputPath = path.join(outputDir, `part-${partIndex + 1}.pdf`);
      fs.writeFileSync(outputPath, newPdfBytes);
      splitFiles.push(`part-${partIndex + 1}.pdf`);

      
    }

    return splitFiles;
  } catch (error) {
    console.error('Error during PDF splitting:', error);
    throw new Error('Failed to split PDF');
  }
};
