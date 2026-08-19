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

## Content

Two kinds of page, and the difference is the voice.

- **`/releases`** pulls the notes from the GitHub API at build time and renders GitHub's own
  HTML — which is why no Markdown library is a dependency here. The support policy above each
  list is written in `src/pages/releases.astro`, because GitHub knows tags, not intent.
- **`/blog`** is release press, written as the organization. Posts are Markdown in
  `src/content/blog/`, schema in `src/content.config.ts`. `draft: true` keeps a post out of the
  build entirely, and a filename starting with `_` keeps it out of the collection.

There is no `author` field on purpose. The first-person writing — the story of building the
thing, with a name on it — belongs on the project sites, and green-tea-site already holds
Green Tea's. A post that wants a byline is a post for the other blog.

Dates are formatted in UTC everywhere. A date-only front-matter value parses as UTC midnight,
so formatting it in the builder's zone renders it a day early west of Greenwich — and makes
the same commit build differently on a laptop than in CI.

## Deploy

cPanel shared hosting, manual, from your own machine:

```bash
npm run deploy              # test + build + subir
node scripts/deploy.mjs --dry-run   # imprime el batch sin conectarse
```

`scripts/deploy.mjs` recorre `dist/` y genera un batch para `sftp -b`. SSH autentica
contra esa cuenta pero **el shell está deshabilitado**, así que rsync, tar y cualquier
comando remoto están descartados: SFTP es el único canal. De ahí dos decisiones que el
script toma a propósito:

- **No borra nada.** Los assets con hash viejos y las páginas que dejaron de existir se
  quedan en el docroot. Es basura inofensiva, y un borrado a ciegas ahí se llevaría
  `public_html/.well-known/acme-challenge` — la validación de Let's Encrypt — y con ella
  la renovación del certificado.
- **Sube el HTML al final.** No hay swap atómico. Con este orden la ventana de
  inconsistencia es "HTML viejo, assets nuevos", que nadie nota, en lugar de "HTML nuevo
  apuntando a assets que no han llegado".

### `.htaccess`, que se sube aparte

El script **no** sube `dist/.htaccess`, y eso no es un descuido. El archivo del servidor
lleva un bloque de handlers que genera cPanel, marcado *"do not edit"*, que no está en este
repositorio — y que **difiere por dominio**: el apex es `ea-php81`, el subdominio de docs es
`ea-php82`. Subir el de `dist/` le cambiaría la versión de PHP al dominio principal en
silencio. Cuando cambien las redirecciones: baja el `.htaccess` del servidor, pega su bloque
PHP al final del nuestro, y sube el resultado a mano.

Lo que sí trae nuestro `.htaccess`: hasta 2026 este dominio servía la documentación de
Docusaurus desde su raíz, porque una falla de WordPress en `docs.expressive-tea.io` se parchó
moviendo los docs al apex y nunca se revirtió. Los docs ya viven otra vez en su subdominio,
así que `/docs/*` y `/community/*` son mudanzas permanentes, no 404s. `npm test` verifica
esas reglas contra el archivo real.

El deploy no está automatizado. Los repositorios hermanos tienen un `release.yml` que vale la
pena copiar cuando eso cambie — pero la llave SSH autentica como la cuenta completa y puede
escribir en los tres docroots, así que ese secreto va en la forja que controlas, no en el
espejo público.
