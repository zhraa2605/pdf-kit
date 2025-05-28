import React from 'react';

interface SplitFilesListProps {
  files: string[];
  onDownload: (filePath: string) => void;
}

export const SplitFilesList: React.FC<SplitFilesListProps> = ({ files, onDownload }) => {
  if (files.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Split PDF Files</h3>
      <ul>
        {files.map((file, index) => (
          <li key={index} className="mb-2 flex justify-between items-center">
            <span className="text-blue-600">{file}</span>
            <button
              onClick={() => onDownload(file)}
              className="text-sm text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg transition-colors duration-200"
            >
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};