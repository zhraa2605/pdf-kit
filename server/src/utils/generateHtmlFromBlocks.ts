
import { PdfContent } from '../models/BdfTypes';

export const generateHtmlFromBlocks = (blocks: PdfContent): string => {
  const styles = `
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h1 { font-size: 28px; margin-bottom: 10px; text-align: center; }
      h2 { font-size: 22px; margin-top: 20px; }
      p { margin: 10px 0; line-height: 1.5; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      table, th { font-size: 14px; }
      th { background-color: #f2f2f2; font-weight: bold; }
      table, th, td { border: 1px solid #ddd; }
      th, td { padding: 8px; text-align: left; }
      ul, ol { margin-left: 20px; margin-top: 10px; padding: 20px; }
      .image-block { margin: 20px 0; alighn: center; }
      .caption { font-size: 12px; text-align: center; color: gray; }
      .page-break { page-break-after: always; }
      .signature { margin-top: 40px; font-style: italic; }
      .date { text-align: right; color: #666; margin-bottom: 20px; }
    </style>
  `;

  const html = blocks.map(block => {
    switch (block.type) {
      case 'heading':
        return `<h1>${block.content}</h1>`;
      case 'subheading':
        return `<h2>${block.content}</h2>`;
      case 'paragraph':
        return `<p>${block.content}</p>`;
      case 'bullet-list':
        return `<ul>${block.items.map(item => `<li>${item}</li>`).join('')}</ul>`;
      case 'numbered-list':
        return `<ol>${block.items.map(item => `<li>${item}</li>`).join('')}</ol>`;
      case 'table':
        const headers = `<tr>${block.headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
        const rows = block.rows
          .map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`)
          .join('');
        return `<table>${headers}${rows}</table>`;
      case 'image':
        return `
          <div class="image-block">
            <img src="${block.url}" style="max-width: 100%; height: auto;" />
            ${block.caption ? `<div class="caption">${block.caption}</div>` : ''}
          </div>
        `;
      case 'page-break':
        return `<div class="page-break"></div>`;
      case 'signature':
        return `
          <div class="signature">
            <p>Signed by: <strong>${block.name}</strong></p>
            ${block.title ? `<p>${block.title}</p>` : ''}
          </div>
        `;
      case 'date':
        return `<div class="date">${new Date(block.value).toLocaleDateString()}</div>`;
      default:
        return '';
    }
  });

  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        ${styles}
      </head>
      <body>
        ${html.join('')}
      </body>
    </html>
  `;
};
