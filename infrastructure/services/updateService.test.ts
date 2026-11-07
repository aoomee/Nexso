import test from 'node:test';
import assert from 'node:assert/strict';
import { checkForUpdates, getReleaseUrl, getReleasesUrl, isProjectReleaseUrl } from './updateService';
import { STORAGE_KEY_UPDATE_LAST_CHECK, STORAGE_KEY_UPDATE_LATEST_RELEASE } from '../config/storageKeys';

const originalFetch = globalThis.fetch;
const ownRelease = { tag_name: 'v0.1.3', html_url: 'https://github.com/aoomee/Nexso/releases/tag/v0.1.3', assets: [] };

test('Nexso checks and opens only its own release repository', async () => {
  let called = '';
  globalThis.fetch = async (input) => { called = String(input); return Response.json(ownRelease); };
  try {
    const result = await checkForUpdates('0.1.2');
    assert.equal(called, 'https://api.github.com/repos/aoomee/Nexso/releases/latest');
    assert.equal(result.hasUpdate, true);
    assert.equal(result.latestRelease?.version, '0.1.3');
    assert.equal(getReleaseUrl(), 'https://github.com/aoomee/Nexso/releases');
    assert.equal(getReleasesUrl(), 'https://github.com/aoomee/Nexso/releases/latest');
  } finally { globalThis.fetch = originalFetch; }
});

test('an upstream Netcatty release cannot produce a Nexso update notice', async () => {
  globalThis.fetch = async () => Response.json({ ...ownRelease, tag_name: 'v1.1.90', html_url: 'https://github.com/binaricat/Netcatty/releases/tag/v1.1.90' });
  try {
    const result = await checkForUpdates('0.1.2');
    assert.equal(result.hasUpdate, false);
    assert.equal(result.latestRelease, null);
    assert.match(result.error ?? '', /does not belong/);
  } finally { globalThis.fetch = originalFetch; }
});

test('no release yet is not an error and never falls back to upstream', async () => {
  globalThis.fetch = async () => new Response(null, { status: 404 });
  try { assert.deepEqual(await checkForUpdates('0.1.2'), { hasUpdate: false, currentVersion: '0.1.2', latestRelease: null }); }
  finally { globalThis.fetch = originalFetch; }
});

test('equal or older Nexso releases do not offer a downgrade', async () => {
  globalThis.fetch = async () => Response.json(ownRelease);
  try {
    assert.equal((await checkForUpdates('0.1.3')).hasUpdate, false);
    assert.equal((await checkForUpdates('0.1.4')).hasUpdate, false);
  } finally { globalThis.fetch = originalFetch; }
});

test('update cache has its own namespace and rejects old project URLs', () => {
  assert.match(STORAGE_KEY_UPDATE_LAST_CHECK, /^nexso_aoomee_nexso_/);
  assert.match(STORAGE_KEY_UPDATE_LATEST_RELEASE, /^nexso_aoomee_nexso_/);
  assert.equal(isProjectReleaseUrl('https://github.com/binaricat/Netcatty/releases/tag/v1.1.90'), false);
  assert.equal(isProjectReleaseUrl('https://github.com/aoomee/Nexso-evil/releases/tag/v9.0.0'), false);
  assert.equal(isProjectReleaseUrl(ownRelease.html_url), true);
});
