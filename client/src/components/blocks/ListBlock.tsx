import React from "react";

interface ListBlockProps {
  items: string[];
  ordered?: boolean;
}

export const ListBlock: React.FC<ListBlockProps> = ({ items, ordered = false }) => {
  if (!items || items.length === 0) return null;

  const ListTag = ordered ? "ol" : "ul";

  return (
    <div style={{ margin: "1em 0" }}>
      <ListTag style={{ paddingLeft: "1.5em" }}>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ListTag>
    </div>
  );
};