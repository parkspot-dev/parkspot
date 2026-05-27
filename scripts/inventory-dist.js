// Lists every HTML file produced by `vite-ssg build`. Invoked from the
// `ssg-preview` workflow purely as an observability aid — surfaces the
// generated route count and per-file paths in CI logs so reviewers can
// confirm at a glance which URLs were prerendered.

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const DIST_DIR = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    'dist',
);

function walk(dir) {
    const out = [];
    if (!fs.existsSync(dir)) {
        return out;
    }
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            out.push(...walk(full));
        } else if (name.endsWith('.html')) {
            out.push(full);
        }
    }
    return out;
}

const files = walk(DIST_DIR).sort();
for (const f of files) {
    // eslint-disable-next-line no-console
    console.log(path.relative(DIST_DIR, f));
}
// eslint-disable-next-line no-console
console.log(`---`);
// eslint-disable-next-line no-console
console.log(`total: ${files.length} HTML files`);

if (files.length === 0) {
    // eslint-disable-next-line no-console
    console.error('[inventory-dist] no HTML produced');
    process.exit(1);
}
