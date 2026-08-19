# expressive-tea.io

The front page of **Expressive Tea Software** — the organization, not either of its
frameworks. It presents Green Tea and Expressive Tea as projects and sends visitors to the
sites that actually document them.

Astro, no MDX, no content collections: long-form writing lives on the project sites.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
```

Node >= 22.12.

## Brand

Every colour, font and asset here traces back to
[`../rebranding/docs/brand-guide.md`](../rebranding/docs/brand-guide.md).

- Accents `#00d084`, `#00a1ba`, `#0066ff` are sampled from the canonical cup and are the
  organization's. **Matcha and violet belong to Green Tea and must not appear on this site.**
- `Expressive Tea` is Inter 700; `SOFTWARE` is Zen Maru Gothic 700 in teal. Both fonts are
  self-hosted from `public/fonts/`, with their OFL licences beside them.
- `public/favicon.svg` and `src/assets/logo-mark.svg` are the canonical cup, copied byte for
  byte. It is never redrawn, recoloured or combined with the Green Tea leaf.
- `public/og.png` was rendered once from `../rebranding/assets/brand/sources/organization-lockup.svg`
  (the 363 KB master with its fonts embedded) onto a 1200×630 graphite canvas. It is a
  committed artefact, not a build step — regenerate it only if the lockup changes.

## Deploy

cPanel shared hosting, same shape as the other sites in the family: build, tar the contents
of `dist/`, unpack into the apex docroot (`public_html`).

```bash
npm run build
tar -czf expressive-tea-website.tar.gz -C dist .
```

`public/.htaccess` ships inside `dist/` and carries two things that matter:

- **The redirects.** Until 2026 this domain served the Docusaurus documentation from its web
  root, because a WordPress failure on `docs.expressive-tea.io` was patched by moving the docs
  to the apex and never moved back. The docs now live on their own subdomain again, so
  `/docs/*` and `/community/*` are permanent moves, not 404s.
- **A warning.** cPanel writes a PHP handler block into the apex `.htaccess` marked
  *"do not edit"*. It is not reproduced in this repository, so unpacking over the docroot
  drops it — append it back afterwards, or re-save the PHP version in cPanel.

Nothing here is automated yet. There is no GitHub Actions release workflow because there has
been nothing to release; the sibling repositories have one worth copying when that changes.
