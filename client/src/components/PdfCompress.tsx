// src/components/PdfCompressor.tsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../utils/api';

const PdfCompressor = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [compressedFile, setCompressedFile] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  // src/components/PdfCompressor.tsx
const handleCompress = async () => {
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append('pdfFile', selectedFile);
  
    try {
      const response = await api.post('/compress-pdf', formData, {
        responseType: 'blob'
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'compressed.pdf';
      link.click();
      toast.success('PDF compressed successfully!');
    } catch (error) {
      toast.error('Compression failed');
    }
  };

  const handleDownload = async () => {
    if (!compressedFile) return;
    
    try {
      const response = await api.get(`/download/compress/${compressedFile}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = compressedFile;
      link.click();
    } catch (error) {
      toast.error('Download failed');
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Compress PDF</h2>
      
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleCompress}
        disabled={loading}
        className={`bg-blue-500 text-white px-4 py-2 rounded ${
          loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
        }`}
      >
        {loading ? 'Compressing...' : 'Compress PDF'}
      </button>

      {compressedFile && (
        <div className="mt-4">
          <button
            onClick={handleDownload}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Download Compressed PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfCompressor;