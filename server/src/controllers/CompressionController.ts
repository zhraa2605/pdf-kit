import { compressPDF } from './../services/CompressPDF';
import { Request, Response } from 'express';
import path from 'path';

export const compressPdfController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // Get compression options from request body with defaults
    const { quality = 0.7, maxWidth = 1200, maxHeight = 1200 } = req.body;

    // Compress the PDF
    const compressionResult = await compressPDF(req.file.buffer, {
      quality: parseFloat(quality),
      maxWidth: parseInt(maxWidth),
      maxHeight: parseInt(maxHeight),
    });

    // Set headers for download
    const filename = path.basename(compressionResult.filePath);
    // Send the file for download
    res.download(compressionResult.filePath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Failed to download compressed PDF' });
      }
      
      // Optionally delete the file after download completes
      // fs.unlinkSync(compressionResult.filePath);
    });

  } catch (error) {
    console.error('Compression error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to compress PDF' 
    });
  }
};