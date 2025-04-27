import express, { Request, Response } from 'express';
import { generateReport } from '../controllers/reportController';
import { mergeFiles } from '../controllers/UploadControllers';
import { splitPDFController  , downloadSplitPDF} from '../controllers/splitControllers';
import upload  from '../middleware/upload';

const router = express.Router();


router.post('/generate', async (req: Request, res: Response) => {
  try {
    await generateReport(req, res);  // Calling the async function properly
  } catch (error) {
    console.error("Error handling /generate route:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/download/:fileName', (req: Request, res: Response) => {
  const { fileName } = req.params;
  const filePath = `./src/reports/${fileName}`; // Adjust the path as necessary
  
  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).json({ message: 'File download failed' });
    }
  });
});

// router.get('/preview/:fileName', (req: Request, res: Response) => {
//   const { fileName } = req.params;
//   const filePath = `./src/reports/${fileName}`;  // Path to the file
  
//   res.sendFile(filePath, (err) => {
//     if (err) {
//       console.error("Error serving preview:", err);
//       res.status(500).json({ message: 'Error previewing file' });
//     }
//   });
// });

router.post("/merge-files", upload.array("files"), mergeFiles);
router.post("/split-pdf", upload.single("pdfFile"),  splitPDFController);
router.get('/download/split/:fileName', downloadSplitPDF);

export default router;
