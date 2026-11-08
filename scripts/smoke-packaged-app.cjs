const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const { createRequire } = require('node:module');

assert.ok(process.env.NEXSO_TEST_APP, 'NEXSO_TEST_APP must identify the copied application');
const bundled = createRequire(path.join(process.env.NEXSO_TEST_APP, 'Contents/Resources/app.asar/package.json'));
assert.equal(bundled('./package.json').version, require('../package.json').version);
assert.deepEqual(bundled('./nexso.config.json').repository, require('../nexso.config.json').repository);
for (const moduleName of ['node-pty', 'serialport', 'sqlite3', 'ssh2']) bundled(moduleName);
const db = new (bundled('sqlite3').Database)(':memory:');
db.get('SELECT 42 AS result', (error, row) => {
  assert.ifError(error);
  assert.equal(row.result, 42);
  db.close();
  console.log('Packaged SQLite passed');
});
const pty = bundled('node-pty').spawn('/bin/zsh', ['-lc', 'printf nexso-terminal-ok'], {
  name: 'xterm', cols: 80, rows: 24, cwd: os.tmpdir(), env: process.env,
});
let output = '';
const timeout = setTimeout(() => { pty.kill(); process.exit(1); }, 15000);
pty.onData(data => { output += data; });
pty.onExit(({ exitCode }) => {
  clearTimeout(timeout);
  assert.equal(exitCode, 0);
  assert.match(output, /nexso-terminal-ok/);
  console.log('Packaged local terminal passed');
});
