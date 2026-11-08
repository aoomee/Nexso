const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

// afterExtract runs after native dependency rebuilds and before ASAR creation.
// Strip debug records here so ASAR sizes and integrity hashes describe the
// final binaries. Runtime exports are retained, and signing happens later.
function stripNativeDebugPaths(context) {
  if (context.electronPlatformName !== 'darwin') return;
  const root = path.join(context.packager.info.appDir, 'node_modules');
  let count = 0;
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) { visit(file); continue; }
      if (!entry.isFile() || (!entry.name.endsWith('.node') && entry.name !== 'spawn-helper')) continue;
      const fd = fs.openSync(file, 'r');
      const header = Buffer.alloc(4);
      let bytes;
      try { bytes = fs.readSync(fd, header, 0, 4, 0); } finally { fs.closeSync(fd); }
      if (bytes !== 4 || ![0xfeedface, 0xfeedfacf, 0xcefaedfe, 0xcffaedfe, 0xcafebabe, 0xcafebabf].includes(header.readUInt32BE(0))) continue;
      execFileSync('xcrun', ['strip', '-S', file], { stdio: 'pipe' });
      count += 1;
    }
  }
  visit(root);
  console.log(`[privacy] Removed native debug records from ${count} Mach-O files`);
}

module.exports = stripNativeDebugPaths;
