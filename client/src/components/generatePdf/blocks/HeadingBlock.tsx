import React from "react";

interface HeadingBlockProps {
  content: string;
}

export const HeadingBlock: React.FC<HeadingBlockProps> = ({ content }) => (
  <h1 className="text-3xl font-bold mb-4 text-center" >
    {content}
  </h1>
);

