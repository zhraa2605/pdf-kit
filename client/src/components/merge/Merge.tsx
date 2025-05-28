// filepath: c:\Users\LENOVO\Desktop\pdf-kit\client\src\components\Merge.tsx
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { mergePdfFiles } from "../../utils/Merge";
import { FileUploadZone } from "./FileUploadZone";
import { FileList } from "./FileList";

const MergeFiles: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      setFiles([...files, ...Array.from(fileList)]);
    }
  };

  const handleUpload = async () => {
    await mergePdfFiles(
      files,
      setLoading,
      () => setFiles([])
    );
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-md mt-10 mx-auto p-6 bg-white rounded-lg shadow-md">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Upload Files to Merge
      </h2>

      <FileUploadZone onFileChange={handleFileChange} loading={loading} />
      <FileList files={files} onRemove={removeFile} loading={loading} />

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
    </div>
  );
};

export default MergeFiles;