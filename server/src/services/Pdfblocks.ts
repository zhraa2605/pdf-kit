import puppeteer, { Browser } from 'puppeteer';
import { generateHtmlFromBlocks } from '../utils/generateHtmlFromBlocks';
import { PdfContent } from '../models/BdfTypes';

export const generatePdfFromBlocks = async (blocks: PdfContent): Promise<Buffer> => {
  let html: string;
  try {
    html = generateHtmlFromBlocks(blocks);
  } catch (err) {
    console.error('HTML generation error:', err);
    throw new Error('Failed to generate HTML from blocks');
  }

    let browser: Browser | undefined;

  try {
    browser = await puppeteer.launch({
        headless: true,

      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    
    // Set a viewport to ensure consistent rendering
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 1 });
    
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000 // 30 seconds timeout
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm',
      },
      timeout: 30000 // 30 seconds timeout
    });

return Buffer.from(pdfBuffer);  // Convert Uint8Array to Buffer
  } catch (err) {
    console.error('PDF generation error:', err);
    throw new Error(`PDF generation failed: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
  }
};