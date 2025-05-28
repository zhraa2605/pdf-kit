import React from "react";

interface SubheadingBlockProps {
  content: string;
}

export const SubheadingBlock: React.FC<SubheadingBlockProps> = ({ content }) => (
  <h2 style={{ fontSize: "1.5em", fontWeight: 600, margin: "1em 0 0.5em 0" }}>
    {content}
  </h2>
);