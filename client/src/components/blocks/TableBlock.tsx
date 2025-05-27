import React from "react";

interface TableBlockProps {
  headers: string[];
  rows: string[][];
}

export const TableBlock: React.FC<TableBlockProps> = ({ headers, rows }) => (
  <table border={1} cellSpacing={0} cellPadding={4} style={{ margin: "1em 0", width: "100%", borderCollapse: "collapse" }}>
    <thead>
      <tr>
        {headers.map((h, idx) => (
          <th key={idx} style={{ background: "#f0f0f0", fontWeight: 600 }}>{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, rIdx) => (
        <tr key={rIdx}>
          {row.map((cell, cIdx) => (
            <td key={cIdx}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);