import React from "react";

interface DateBlockProps {
  value: string; // ISO date string or formatted date
}

export const DateBlock: React.FC<DateBlockProps> = ({ value }) => {
  const date = value ? new Date(value) : new Date();
  const formatted = date.toLocaleDateString();

  return (
    <div style={{ margin: "1em 0", fontStyle: "italic", color: "#555" }}>
      {formatted}
    </div>
  );
};