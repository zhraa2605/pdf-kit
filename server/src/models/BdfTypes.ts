type ContentBlock =
  | { type: 'heading'; content: string }
  | { type: 'subheading'; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'bullet-list'; items: string[] }
  | { type: 'numbered-list'; items: string[] }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'page-break' }
  | { type: 'signature'; name: string; title?: string }
  | { type: 'date'; value: string };

export type PdfContent = ContentBlock[];
