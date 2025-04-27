import React, { useState } from "react";
import { api } from "../utils/api";
import toast, { Toaster } from "react-hot-toast";

const FileUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mergedFileUrl, setMergedFileUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      setFiles([...files, ...Array.from(fileList)]);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);
    setMergedFileUrl(null); // Reset previous merged file

    try {
      const response = await api.post("/merge-files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob", // <-- important!
      });
      // create blob and download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged-report.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
  
      toast.success("Files merged and downloaded!");
    } catch (err) {
      toast.error("Failed to merge files");
      console.error(err);
    } finally {
      setLoading(false);
      setFiles([]);
    }
  

     
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-md mt-10 mx-auto p-6 bg-white rounded-lg shadow-md">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Files to Merge</h2>

      {/* File Input */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">Select files</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {/* Icon */}
              <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF files only</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              multiple 
              onChange={handleFileChange} 
              disabled={loading}
              accept="application/pdf"
            />
          </label>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-medium text-gray-700 mb-2">Selected Files ({files.length})</h3>
          <ul className="max-h-40 overflow-y-auto border border-gray-200 rounded-md divide-y">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center py-2 px-3 text-sm">
                <span className="truncate max-w-xs">{file.name}</span>
                <button 
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Merge Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full py-2.5 px-5 text-sm font-medium text-white rounded-lg transition-colors ${
          loading 
            ? "bg-blue-400 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Merging Files...
          </span>
        ) : (
          "Merge Files"
        )}
      </button>

      {/* Download Button */}
      {mergedFileUrl && (
        <a
          href={mergedFileUrl}
          download
          className="mt-4 inline-block w-full text-center py-2.5 px-5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors"
        >
          Download Merged PDF
        </a>
      )}
    </div>
  );
};

export default FileUpload;
