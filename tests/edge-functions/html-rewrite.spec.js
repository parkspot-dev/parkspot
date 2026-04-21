import { describe, expect, it } from 'vitest';
import { applyMetaToHtml } from '../../netlify/edge-functions/lib/html-rewrite.js';

const FIXTURE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <title>
        Find and Book parking spaces nearby | Bangalore Delhi Mumbai Pune Bengaluru | Parkspot.in
    </title>
    <meta name="description" content="Book a secure parking spot for short or long term" />
    <meta data-rh="true" property="og:description" content="Existing OG description" />
    <meta data-rh="true" property="og:type" content="website" />
    <link rel="icon" href="/favicon.ico" />
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness"}</script>
</head>
<body>
    <div id="app"></div>
</body>
</html>`;

const META = {
    title: 'Car Parking near Marathahalli, Bengaluru — Book Online | ParkSpot',
    description: 'Find and book secure monthly car parking near Marathahalli, Bengaluru.',
    canonical: 'https://www.parkspot.in/bangalore/parking-near-marathahalli/',
    ogTitle: 'Car Parking near Marathahalli, Bengaluru',
    ogDescription: 'Find and book secure monthly car parking near Marathahalli, Bengaluru.',
    ogUrl: 'https://www.parkspot.in/bangalore/parking-near-marathahalli/',
    ogImage: 'https://www.parkspot.in/assets/og/og-default.jpg',
    ogType: 'website',
    h1: 'Car Parking near Marathahalli, Bengaluru',
    jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Place',
        'name': 'Parking near Marathahalli, Bengaluru',
    },
};

describe('applyMetaToHtml', () => {
    it('replaces the existing <title>', () => {
        const out = applyMetaToHtml(FIXTURE_HTML, META);
        expect(out).toContain(
            '<title>Car Parking near Marathahalli, Bengaluru — Book Online | ParkSpot</title>',
        );
        expect(out).not.toContain('Find and Book parking spaces nearby |');
    });

    it('replaces the existing meta description', () => {
        const out = applyMetaToHtml(FIXTURE_HTML, META);
        expect(out).toContain(
            '<meta name="description" content="Find and book secure monthly car parking near Marathahalli, Bengaluru."',
        );
        expect(out).not.toContain('content="Book a secure parking spot for short or long term"');
    });

    it('replaces existing og:description even when data-rh attribute is present', () => {
        const out = applyMetaToHtml(FIXTURE_HTML, META);
        expect(out).toContain('property="og:description"');
        expect(out).not.toContain('"Existing OG description"');
    });

    it('inserts a canonical link when one is missing', () => {
        const out = applyMetaToHtml(FIXTURE_HTML, META);
        expect(out).toContain(
            '<link rel="canonical" href="https://www.parkspot.in/bangalore/parking-near-marathahalli/">',
        );
    });

    it('appends a JSON-LD script before </head>', () => {
        const out = applyMetaToHtml(FIXTURE_HTML, META);
        expect(out).toContain('data-nr-seo="route"');
        expect(out).toContain('"Place"');
        // Original LocalBusiness JSON-LD must remain untouched.
        expect(out).toContain('"LocalBusiness"');
    });

    it('returns the input unchanged when </head> is missing', () => {
        const notShell = '<html><body>hi</body></html>';
        expect(applyMetaToHtml(notShell, META)).toBe(notShell);
    });

    it('returns the input unchanged on malformed input', () => {
        expect(applyMetaToHtml('', META)).toBe('');
        expect(applyMetaToHtml(null, META)).toBe(null);
    });

    it('escapes HTML-sensitive characters in meta content', () => {
        const out = applyMetaToHtml(FIXTURE_HTML, {
            ...META,
            description: 'Parking & more <script>alert(1)</script>',
        });
        expect(out).toContain('Parking &amp; more &lt;script&gt;alert(1)&lt;/script&gt;');
        expect(out).not.toContain('<script>alert(1)</script>');
    });
});
