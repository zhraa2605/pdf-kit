export function BulletListBlock(items: string[]) {
  return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
}