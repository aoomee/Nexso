const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { assertNoBuildHome } = require('./check-build-privacy.cjs');

test('release gate rejects build paths in binary and packed data without logging the path', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nexso-privacy-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const home = '/Users/build-person';
  for (const encoding of ['utf8', 'utf16le']) {
    fs.writeFileSync(path.join(root, 'app.asar'), Buffer.concat([Buffer.from([0, 1, 2]), Buffer.from(home + '/project/file.o', encoding)]));
    assert.throws(() => assertNoBuildHome(root, home), error => {
      assert.match(error.message, /app\.asar/);
      assert.ok(!error.message.includes(home));
      return true;
    });
  }
  fs.writeFileSync(path.join(root, 'app.asar'), 'neutral build data');
  assert.doesNotThrow(() => assertNoBuildHome(root, home));
});

test('release gate does not follow links outside the application', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nexso-privacy-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'app'));
  fs.writeFileSync(path.join(root, 'outside'), '/Users/build-person/private');
  fs.symlinkSync('../outside', path.join(root, 'app', 'external'));
  assert.doesNotThrow(() => assertNoBuildHome(path.join(root, 'app'), '/Users/build-person'));
});
