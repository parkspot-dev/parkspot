import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

vi.mock('@/utils/seo/rtdb-build.js', () => ({
    fetchAllSeoSlugs: vi.fn(),
}));

// The script lives under repo/scripts and imports from `../src/...`. We mock
// the slug fetcher to keep the test offline and deterministic.
import { fetchAllSeoSlugs } from '@/utils/seo/rtdb-build.js';
import {
    buildUrlEntry,
    buildSitemapXml,
    STATIC_PATHS,
    generateSitemap,
} from '../../scripts/generate-sitemap.js';

describe('scripts/generate-sitemap', () => {
    let tmpDir;

    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sitemap-test-'));
        vi.clearAllMocks();
    });

    afterEach(() => {
        if (tmpDir && fs.existsSync(tmpDir)) {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
    });

    describe('buildUrlEntry', () => {
        it('emits a <url><loc>...</loc></url> with the canonical origin', () => {
            expect(buildUrlEntry('/about/')).toBe(
                '<url><loc>https://www.parkspot.in/about/</loc></url>',
            );
        });

        it('rejects paths that do not start with "/"', () => {
            expect(() => buildUrlEntry('about/')).toThrow(
                /absolute path starting with "\/"/,
            );
        });

        it('xml-encodes ampersands and angle brackets inside the path', () => {
            expect(buildUrlEntry('/foo?a=1&b=2')).toContain('&amp;');
        });
    });

    describe('buildSitemapXml', () => {
        it('wraps entries in a urlset and an XML prolog', () => {
            const xml = buildSitemapXml(['/about/']);
            expect(xml).toMatch(/^<\?xml version="1\.0"/);
            expect(xml).toContain(
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            );
            expect(xml).toContain('<url><loc>https://www.parkspot.in/about/</loc></url>');
            expect(xml.trim().endsWith('</urlset>')).toBe(true);
        });
    });

    describe('STATIC_PATHS', () => {
        it('does not advertise any auth-gated paths', () => {
            for (const p of STATIC_PATHS) {
                expect(p.startsWith('/internal/')).toBe(false);
                expect(p.startsWith('/payment/')).toBe(false);
                expect(p.startsWith('/profile/')).toBe(false);
            }
        });

        it('always lists the homepage', () => {
            expect(STATIC_PATHS).toContain('/');
        });
    });

    describe('generateSitemap', () => {
        it('writes sitemap.xml combining static + dynamic area paths', async () => {
            fetchAllSeoSlugs.mockResolvedValue({
                bangalore: ['marathahalli', 'btm'],
                hyderabad: ['hyderabad'],
            });

            const { outPath, count } = await generateSitemap({
                distDir: tmpDir,
            });

            expect(outPath).toBe(path.join(tmpDir, 'sitemap.xml'));
            const xml = fs.readFileSync(outPath, 'utf8');

            // every static path is present
            for (const p of STATIC_PATHS) {
                expect(xml).toContain(
                    `<url><loc>https://www.parkspot.in${p}</loc></url>`,
                );
            }

            // dynamic area paths are wired up
            expect(xml).toContain(
                '<url><loc>https://www.parkspot.in/bangalore/parking-near-marathahalli/</loc></url>',
            );
            expect(xml).toContain(
                '<url><loc>https://www.parkspot.in/hyderabad/parking-near-hyderabad/</loc></url>',
            );

            expect(count).toBe(STATIC_PATHS.length + 3);
        });

        it('propagates RTDB failures so CI catches them', async () => {
            fetchAllSeoSlugs.mockRejectedValue(new Error('boom'));
            await expect(
                generateSitemap({ distDir: tmpDir }),
            ).rejects.toThrow(/boom/);
        });
    });
});
