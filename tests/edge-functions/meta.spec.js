import { describe, expect, it } from 'vitest';
import {
    buildAreaPageMeta,
    buildSpotDetailMeta,
} from '../../netlify/edge-functions/lib/meta.js';

describe('buildAreaPageMeta', () => {
    it('builds a rich title and description for a known area', () => {
        const url = new URL('https://www.parkspot.in/bangalore/parking-near-marathahalli/');
        const meta = buildAreaPageMeta(url, null);

        expect(meta.title).toContain('Marathahalli');
        expect(meta.title).toContain('Bengaluru');
        expect(meta.title).toContain('ParkSpot');
        expect(meta.description).toContain('Marathahalli');
        expect(meta.description).toContain('Bengaluru');
        expect(meta.canonical).toBe(
            'https://www.parkspot.in/bangalore/parking-near-marathahalli/',
        );
        expect(meta.ogUrl).toBe(meta.canonical);
        expect(meta.jsonLd['@type']).toBe('Place');
    });

    it('normalizes multi-word area slugs into a display name', () => {
        const url = new URL('https://www.parkspot.in/bangalore/parking-near-hsr-layout');
        const meta = buildAreaPageMeta(url, null);
        expect(meta.title).toContain('HSR Layout');
        expect(meta.h1).toContain('HSR Layout');
    });

    it('incorporates a live site count when enhancement data is present', () => {
        const url = new URL('https://www.parkspot.in/bangalore/parking-near-marathahalli/');
        const meta = buildAreaPageMeta(url, { sitesCount: 4 });
        expect(meta.description).toMatch(/4 verified parking spots available/);
    });

    it('handles hyderabad city prefix', () => {
        const url = new URL('https://www.parkspot.in/hyderabad/parking-near-gachibowli/');
        const meta = buildAreaPageMeta(url, null);
        expect(meta.title).toContain('Hyderabad');
        expect(meta.title).toContain('Gachibowli');
    });
});

describe('buildSpotDetailMeta', () => {
    it('decodes %23 in the spot id and extracts city / number', () => {
        const url = new URL('https://www.parkspot.in/spot-details/HYD%23REQ%23104');
        const meta = buildSpotDetailMeta(url, null);

        expect(meta.title).toContain('#104');
        expect(meta.title).toContain('Hyderabad');
        expect(meta.description).toContain('Hyderabad');
        expect(meta.canonical).toBe(
            'https://www.parkspot.in/spot-details/HYD%23REQ%23104',
        );
        expect(meta.jsonLd['@type']).toBe('ParkingFacility');
        expect(meta.jsonLd.identifier).toBe('HYD#REQ#104');
    });

    it('handles Bengaluru spot ids', () => {
        const url = new URL('https://www.parkspot.in/spot-details/BLR%23REQ%23806');
        const meta = buildSpotDetailMeta(url, null);
        expect(meta.title).toContain('Bengaluru');
        expect(meta.title).toContain('#806');
    });

    it('falls back gracefully on unrecognized city codes', () => {
        const url = new URL('https://www.parkspot.in/spot-details/ZZZ%23REQ%23999');
        const meta = buildSpotDetailMeta(url, null);
        expect(meta.title).toContain('ParkSpot');
        expect(meta.canonical).toBe(
            'https://www.parkspot.in/spot-details/ZZZ%23REQ%23999',
        );
    });

    it('uses the real spot name when enhancement is supplied', () => {
        const url = new URL('https://www.parkspot.in/spot-details/BLR%23GS%23Mansion%232');
        const meta = buildSpotDetailMeta(url, {
            name: 'G.S. Mansion Parking',
            address: 'Marathahalli, Bengaluru',
            rate: 2500,
        });
        expect(meta.title).toContain('G.S. Mansion Parking');
        expect(meta.description).toContain('Marathahalli, Bengaluru');
        expect(meta.description).toContain('₹2,500');
        expect(meta.jsonLd.priceRange).toBe('₹2,500/month');
    });
});
