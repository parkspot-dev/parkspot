import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
    captureFromUrl,
    getStored,
    readStored,
    writeStored,
    getUtmParams,
    formatRemarkWithUtm,
} from '@/lib/analytics/attribution.js';

const STORAGE_KEY = 'parkspot_attrib';
const GCLID_COOKIE = 'parkspot_gclid';

function clearAllCookies() {
    if (!document.cookie) return;
    for (const raw of document.cookie.split(';')) {
        const name = raw.trim().split('=')[0];
        if (!name) continue;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
}

function setLocation(search) {
    // jsdom lets you reassign location.search.
    window.history.replaceState({}, '', `/${search ? '?' + search : ''}`);
}

describe('analytics/attribution', () => {
    beforeEach(() => {
        sessionStorage.clear();
        clearAllCookies();
        setLocation('');
    });

    afterEach(() => {
        sessionStorage.clear();
        clearAllCookies();
        setLocation('');
    });

    describe('captureFromUrl()', () => {
        it('captures gclid + utm params and writes them to sessionStorage', () => {
            setLocation(
                'gclid=ABC123&utm_source=google&utm_medium=cpc&utm_campaign=jun',
            );
            const result = captureFromUrl();
            expect(result).toMatchObject({
                gclid: 'ABC123',
                utm_source: 'google',
                utm_medium: 'cpc',
                utm_campaign: 'jun',
            });
            expect(
                JSON.parse(sessionStorage.getItem(STORAGE_KEY)),
            ).toMatchObject({
                gclid: 'ABC123',
                utm_source: 'google',
            });
        });

        it('writes a parkspot_gclid cookie when gclid is present', () => {
            setLocation('gclid=COOKIE_GCLID');
            captureFromUrl();
            expect(document.cookie).toContain(`${GCLID_COOKIE}=COOKIE_GCLID`);
        });

        it('does NOT write a gclid cookie when only utm_* are present', () => {
            setLocation('utm_source=fb&utm_medium=cpc');
            captureFromUrl();
            expect(document.cookie).not.toContain(GCLID_COOKIE);
        });

        it('preserves prior values when a new landing carries only utm_*', () => {
            // First landing — has gclid.
            setLocation('gclid=KEEP_ME&utm_source=google');
            captureFromUrl();
            // Second landing — same session, only utm_* (different campaign).
            setLocation('utm_source=fb');
            captureFromUrl();
            const merged = getStored();
            expect(merged.gclid).toBe('KEEP_ME');
            // utm_source overwrites — last touch wins for utm.
            expect(merged.utm_source).toBe('fb');
        });

        it('returns existing stored attribution when URL has no params', () => {
            writeStored({ gclid: 'OLD' });
            const result = captureFromUrl();
            expect(result).toMatchObject({ gclid: 'OLD' });
        });

        it('ignores unrelated query params', () => {
            setLocation('gclid=Y&foo=bar&utm_source=g');
            captureFromUrl();
            const stored = readStored();
            expect(stored).not.toHaveProperty('foo');
            expect(stored.gclid).toBe('Y');
        });
    });

    describe('getStored()', () => {
        it('returns empty object when nothing is stored', () => {
            expect(getStored()).toEqual({});
        });

        it('returns sessionStorage values', () => {
            writeStored({ utm_source: 'google', utm_campaign: 'x' });
            expect(getStored()).toEqual({
                utm_source: 'google',
                utm_campaign: 'x',
            });
        });

        it('cookie gclid wins over sessionStorage gclid', () => {
            writeStored({ gclid: 'SESSION_VALUE', utm_source: 's' });
            // Set the cookie directly.
            document.cookie = `${GCLID_COOKIE}=COOKIE_VALUE; path=/`;
            const stored = getStored();
            expect(stored.gclid).toBe('COOKIE_VALUE');
            // Other params survive the merge.
            expect(stored.utm_source).toBe('s');
        });
    });

    describe('writeStored() / readStored()', () => {
        it('round-trips an attribution object', () => {
            writeStored({ utm_source: 'a', utm_medium: 'b' });
            expect(readStored()).toEqual({ utm_source: 'a', utm_medium: 'b' });
        });

        it('readStored returns null when storage is empty', () => {
            expect(readStored()).toBeNull();
        });

        it('readStored returns null for malformed JSON', () => {
            sessionStorage.setItem(STORAGE_KEY, '{not json}');
            expect(readStored()).toBeNull();
        });
    });

    describe('getUtmParams()', () => {
        it('reads utm_campaign, utm_content, and utm_source from URL query first', () => {
            setLocation(
                'utm_campaign=summer_sale&utm_content=banner_ad&utm_source=google',
            );
            const result = getUtmParams();
            expect(result).toEqual({
                utmCampaign: 'summer_sale',
                utmContent: 'banner_ad',
                utmSource: 'google',
            });
        });

        it('supports utm_campion and utm_contend spelling variations', () => {
            setLocation('utm_campion=summer_sale&utm_contend=banner_ad');
            const result = getUtmParams();
            expect(result).toEqual({
                utmCampaign: 'summer_sale',
                utmContent: 'banner_ad',
                utmSource: '',
            });
        });

        it('falls back to stored attribution when query is empty', () => {
            writeStored({
                utm_campaign: 'fall_promo',
                utm_content: 'sidebar_link',
            });
            const result = getUtmParams();
            expect(result).toEqual({
                utmCampaign: 'fall_promo',
                utmContent: 'sidebar_link',
                utmSource: '',
            });
        });

        it('prioritizes query over stored attribution', () => {
            writeStored({ utm_campaign: 'old_campaign' });
            setLocation('utm_campaign=new_campaign');
            const result = getUtmParams();
            expect(result.utmCampaign).toBe('new_campaign');
        });
    });

    describe('formatRemarkWithUtm()', () => {
        it('returns existing remark when no UTM params present', () => {
            expect(formatRemarkWithUtm('Existing remark')).toBe(
                'Existing remark',
            );
        });

        it('appends UTM params to existing remark on new lines with brackets', () => {
            setLocation(
                'utm_campaign=my_campaign&utm_content=my_content&utm_source=google',
            );
            expect(formatRemarkWithUtm('My remark')).toBe(
                'My remark\n[utm_campaign]: my_campaign\n[utm_content]: my_content\n[utm_source]: google',
            );
        });

        it('returns formatted UTM params when no existing remark', () => {
            setLocation(
                'utm_campaign=my_campaign&utm_content=my_content&utm_source=google',
            );
            expect(formatRemarkWithUtm('')).toBe(
                '[utm_campaign]: my_campaign\n[utm_content]: my_content\n[utm_source]: google',
            );
        });
    });
});
