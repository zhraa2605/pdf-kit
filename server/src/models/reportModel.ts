// src/models/report.model.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IReportMetadata extends Document {
  format: 'pdf' | 'word' | 'excel';
  filePath: string;
  fileName: string;
  generatedAt: string;
  reportData: {
    date: string;
    items: { task: string; time: number; notes: string }[];
  };
}

const ReportMetadataSchema: Schema = new Schema({
  format: { type: String, required: true, enum: ['pdf', 'word', 'excel'] },
  filePath: { type: String, required: true },
  fileName: { type: String, required: true },
  generatedAt: { type: String, required: true },
  reportData: {
    date: { type: String, required: true },
    items: [
      {
        task: { type: String, required: true },
        time: { type: String, required: true },
        notes: { type: String, required: true },
      },
    
    ]
  }
});

const ReportMetadata = mongoose.model<IReportMetadata>('ReportMetadata', ReportMetadataSchema);
export default ReportMetadata;
