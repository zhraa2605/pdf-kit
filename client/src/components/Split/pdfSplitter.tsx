import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { uploadAndSplitPdf, downloadSplitFile } from "../../utils/SplitUtils";
import { FileUploadInput } from "./FileUpload";
import { NumberInput } from "./NumberInput";
import { SplitFilesList } from "./SplitFilesList";

const PdfSplitter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [numFiles, setNumFiles] = useState(1);
  const [splitFiles, setSplitFiles] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleNumFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) setNumFiles(value);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await uploadAndSplitPdf(
        selectedFile,
        numFiles,
        setSplitFiles,
        setLoading
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
        Upload a PDF to Split
      </h2>

      <FileUploadInput handleFileChange={handleFileChange} />
      <NumberInput value={numFiles} onChange={handleNumFilesChange} />

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 ${
          loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Splitting PDF..." : "Split PDF"}
      </button>

      <SplitFilesList files={splitFiles} onDownload={downloadSplitFile} />
    </div>
  );
};

export default PdfSplitter;