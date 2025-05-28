import React from "react";
import { Block } from "../generate"; // Or move Block type to a shared file

interface BlockPreviewListProps {
  blocks: Block[];
  renderBlock: (block: Block, idx: number) => React.ReactNode;
  handleRemoveBlock: (idx: number) => void;
}

const BlockPreviewList: React.FC<BlockPreviewListProps> = ({
  blocks,
  renderBlock,
  handleRemoveBlock,
}) => (
  <div className="mb-6">
    <h3 className="font-semibold mb-2">Blocks Preview</h3>
    {blocks.length === 0 && (
      <div className="text-gray-500">No blocks added yet.</div>
    )}
    <ul>
      {blocks.map((block, idx) => (
        <li key={idx} className="mb-4 flex items-start gap-4">
          <div className="flex-1">{renderBlock(block, idx)}</div>
          <div className="flex justify-center items-center">


          <button
            className="w-8 h-8 flex text-4xl text-red-500 hover: rounded-full transition-colors duration-200"
            onClick={() => handleRemoveBlock(idx)}
            title="Remove block"
          >
            &times;
          </button>
            </div>
        </li>
      ))}
    </ul>
  </div>
);

export default BlockPreviewList;