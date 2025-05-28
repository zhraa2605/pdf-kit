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

  

    // Define the output directory for split files

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
      splitFiles.push(`part-${partIndex + 1}.pdf`);

      
    }

    return splitFiles;
  } catch (error) {
    console.error('Error during PDF splitting:', error);
    throw new Error('Failed to split PDF');
  }
};
