import React, { useState } from "react";
import { api } from "../utils/api";
import { FaTrash } from "react-icons/fa";

const ReportForm: React.FC = () => {
  const [date, setDate] = useState("");
  const [items, setItems] = useState([{ task: "", time: 0, notes: "" }]);
  const [format, setFormat] = useState("pdf");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedItems = [...items];
    updatedItems[index][e.target.name] =
      e.target.type === "number" ? parseFloat(e.target.value) : e.target.value;
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { task: "", time: 0, notes: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await api.post("/generate", {
        format,
        reportData: {
          date,
          items,
        },
      });
      setReportData(response.data.report);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    const fileName = reportData.fileName;
    try {
      const response = await api.get(`/download/${fileName}`, {
        responseType: "blob",
      });
      // Create a URL for the blob and trigger the download
      const blob = response.data;
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg border border-b-2 border-gray-200 shadow-sm mt-10 ">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 justify-center">
        Generate Report
      </h2>

      <div className="mb-6 border-b border-gray-300 pb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-6 border-b border-gray-300 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-700">Items</h3>
          <button
            onClick={handleAddItem}
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
          >
            Add Task
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-gray-200 rounded-md bg-gray-50"
            >
              {/* Item Name with a larger width */}
              <input
                name="task"
                placeholder="Task"
                value={item.task}
                onChange={(e) => handleChange(e, index)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:col-span-2" // Takes up 2 columns on medium screens
              />

              <input
                name="time"
                type="text"
                placeholder="Time (hours)"
                
                value={item.time}
                onChange={(e) => handleChange(e, index)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <input
                name="notes"
                placeholder="Notes"
                value={item.notes}
                onChange={(e) => handleChange(e, index)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:col-span-2"
              />

              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="ml-auto mt-2 px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 border-b border-gray-300 pb-4">
        <label className="block text-lg font-medium text-gray-700 mb-3">
          Format
        </label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >

          <option value="pdf">PDF</option>
          <option value="word">Word</option>
          <option value="excel">Excel</option>
        </select>
      </div>

      <button
        onClick={handleGenerateReport}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Generating..." : "Generate Report"}
      </button>

      {reportData && (
        <div className="mt-8 p-4 border border-green-200 rounded-md bg-green-50">
          <h3 className="text-lg font-medium text-green-800 mb-2">
            Report Generated!
          </h3>
          <div className="text-sm text-green-700">
            <p className="mb-1">
              <span className="font-medium">File Path:</span>{" "}
              {reportData.filePath}
            </p>
            <p className="mb-1">
              <span className="font-medium">File Name:</span>{" "}
              {reportData.fileName}
            </p>
            <p>
              <span className="font-medium">Generated At:</span>{" "}
              {reportData.generatedAt}
            </p>
            {/* Download Button */}
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="mt-4 text-white bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded-md"
            >
              Download Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportForm;
