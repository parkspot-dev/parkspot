import { describe, expect, it } from 'vitest';
import { metaPayloadToHead } from '../../src/utils/seo/to-head.js';
import {
    buildAreaPageMeta,
    buildSpotDetailMeta,
} from '../../src/utils/seo/meta.js';

describe('metaPayloadToHead', () => {
    it('returns empty shape when given null', () => {
        const head = metaPayloadToHead(null);
        expect(head).toEqual({ title: '', meta: [], link: [], script: [] });
    });

    it('translates an area-page payload into a full head block', () => {
        const url = new URL('https://www.parkspot.in/bangalore/parking-near-marathahalli/');
        const payload = buildAreaPageMeta(url, { sitesCount: 3 });
        const head = metaPayloadToHead(payload);

        expect(head.title).toBe(payload.title);

        const byName = Object.fromEntries(
            head.meta.filter((t) => t.name).map((t) => [t.name, t.content]),
        );
        const byProperty = Object.fromEntries(
            head.meta.filter((t) => t.property).map((t) => [t.property, t.content]),
        );
        expect(byName.description).toBe(payload.description);
        expect(byProperty['og:title']).toBe(payload.ogTitle);
        expect(byProperty['og:description']).toBe(payload.ogDescription);
        expect(byProperty['og:url']).toBe(payload.ogUrl);
        expect(byProperty['og:image']).toBe(payload.ogImage);
        expect(byProperty['og:type']).toBe(payload.ogType);

        expect(head.link).toEqual([
            { rel: 'canonical', href: payload.canonical, key: 'canonical' },
        ]);

        expect(head.script).toHaveLength(1);
        expect(head.script[0].type).toBe('application/ld+json');
        expect(head.script[0].key).toBe('seo-jsonld');
        expect(head.script[0]['data-nr-seo']).toBe('route');
        expect(JSON.parse(head.script[0].innerHTML)).toMatchObject({
            '@type': 'Place',
            'url': payload.canonical,
        });
    });

    it('translates a spot-detail payload with an enhancement', () => {
        const url = new URL('https://www.parkspot.in/spot-details/BLR%23GS%23Mansion%232');
        const payload = buildSpotDetailMeta(url, {
            name: 'G.S. Mansion Parking',
            address: 'Marathahalli, Bengaluru',
            rate: 2500,
        });
        const head = metaPayloadToHead(payload);

        expect(head.title).toContain('G.S. Mansion Parking');
        expect(head.link[0]).toMatchObject({ rel: 'canonical' });
        const jsonLd = JSON.parse(head.script[0].innerHTML);
        expect(jsonLd['@type']).toBe('ParkingFacility');
        expect(jsonLd.priceRange).toBe('₹2,500/month');
    });

    it('skips optional tags when the payload omits them', () => {
        const head = metaPayloadToHead({
            title: 'Just A Title',
            description: '',
            canonical: '',
            jsonLd: null,
        });
        expect(head.title).toBe('Just A Title');
        expect(head.meta).toEqual([]);
        expect(head.link).toEqual([]);
        expect(head.script).toEqual([]);
    });
});
