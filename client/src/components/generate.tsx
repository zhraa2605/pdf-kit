import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../utils/api";

// Import block components
import { HeadingBlock } from "./blocks/HeadingBlock";
import { SubheadingBlock } from "./blocks/subheadingBlock";
import { ParagraphBlock } from "./blocks/ParagraphBlock";
import { ListBlock } from "./blocks/ListBlock";
import { ImageBlock } from "./blocks/ImageBlock";
import { PageBreakBlock } from "./blocks/PageBreakBlock";
import { SignatureBlock } from "./blocks/SignatureBlock";
import { DateBlock } from "./blocks/DateBlock";
import { TableBlock } from "./blocks/TableBlock";

// Types for blocks
type Block =
  | { type: "heading"; content: string }
  | { type: "subheading"; content: string }
  | { type: "paragraph"; content: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "bullet-list"; items: string[] }
  | { type: "numbered-list"; items: string[] }
  | { type: "image"; url: string; caption?: string }
  | { type: "page-break" }
  | { type: "signature"; name: string; title?: string }
  | { type: "date"; value: string };

const blockTypes = [
  { type: "heading", label: "Heading" },
  { type: "subheading", label: "Subheading" },
  { type: "paragraph", label: "Paragraph" },
  { type: "table", label: "Table" },
  { type: "bullet-list", label: "Bullet List" },
  { type: "numbered-list", label: "Numbered List" },
  { type: "image", label: "Image" },
  { type: "page-break", label: "Page Break" },
  { type: "signature", label: "Signature" },
  { type: "date", label: "Date" },
];

const GenerateBlocksPage: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [showInputs, setShowInputs] = useState<string | null>(null);
  const [inputData, setInputData] = useState<any>({});
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Add block handlers
  const handleAddBlock = (type: string) => {
    setShowInputs(type);
    setInputData({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string
  ) => {
    setInputData({ ...inputData, [key]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setInputData({ ...inputData, url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBlockConfirm = () => {
    let newBlock: Block | null = null;
    switch (showInputs) {
      case "heading":
        newBlock = { type: "heading", content: inputData.content || "" };
        break;
      case "subheading":
        newBlock = { type: "subheading", content: inputData.content || "" };
        break;
      case "paragraph":
        newBlock = { type: "paragraph", content: inputData.content || "" };
        break;
      case "table":
        newBlock = {
          type: "table",
          headers: (inputData.headers || "")
            .split(",")
            .map((h: string) => h.trim()),
          rows: (inputData.rows || "")
            .split("\n")
            .map((row: string) =>
              row.split(",").map((cell: string) => cell.trim())
            ),
        };
        break;
      case "bullet-list":
        newBlock = {
          type: "bullet-list",
          items: (inputData.items || "")
            .split("\n")
            .map((item: string) => item.trim())
            .filter(Boolean),
        };
        break;
      case "numbered-list":
        newBlock = {
          type: "numbered-list",
          items: (inputData.items || "")
            .split("\n")
            .map((item: string) => item.trim())
            .filter(Boolean),
        };
        break;
      case "image":
        newBlock = {
          type: "image",
          url: inputData.url || "",
          caption: inputData.caption || "",
        };
        break;
      case "page-break":
        newBlock = { type: "page-break" };
        break;
      case "signature":
        newBlock = {
          type: "signature",
          name: inputData.name || "",
          title: inputData.title || "",
        };
        break;
      case "date":
        newBlock = {
          type: "date",
          value: inputData.value || new Date().toISOString(),
        };
        break;
      default:
        break;
    }
    if (newBlock) {
      setBlocks([...blocks, newBlock]);
      setShowInputs(null);
      setInputData({});
    }
  };

  const handleRemoveBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const handleGeneratePdf = async () => {
    try {
      const response = await api.post(
        "/generate-pdf",
        { blocks },
        { responseType: "blob" }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("PDF generated and downloaded!");
    } catch (err) {
      toast.error("Failed to generate PDF");
    }
  };

  // Render the actual block component
  const renderBlock = (block: Block, idx: number) => {
    switch (block.type) {
      case "heading":
        return <HeadingBlock content={block.content} />;
      case "subheading":
        return <SubheadingBlock key={idx} content={block.content} />;
      case "paragraph":
        return <ParagraphBlock key={idx} content={block.content} />;
      case "table":
        return (
          <TableBlock key={idx} headers={block.headers} rows={block.rows} />
        );
      case "bullet-list":
        return <ListBlock key={idx} items={block.items} ordered={false} />;
      case "numbered-list":
        return <ListBlock key={idx} items={block.items} ordered={true} />;
      case "image":
        return <ImageBlock key={idx} src={block.url} caption={block.caption} />;
      case "page-break":
        return <PageBreakBlock key={idx} />;
      case "signature":
        return (
          <SignatureBlock key={idx} name={block.name} title={block.title} />
        );
      case "date":
        return <DateBlock key={idx} value={block.value} />;
      default:
        return null;
    }
  };

  // Live preview for the block being created
  const renderLivePreview = () => {
    if (!showInputs) return null;
    let tempBlock: Block | null = null;
    switch (showInputs) {
      case "heading":
        tempBlock = { type: "heading", content: inputData.content || "" };
        break;
      case "subheading":
        tempBlock = { type: "subheading", content: inputData.content || "" };
        break;
      case "paragraph":
        tempBlock = { type: "paragraph", content: inputData.content || "" };
        break;
      case "table":
        tempBlock = {
          type: "table",
          headers: (inputData.headers || "")
            .split(",")
            .map((h: string) => h.trim()),
          rows: (inputData.rows || "")
            .split("\n")
            .map((row: string) =>
              row.split(",").map((cell: string) => cell.trim())
            ),
        };
        break;
      case "bullet-list":
        tempBlock = {
          type: "bullet-list",
          items: (inputData.items || "")
            .split("\n")
            .map((item: string) => item.trim())
            .filter(Boolean),
        };
        break;
      case "numbered-list":
        tempBlock = {
          type: "numbered-list",
          items: (inputData.items || "")
            .split("\n")
            .map((item: string) => item.trim())
            .filter(Boolean),
        };
        break;
      case "image":
        tempBlock = {
          type: "image",
          url: inputData.url || "",
          caption: inputData.caption || "",
        };
        break;
      case "page-break":
        tempBlock = { type: "page-break" };
        break;
      case "signature":
        tempBlock = {
          type: "signature",
          name: inputData.name || "",
          title: inputData.title || "",
        };
        break;
      case "date":
        tempBlock = {
          type: "date",
          value: inputData.value || new Date().toISOString(),
        };
        break;
      default:
        break;
    }
    return tempBlock ? (
      <div className="mb-4 border-l-4 border-blue-300 pl-4 bg-blue-50 py-2">
        <span className="text-xs text-blue-600">Live Preview:</span>
        {renderBlock(tempBlock, -1)}
      </div>
    ) : null;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-4 text-center">PDF Block Builder</h2>
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {blockTypes.map((block) => (
          <button
            key={block.type}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => handleAddBlock(block.type)}
          >
            {block.label}
          </button>
        ))}
      </div>

      {/* Block input forms */}
      {showInputs && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">
            Add {blockTypes.find((b) => b.type === showInputs)?.label}
          </h3>
          {showInputs === "heading" ||
          showInputs === "subheading" ||
          showInputs === "paragraph" ? (
            <textarea
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter content"
              value={inputData.content || ""}
              onChange={(e) => handleInputChange(e, "content")}
            />
          ) : null}
          {showInputs === "table" && (
            <>
              <input
                className="w-full p-2 border rounded mb-2"
                placeholder="Headers (comma separated)"
                value={inputData.headers || ""}
                onChange={(e) => handleInputChange(e, "headers")}
              />
              <textarea
                className="w-full p-2 border rounded mb-2"
                placeholder="Rows (one row per line, cells comma separated)"
                value={inputData.rows || ""}
                onChange={(e) => handleInputChange(e, "rows")}
              />
            </>
          )}
          {(showInputs === "bullet-list" || showInputs === "numbered-list") && (
            <textarea
              className="w-full p-2 border rounded mb-2"
              placeholder="List items (one per line)"
              value={inputData.items || ""}
              onChange={(e) => handleInputChange(e, "items")}
            />
          )}
          {showInputs === "image" && (
            <>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border rounded mb-2"
                onChange={handleImageUpload}
              />
              {uploadedImage && (
                <img
                  src={uploadedImage}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: 200, marginBottom: 8 }}
                />
              )}
              <input
                className="w-full p-2 border rounded mb-2"
                placeholder="Caption (optional)"
                value={inputData.caption || ""}
                onChange={(e) => handleInputChange(e, "caption")}
              />
            </>
          )}
          {showInputs === "signature" && (
            <>
              <input
                className="w-full p-2 border rounded mb-2"
                placeholder="Name"
                value={inputData.name || ""}
                onChange={(e) => handleInputChange(e, "name")}
              />
              <input
                className="w-full p-2 border rounded mb-2"
                placeholder="Title (optional)"
                value={inputData.title || ""}
                onChange={(e) => handleInputChange(e, "title")}
              />
            </>
          )}
          {showInputs === "date" && (
            <input
              className="w-full p-2 border rounded mb-2"
              type="date"
              value={inputData.value || ""}
              onChange={(e) => handleInputChange(e, "value")}
            />
          )}
          {showInputs === "page-break" && (
            <div className="mb-2 text-gray-600">
              A page break will be inserted.
            </div>
          )}
          {renderLivePreview()}
          <div className="flex gap-2">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleAddBlockConfirm}
            >
              Add
            </button>
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setShowInputs(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Preview of blocks */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Blocks Preview</h3>
        {blocks.length === 0 && (
          <div className="text-gray-500">No blocks added yet.</div>
        )}
        <ul>
          {blocks.map((block, idx) => (
            <li key={idx} className="mb-4 flex items-start gap-4">
              <div className="flex-1">{renderBlock(block, idx)}</div>
              <button
                className="text-red-500 hover:text-red-700 ml-2"
                onClick={() => handleRemoveBlock(idx)}
                title="Remove block"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Generate PDF button */}
      <button
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded"
        onClick={handleGeneratePdf}
        disabled={blocks.length === 0}
      >
        Generate PDF
      </button>
    </div>
  );
};

export default GenerateBlocksPage;
