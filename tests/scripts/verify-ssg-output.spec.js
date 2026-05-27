import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { verifySsgOutput } from '../../scripts/verify-ssg-output.js';

const HTML_OK = `
<!DOCTYPE html>
<html>
  <head><title>About | ParkSpot</title></head>
  <body>
    <div id="app"><h1>Hello</h1></div>
  </body>
</html>
`;

const HTML_EMPTY_APP = `
<!DOCTYPE html>
<html>
  <head><title>x</title></head>
  <body>
    <div id="app"></div>
  </body>
</html>
`;

describe('scripts/verify-ssg-output', () => {
    let tmpDir;

    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-ssg-'));
    });

    afterEach(() => {
        if (tmpDir && fs.existsSync(tmpDir)) {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
    });

    function writeHtml(rel, body) {
        const full = path.join(tmpDir, rel);
        fs.mkdirSync(path.dirname(full), { recursive: true });
        fs.writeFileSync(full, body, 'utf8');
    }

    it('reports OK when all required files match', () => {
        writeHtml('index.html', HTML_OK);
        const results = verifySsgOutput({
            distDir: tmpDir,
            spec: [
                {
                    file: 'index.html',
                    mustMatch: [/<div id="app">/, /<title>.+<\/title>/],
                    mustNotMatch: [/<div id="app"><\/div>/],
                },
            ],
        });
        expect(results).toEqual([
            { file: 'index.html', ok: true, reasons: [] },
        ]);
    });

    it('flags a missing file', () => {
        const results = verifySsgOutput({
            distDir: tmpDir,
            spec: [
                {
                    file: 'about/index.html',
                    mustMatch: [/<title>/],
                },
            ],
        });
        expect(results[0].ok).toBe(false);
        expect(results[0].reasons[0]).toMatch(/missing file/);
    });

    it('flags an empty <div id="app"></div> as a regression', () => {
        writeHtml('index.html', HTML_EMPTY_APP);

        const results = verifySsgOutput({
            distDir: tmpDir,
            spec: [
                {
                    file: 'index.html',
                    mustMatch: [/<title>.+<\/title>/],
                    mustNotMatch: [/<div id="app"><\/div>/],
                },
            ],
        });
        expect(results[0].ok).toBe(false);
        expect(results[0].reasons.some((r) =>
            r.includes('expected NOT to match'),
        )).toBe(true);
    });

    it('flags a file that misses a required pattern', () => {
        writeHtml('index.html', '<html><body>no title</body></html>');
        const results = verifySsgOutput({
            distDir: tmpDir,
            spec: [
                {
                    file: 'index.html',
                    mustMatch: [/<title>.+<\/title>/],
                },
            ],
        });
        expect(results[0].ok).toBe(false);
        expect(results[0].reasons[0]).toMatch(/expected to match/);
    });
});
