// The apex carried five years of inbound links to the documentation before the docs moved
// back to their own subdomain. One regex in public/.htaccess decides whether those links
// survive, so it is read from the file itself and exercised here rather than trusted.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const htaccess = readFileSync(new URL('../public/.htaccess', import.meta.url), 'utf8');

const rules = htaccess
  .split('\n')
  .filter((line) => /^\s*RedirectMatch\s/.test(line))
  .map((line) => {
    const [, status, pattern, target] = line.trim().split(/\s+/);
    return { status, re: new RegExp(pattern), target };
  });

assert.equal(rules.length, 1, 'expected exactly one active RedirectMatch');
const [rule] = rules;
assert.equal(rule.status, '301', 'the docs moved permanently; a 302 keeps the old URL ranking');

const resolve = (path) => {
  const match = rule.re.exec(path);
  if (!match) return null;
  return rule.target.replace(/\$(\d)/g, (_, n) => match[Number(n)] ?? '');
};

const cases = [
  ['/docs/', 'https://docs.expressive-tea.io/docs/'],
  ['/docs', 'https://docs.expressive-tea.io/docs'],
  ['/docs/getting-started/', 'https://docs.expressive-tea.io/docs/getting-started/'],
  ['/community/team', 'https://docs.expressive-tea.io/community/team'],
  // Everything else is this site's own and must not be handed to the subdomain.
  ['/', null],
  ['/404.html', null],
  ['/documentation', null],
  ['/docsearch', null],
  // This site serves its own, and it must not be shadowed by a redirect to the subdomain.
  ['/privacy-policy', null],
];

for (const [path, expected] of cases) {
  assert.equal(resolve(path), expected, `${path} → ${expected ?? 'no redirect'}`);
}

console.log(`ok — ${cases.length} paths resolve as intended`);
