// src/models/report.model.ts

// Structure for the input report data
export interface ReportInput {
    date: string;          // Date of the report (e.g., "2025-04-05")
    items: ReportItem[];   // List of items in the report
  }
  
  export interface ReportItem {
    task: string;         // Task description
    time: string;         // Time spent on the task in hours
    notes: string;        // Additional notes for the task
  
  } 
  
  // Structure for generated report metadata
  export interface GeneratedReport {
    format: 'pdf' | 'word' | 'excel';  // The format of the generated report
    filePath: string;                  // Path to the generated file
    fileName: string;                  // Name of the generated file
    generatedAt: string;               // Timestamp of when the report was generated
  }
  