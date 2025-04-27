const express = require('express');
import connectDB from './config/db';
const dotenv = require('dotenv');
import reportRoutes from './routes/ReportRoutes'
import multer from 'multer';
import path from 'path';
import fs from 'fs';
connectDB();

dotenv.config();
const app = express();
const cors = require('cors');
// Middleware

app.use(express.json());
app.use(cors());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'src', 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir); // Now using absolute path
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});
// Serve static files (like merged reports)
app.use(express.static("public") );
app.use('/splitted', express.static(path.join(process.cwd(), 'src', 'uploads', 'splitted')));

app.use('/api/reports',reportRoutes );


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  
