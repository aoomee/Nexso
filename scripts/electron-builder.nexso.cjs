const base = require('../electron-builder.config.cjs');
const project = require('../nexso.config.json');
const pkg = require('../package.json');

module.exports = {
  ...base,
  appId: 'com.nexso.desktop',
  productName: project.name,
  artifactName: 'Nexso-${version}-${os}-${arch}.${ext}',
  // Used for release provenance only. This ad-hoc macOS build opens Releases
  // for installation; native auto-install requires a stable signing identity.
  publish: { provider: 'github', owner: project.repository.owner, repo: project.repository.name },
  extraMetadata: { name: 'nexso', version: pkg.version, netcattyUpdateChannel: 'manual' },
  files: [...base.files, 'nexso.config.json'],
  mac: { ...base.mac, target: ['dmg'], identity: '-', notarize: false },
};
