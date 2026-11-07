import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';

import { AppWordmark } from './AppWordmark';

test('AppWordmark renders the upright Nexso name as decorative artwork', () => {
  const markup = renderToStaticMarkup(<AppWordmark className="h-5" />);

  assert.match(markup, /<text /);
  assert.match(markup, />Nexso<\/text>/);
  assert.match(markup, /aria-hidden="true"/);
  assert.doesNotMatch(markup, /italic/);
  assert.match(markup, /class="h-5"/);
});

test('AppWordmark exposes an accessible product name when requested', () => {
  const markup = renderToStaticMarkup(
    <AppWordmark accessibleLabel="Nexso" className="h-8" />,
  );

  assert.match(markup, /aria-label="Nexso"/);
  assert.match(markup, /role="img"/);
  assert.doesNotMatch(markup, /aria-hidden/);
});
