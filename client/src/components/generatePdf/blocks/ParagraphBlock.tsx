import React from "react";

interface ParagraphBlockProps {
  content: string;
}

export const ParagraphBlock: React.FC<ParagraphBlockProps> = ({ content }) => (
  <p style={{ fontSize: "1em", fontWeight: 400, margin: "1em 0 0.5em 0" }}>
    {content}
  </p>
);