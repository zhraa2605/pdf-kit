// src/components/PdfSplitter.tsx
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../utils/api";

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
    if (!selectedFile) {
      toast.error("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("pdfFile", selectedFile);
    formData.append("numFiles", numFiles.toString());

    setLoading(true);
    try {
      const response = await api.post("/split-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.files) {
        setSplitFiles(response.data.files);
        toast.success("PDF successfully split!");
      } else {
        toast.error("No split files returned from the server.");
      }
    } catch (error: any) {
      console.error("Error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error splitting PDF.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filePath: string) => {
    try {
      const fileName = filePath.split("/").pop() || "split.pdf";
      const encodedName = encodeURIComponent(fileName);

      const response = await api.get(`/download/split/${encodedName}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(
        error.response?.data?.message || "Error downloading split file."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
        Upload a PDF to Split
      </h2>

      <div className="mb-4">
        <label htmlFor="fileInput" className="block text-lg font-medium text-gray-600">
          Choose a PDF file
        </label>
        <input
          type="file"
          accept="application/pdf"
          id="fileInput"
          onChange={handleFileChange}
          className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="numFiles" className="block text-lg font-medium text-gray-600">
          Number of Parts
        </label>
        <input
          type="number"
          id="numFiles"
          min={1}
          value={numFiles}
          onChange={handleNumFilesChange}
          className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 ${
          loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Splitting PDF..." : "Split PDF"}
      </button>

      {splitFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Split PDF Files</h3>
          <ul>
            {splitFiles.map((file, index) => (
              <li key={index} className="mb-2 flex justify-between items-center">
                <span className="text-blue-600">{file}</span>
                <button
                  onClick={() => handleDownload(file)}
                  className="text-sm text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg transition-colors duration-200"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PdfSplitter;
