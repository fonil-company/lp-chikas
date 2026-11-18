import { cp, readFile, access, mkdir } from 'node:fs/promises';

const source = new URL('../public/', import.meta.url);
const output = new URL('../dist/', import.meta.url);
const html = await readFile(new URL('index.html', source), 'utf8');
for (const [, path] of html.matchAll(/(?:src|href)="([^"#][^"]*)"/g)) {
  if (!/^(?:https?:|data:|mailto:)/.test(path)) await access(new URL(path, source));
}
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
console.log('Build concluído: dist/ — HTML, CSS, JavaScript e imagens verificados.');
