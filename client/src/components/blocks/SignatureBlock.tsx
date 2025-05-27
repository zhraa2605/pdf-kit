import React from "react";

interface SignatureBlockProps {
  name: string;
  title?: string;
}

export const SignatureBlock: React.FC<SignatureBlockProps> = ({ name, title }) => (
  <div style={{ margin: "2em 0", textAlign: "left" }}>
    <div style={{ borderBottom: "1px solid #333", width: "250px", marginBottom: "0.3em" }}></div>
    <div style={{ fontWeight: 600 }}>{name}</div>
    {title && <div style={{ color: "#555" }}>{title}</div>}
  </div>
);