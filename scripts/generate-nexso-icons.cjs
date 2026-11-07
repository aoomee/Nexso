// Reproducible flat vector artwork and platform icon bundles for Nexso.
const fs = require('node:fs');
const path = require('node:path');
const { Resvg } = require('@resvg/resvg-js');
const root = path.resolve(__dirname, '..');
const cloud = 'M314 680H688C746 680 790 642 790 590C790 547 767 512 730 495C728 442 685 404 634 404C611 404 591 411 573 423C551 358 498 316 433 316C344 316 275 387 275 476C275 485 276 494 278 503C235 524 210 565 210 609C210 651 250 680 314 680Z';
const prompt = 'M474 470L518 510Q530 522 518 534L474 578';
function svg(bg = '#cabbd9', _fg = '#6b5b76', inset = 61) {
  const width = 1024 - 2 * inset;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><defs>
    <linearGradient id="base" x2=".7" y2="1"><stop stop-color="#f4f2ef"/><stop offset="1" stop-color="#dcdad7"/></linearGradient>
    <linearGradient id="cloud" x2=".7" y2="1"><stop stop-color="#eee8f4"/><stop offset="1" stop-color="${bg}"/></linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#53475a" flood-opacity=".2"/></filter>
    <clipPath id="clip"><rect x="${inset}" y="${inset}" width="${width}" height="${width}" rx="200"/></clipPath>
  </defs><g clip-path="url(#clip)">
    <rect x="${inset}" y="${inset}" width="${width}" height="${width}" rx="200" fill="url(#base)"/>
    <path d="${cloud}" fill="url(#cloud)" stroke="#eee8f4" stroke-width="2" filter="url(#shadow)"/>
    <path d="${prompt}" fill="none" stroke="#6b5b76" stroke-width="37" stroke-linecap="round" stroke-linejoin="round"/>
  </g></svg>\n`;
}
function png(source, size) { return new Resvg(source, { fitTo: { mode: 'width', value: size } }).render().asPng(); }
function write(file, bytes) { const target = path.join(root, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, bytes); }
const artwork = svg();
write('public/icon.svg', artwork);
write('public/logo.svg', artwork);
write('public/icon.png', png(artwork, 1024));
write('public/icon-win.png', png(svg('#cabbd9', '#6b5b76', 0), 1024));
const palettes = { original: ['#cabbd9', '#6b5b76'], dark: ['#202530', '#ffffff'], bright: ['#e8ecf3', '#292f40'], colorful: ['#405b77', '#ffffff'], rainbow: ['#54517b', '#ffffff'], 'white-navy': ['#f4f6fa', '#292f40'], 'white-violet': ['#f4f6fa', '#665a8b'], 'white-emerald': ['#f4f6fa', '#267566'], 'white-amber': ['#f4f6fa', '#986422'], 'white-rose': ['#f4f6fa', '#96566f'] };
for (const [name, colors] of Object.entries(palettes)) {
  write(`public/icons/variants/${name}.png`, png(svg(...colors), 1024));
  write(`public/icons/variants/macos/${name}.png`, png(svg(...colors, 100), 1024));
}
for (const size of [16, 32, 48, 64, 128, 256, 512]) write(`build/icons/${size}x${size}.png`, png(svg('#cabbd9', '#6b5b76', 0), size));
const tray = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="200 200 600 600"><defs><mask id="cut"><rect x="0" y="0" width="1024" height="1024" fill="white"/><path d="${prompt}" fill="none" stroke="black" stroke-width="50" stroke-linecap="round" stroke-linejoin="round"/></mask></defs><path d="${cloud}" fill="black" mask="url(#cut)"/></svg>\n`;
write('public/tray-iconTemplate.svg', tray);
write('public/tray-iconTemplate.png', png(tray, 18));
write('public/tray-iconTemplate@2x.png', png(tray, 36));
write('public/tray-icon.png', png(artwork, 32));
write('public/tray-icon@2x.png', png(artwork, 64));
const icoPng = png(artwork, 64);
const ico = Buffer.alloc(22); ico.writeUInt16LE(1, 2); ico.writeUInt16LE(1, 4); ico[6] = 64; ico[7] = 64; ico.writeUInt16LE(1, 10); ico.writeUInt16LE(32, 12); ico.writeUInt32LE(icoPng.length, 14); ico.writeUInt32LE(22, 18);
write('public/tray-icon.ico', Buffer.concat([ico, icoPng]));
// Modern ICNS PNG representations, including Retina sizes. No GUI renderer required.
const entries = [['icp4',16],['icp5',32],['icp6',64],['ic07',128],['ic08',256],['ic09',512],['ic10',1024],['ic11',32],['ic12',64],['ic13',256],['ic14',512]].map(([type,size]) => {
  const data = png(artwork, size); const header = Buffer.alloc(8); header.write(type, 0, 4, 'ascii'); header.writeUInt32BE(data.length + 8, 4); return Buffer.concat([header, data]);
});
const header = Buffer.alloc(8); header.write('icns'); header.writeUInt32BE(8 + entries.reduce((sum, item) => sum + item.length, 0), 4);
write('build/icon.icns', Buffer.concat([header, ...entries]));
console.log('Generated Nexso app, Dock, tray, and theme icons.');
