import React from "react";
import { blockTypes } from "./generate"; // Or move blockTypes to a shared file

interface BlockInputFormProps {
  showInputs: string | null;
  inputData: any;
  uploadedImage: string | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddBlockConfirm: () => void;
  setShowInputs: (type: string | null) => void;
}

const BlockInputForm: React.FC<BlockInputFormProps> = ({
  showInputs,
  inputData,
  uploadedImage,
  handleInputChange,
  handleImageUpload,
  handleAddBlockConfirm,
  setShowInputs,
}) => {
  if (!showInputs) return null;

  return (
    <div className="mb-8 p-6 border-2 border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
        Add {blockTypes.find((b) => b.type === showInputs)?.label}
      </h3>

      <div className="space-y-4">
        {/* Text inputs for heading, subheading, paragraph */}
        {showInputs === "heading" ||
        showInputs === "subheading" ||
        showInputs === "paragraph" ? (
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter content"
            value={inputData.content || ""}
            onChange={(e) => handleInputChange(e, "content")}
            rows={4}
          />
        ) : null}

        {/* Table inputs */}
        {showInputs === "table" && (
          <div className="space-y-3">
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Headers (comma separated)"
              value={inputData.headers || ""}
              onChange={(e) => handleInputChange(e, "headers")}
            />
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Rows (one row per line, cells comma separated)"
              value={inputData.rows || ""}
              onChange={(e) => handleInputChange(e, "rows")}
              rows={4}
            />
          </div>
        )}

        {/* List inputs */}
        {(showInputs === "bullet-list" || showInputs === "numbered-list") && (
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="List items (one per line)"
            value={inputData.items || ""}
            onChange={(e) => handleInputChange(e, "items")}
            rows={4}
          />
        )}

        {/* Image upload */}
        {showInputs === "image" && (
          <div className="space-y-4">
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                className="w-full cursor-pointer"
                onChange={handleImageUpload}
              />
            </div>
            {uploadedImage && (
              <div className="relative rounded-lg overflow-hidden bg-gray-100 p-2">
                <img
                  src={uploadedImage}
                  alt="Preview"
                  className="max-w-full h-auto mx-auto rounded"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            )}
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Caption (optional)"
              value={inputData.caption || ""}
              onChange={(e) => handleInputChange(e, "caption")}
            />
          </div>
        )}

        {/* Signature inputs */}
        {showInputs === "signature" && (
          <div className="space-y-3">
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Name"
              value={inputData.name || ""}
              onChange={(e) => handleInputChange(e, "name")}
            />
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Title (optional)"
              value={inputData.title || ""}
              onChange={(e) => handleInputChange(e, "title")}
            />
          </div>
        )}

        {/* Date input */}
        {showInputs === "date" && (
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="date"
            value={inputData.value || ""}
            onChange={(e) => handleInputChange(e, "value")}
          />
        )}

        {/* Page break info */}
        {showInputs === "page-break" && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-600">
            <svg className="w-6 h-6 inline mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            A page break will be inserted at this position
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          onClick={handleAddBlockConfirm}
        >
          Add Block
        </button>
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setShowInputs(null)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BlockInputForm;