import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../utils/api";

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
import BlockInputForm from "./BlockInputForm";
import BlockPreviewList from "./blocks/BlockPreviewList";
import { generatePdf } from "../../utils/generatePdf";

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

export const blockTypes = [
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

  const handleAddBlock = (type: string) => {
    setShowInputs(type);
    setInputData({});
    setUploadedImage(null);
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
      setUploadedImage(null);
    }
  };

  const handleRemoveBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  
   const handleGeneratePdf = () => generatePdf(blocks);
  

  // Render the actual block component
  const renderBlock = (block: Block, idx: number) => {
    switch (block.type) {
      case "heading":
        return <HeadingBlock key={idx} content={block.content} />;
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
      <BlockInputForm
        showInputs={showInputs}
        inputData={inputData}
        uploadedImage={uploadedImage}
        handleInputChange={handleInputChange}
        handleImageUpload={handleImageUpload}
        handleAddBlockConfirm={handleAddBlockConfirm}
        setShowInputs={setShowInputs}
      />

      {/* Preview of blocks */}
      <BlockPreviewList
        blocks={blocks}
        renderBlock={renderBlock}
        handleRemoveBlock={handleRemoveBlock}
      />

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