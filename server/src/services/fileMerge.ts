// src/utils/fileMerge.ts

import path from "path";
import { PDFDocument } from "pdf-lib";
import fs from 'fs';
// Merge PDFs

// takes the mergepdf a filepath
// created new doc
// select output dir
// make sure output dir exists
// loop through each file path
// check if file exists
// read file
// load file into pdf-lib نستخدم PDFDocument.load() لتحميل البيانات.

// copy pages 
// add it to new doc 
// loop through each doc 
// save the new doc
// write it to the output dir
// return the output path
export const mergePDFs = async (filePaths: string[]): Promise<string> => {
  // Create a new PDF document
    const mergedPdf = await PDFDocument.create();
    // Select output directory
    const outputDir = path.join(process.cwd(), "src", "uploads" , "Merged"); // Use absolute path
    
  
    try {
      // Loop through each file path
      for (const filePath of filePaths) {
        console.log(`Processing file: ${filePath}`);
        // Check if the file exists
        if (!fs.existsSync(filePath)) {
          throw new Error(`File not found: ${filePath}`);
        }
        
        // Read the PDF file bytes
        const existingPdfBytes = fs.readFileSync(filePath);
        // Load the PDF document
        const existingPdf = await PDFDocument.load(existingPdfBytes);
        // Copy the pages from the existing PDF to the merged PDF
        const copiedPages = await mergedPdf.copyPages(existingPdf, existingPdf.getPageIndices());
      // Loop through each page in the array
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      // Save the merged PDF document to bytes
      const mergedPdfBytes = await mergedPdf.save();
      // Write the merged PDF bytes to the output directory
      const mergedFilePath = path.join(outputDir, `merged-${Date.now()}.pdf`);

      //write file to output dir
      fs.writeFileSync(mergedFilePath, mergedPdfBytes);
        // Copy the pages from the existing PDF to the merged PDF
      console.log(`File written successfully: ${mergedFilePath}`);
        // Add the copied pages to the merged PDF
      console.log(`File exists: ${fs.existsSync(mergedFilePath)}`);

      // Return the path of the merged PDF file
      return mergedFilePath;
    } catch (error) {
      console.error("Error during PDF merging:", error);
      throw error;
    }
  };
  