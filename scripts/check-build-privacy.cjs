const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function assertNoBuildHome(root, home = os.homedir()) {
  if (!path.isAbsolute(home) || home === path.parse(home).root) {
    throw new Error('A specific build home directory is required for privacy verification');
  }
  const markers = [Buffer.from(home), Buffer.from(home, 'utf16le')];
  const found = [];
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile()) {
        const data = fs.readFileSync(file);
        if (markers.some(marker => data.includes(marker))) found.push(path.relative(root, file));
      }
    }
  }
  visit(root);
  if (found.length) {
    // Do not repeat the private path or matching contents in public CI logs.
    throw new Error(`Build home path found in packaged files: ${found.join(', ')}`);
  }
}

module.exports = { assertNoBuildHome };
