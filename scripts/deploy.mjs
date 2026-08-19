#!/usr/bin/env node
// Sube dist/ al docroot de cPanel por SFTP.
//
// El shell remoto está deshabilitado en esa cuenta, así que rsync, tar y cualquier
// comando remoto están descartados: `sftp -b` es el único canal. Eso trae dos
// consecuencias que este script asume en vez de intentar resolver:
//   - No borra nada. Los assets con hash viejos y las páginas que dejaron de
//     existir se quedan ahí. Es basura inofensiva; borrar a ciegas en ese docroot
//     se llevaría .well-known/acme-challenge y con él la renovación del certificado.
//   - No hay swap atómico, de ahí el orden de subida (ver buildBatch).
import { readdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, relative, dirname } from 'node:path';
import assert from 'node:assert/strict';

const HOST = 'usuario@dominio';
const KEY = `${process.env.HOME}/.ssh/expressive-tea-cpanel`;
const REMOTE = 'public_html';
const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

/**
 * Rutas relativas a dist/ -> batch de sftp. Puro a propósito: el orden es lo único
 * delicado que hay aquí, y así se puede probar sin tocar ni el disco ni la red.
 */
export function buildBatch(paths) {
  // .htaccess nunca viaja desde dist/. El que está en el servidor lleva además el
  // bloque de handlers que genera cPanel (ea-php81 en el apex, distinto por dominio),
  // y ese bloque no está en el repo: subir el de dist/ le cambiaría la versión de PHP
  // al dominio principal en silencio.
  const files = paths.filter((p) => p !== '.htaccess');
  // Cada ruta aporta toda su cadena de ancestros: `mkdir` no crea padres, así que
  // blog/2026/post.html necesita `blog` antes que `blog/2026`.
  const ancestors = (p) => dirname(p).split('/').map((_, i, a) => a.slice(0, i + 1).join('/'));
  const dirs = [...new Set(files.flatMap(ancestors))]
    .filter((d) => d !== '.')
    .sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b));
  // HTML al final: sin swap atómico, hay una ventana en la que el HTML nuevo ya está
  // servido y sus assets no han llegado. Subiendo el HTML de último la ventana existe
  // al revés — HTML viejo, assets nuevos — que nadie nota.
  const isHtml = (p) => p.endsWith('.html');
  return [
    `cd ${REMOTE}`,
    `lcd ${DIST}`,
    ...dirs.map((d) => `-mkdir ${d}`), // el '-' deja continuar si ya existe
    ...files.filter((p) => !isHtml(p)).map((p) => `put ${p} ${p}`),
    ...files.filter(isHtml).map((p) => `put ${p} ${p}`),
    'bye',
  ].join('\n');
}

function walk(dir, base = dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p, base) : [relative(base, p)];
  });
}

function selfTest() {
  const batch = buildBatch(['index.html', '.htaccess', 'og.png', 'blog/x/index.html', '_astro/a.css']);
  const at = (line) => {
    const i = batch.split('\n').indexOf(line);
    assert.notEqual(i, -1, `falta la línea: ${line}`);
    return i;
  };
  assert.ok(!batch.includes('.htaccess'), '.htaccess no debe viajar desde dist/');
  assert.ok(at('-mkdir blog') < at('-mkdir blog/x'), 'los directorios padre van primero');
  assert.ok(at('-mkdir blog/x') < at('put blog/x/index.html blog/x/index.html'), 'mkdir antes del put');
  assert.ok(at('put og.png og.png') < at('put index.html index.html'), 'el HTML se sube al final');
  console.log('deploy self-test ok');
}

if (process.argv.includes('--self-test')) {
  selfTest();
} else {
  if (!existsSync(DIST)) {
    console.error('No hay dist/. Corre `npm run build` primero.');
    process.exit(1);
  }
  const paths = walk(DIST);
  if (paths.includes('.htaccess')) {
    console.error('nota: dist/.htaccess no se sube. Si cambiaron las redirecciones, súbelo a mano');
    console.error('      con el bloque PHP de cPanel ya mezclado (ver README).\n');
  }
  const batch = buildBatch(paths);
  console.log(batch);
  if (!process.argv.includes('--dry-run')) {
    const r = spawnSync('sftp', ['-i', KEY, '-b', '-', HOST], { input: batch, stdio: ['pipe', 'inherit', 'inherit'] });
    process.exit(r.status ?? 1);
  }
}
