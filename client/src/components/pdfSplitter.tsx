// src/components/PdfSplitter.tsx
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../utils/api";

const PdfSplitter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [numFiles, setNumFiles] = useState<number>(1); // New state for number of files
  const [splitFiles, setSplitFiles] = useState<string[]>([]); // State to store split files

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handle number of files input change
  const handleNumFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setNumFiles(value); // Update number of files to split into
    }
  };

  // Handle file upload and PDF splitting
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("pdfFile", selectedFile);
    formData.append("numFiles", numFiles.toString()); // Add the number of files to the form data

    setLoading(true);
    try {
      const response = await api.post("/split-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Check if the response contains the correct data (split file paths)
      if (response.data && response.data.files) {
        setSplitFiles(response.data.files); // Store split file URLs
        toast.success("PDF successfully split!");
      } else {
        toast.error("No split files found in the response.");
      }
    } catch (error) {
      toast.error("Error splitting PDF.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle downloading the file
  // In PdfSplitter.tsx
  const handleDownload = async (filePath: string) => {
    try {
      // Extract the filename from the path
      const fileName = filePath.split("/").pop() || filePath; // Fallback to full path if split fails
      const encodedFileName = encodeURIComponent(fileName); // Encode special characters

      const response = await api.get(`/download/split/${encodedFileName}`, {
        responseType: "blob",
      });

      // Create a download link
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error : string | any ){
      console.error("Error downloading file:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Show backend error message in toast

    }
  };
  
      }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
        Upload a PDF to Split
      </h2>

      <div className="mb-4">
        <label
          htmlFor="fileInput"
          className="block text-lg font-medium text-gray-600"
        >
          Choose a PDF file
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          id="fileInput"
          className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="numFiles"
          className="block text-lg font-medium text-gray-600"
        >
          Number of Parts
        </label>
        <input
          type="number"
          value={numFiles}
          onChange={handleNumFilesChange}
          min={1}
          id="numFiles"
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

      {/* Display the split PDFs with download buttons */}
      {splitFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Split PDF Files</h3>
          <ul>
            {splitFiles.map((fileName, index) => (
              <li
                key={index}
                className="mb-2 flex justify-between items-center"
              >
                <span className="text-blue-600">{fileName}</span>
                <button
                  onClick={() => handleDownload(fileName)} // Pass filename, not path
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
