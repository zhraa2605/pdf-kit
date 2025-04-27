import { Request, Response, NextFunction } from "express";
import { mergePDFs } from "../services/fileMerge"; // Importing file merge functions
import fs from "fs"; // Import fs module
import path from "path"; // Import path module


const mergeFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files?.length) {
      res.status(400).json({ message: "No files uploaded" });
      return;
    }

    const filePaths = files.map(file => {
      console.log("Raw file path:", file.path);
      if (!fs.existsSync(file.path)) {
        throw new Error(`File missing: ${file.path}`);
      }
      return file.path;
    });

    const mergedFilePath = await mergePDFs(filePaths);

    if (!fs.existsSync(mergedFilePath)) {
      throw new Error("Merged file creation failed");
    }

    // Stream file to client
    res.download(mergedFilePath, "merged-report.pdf", (err) => {
      if (err) {
        console.error("Download error:", err);
        if (!res.headersSent) {
          return res.status(500).json({ message: "File download failed" });
        }
      }

      // Delete original uploaded files
      try {
        filePaths.forEach(p => fs.existsSync(p) && fs.unlinkSync(p));
        // Delete merged file after 5 mins
        setTimeout(() => {
          if (fs.existsSync(mergedFilePath)) {
            fs.unlinkSync(mergedFilePath);
          }
        }, 300000);
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }
    });

  } catch (error) {
    console.error("Merge error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Merge failed",
      details: error instanceof Error ? error.stack : undefined,
    });
  }
};

export { mergeFiles };