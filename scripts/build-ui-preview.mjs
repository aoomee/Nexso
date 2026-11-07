import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';

// Standalone, offline visual harness using the production workspace primitives.
const result = await build({
  entryPoints: ['design/preview.tsx'],
  bundle: true,
  minify: true,
  format: 'iife',
  define: { 'process.env.NODE_ENV': '"production"' },
  write: false,
});
const css = (await Promise.all([
  'components/ui/design-system.css',
  'components/workspace/workspace.css',
  'design/preview.css',
].map(path => readFile(path, 'utf8')))).join('\n');
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
await writeFile('design/netcatty-ui-preview.html', `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nexso · 界面预览</title><style>${css}</style></head>
<body><div id="root"></div><script>${js}</script></body></html>`);
console.log('Created design/netcatty-ui-preview.html');
