import { Request, Response } from 'express';
import { generatePdfFromBlocks } from '../services/Pdfblocks';

export const createPdf = async (req: Request, res: Response) => {
  try {
    const blocks = req.body.blocks;

    if (!Array.isArray(blocks)) {
      return res.status(400).json({ error: 'Blocks must be an array' });
    }

    const pdfBuffer = await generatePdfFromBlocks(blocks);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=generated.pdf',
    });

    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};