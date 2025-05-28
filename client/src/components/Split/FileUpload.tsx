import React from 'react';

interface FileUploadInputProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadInput: React.FC<FileUploadInputProps> = ({ handleFileChange }) => (
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
);
