import { Request, Response } from 'express';
import { splitPDF } from '../services/codeSplit';
import fs from 'fs';
import path from 'path';

/**
 * Handles the request to split a PDF into a specified number of parts.
 */
// server/src/controllers/splitControllers.ts
export const splitPDFController = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    console.log('Received file' , file?.originalname);

    if (!file || !file.path) {
      res.status(400).json({ message: 'No file received' });
      console.error('No file received');
      return;
    }

    // Read the file from disk and convert it to a buffer
    const filePath = file.path;
    const fileBuffer = fs.readFileSync(filePath);

    if (!fileBuffer) {
      res.status(400).json({ message: 'Failed to read the file from disk' });
      return;
    }

    // Get the number of parts (default to 1 if not provided)
    const numParts = parseInt(req.body.numFiles, 10) || 1;

    // Call the splitPDF function with the buffer
    const splitFiles = await splitPDF(fileBuffer, numParts);

    // Respond with the split files' paths (or URLs) to download
    res.status(200).json({
      message: 'PDF split successful',
      files: splitFiles,
    });
    console.log('PDF split successful');
  } catch (error) {
    console.error('Split Error:', error);
    res.status(500).json({ message: error || 'Failed to split PDF' });
};
}


export const downloadSplitPDF = (req: Request, res: Response) => {
  const { fileName } = req.params;
  const filePath = path.join(process.cwd(), 'src', 'uploads', 'splitted', fileName);
  console.log('File path:', filePath); // Log the file path for debugging
  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).json({ message: 'File download failed' });
    }
  });
}
