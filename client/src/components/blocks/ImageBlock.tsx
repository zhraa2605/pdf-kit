import React from "react";

interface ImageBlockProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  caption?: string;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ src, alt = "", width, height, caption }) => (
  <div style={{ textAlign: "center", margin: "1em 0" }}>
    <img
      src={src}
      alt={alt}
      style={{
        maxWidth: width ? width : "100%",
        maxHeight: height ? height : "auto",
        display: "block",
        margin: "0 auto"
      }}
    />
    {caption && <div style={{ fontSize: "0.9em", color: "#555" }}>{caption}</div>}
  </div>
);