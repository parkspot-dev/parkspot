// Unit tests for `resolveTitle` — the title-template parser used by
// the vue-meta → @unhead/vue bridge. The function is exposed via the
// `__test__` export specifically so we can exercise the orphan-suffix
// guard documented in `ssg-research/04-integration-plan.md § Phase 2.5`
// (and the production-checklist Phase 2.5 acceptance check) without
// having to stand up a full Vue render tree.
import { describe, it, expect } from 'vitest';
import { __test__ } from '@/plugins/unhead-meta-adapter.js';

const { resolveTitle } = __test__;

describe('resolveTitle', () => {
    describe('plain title (no template)', () => {
        it('returns the title verbatim', () => {
            expect(resolveTitle({ title: 'About | ParkSpot' })).toBe(
                'About | ParkSpot',
            );
        });

        it('returns "" for nullish title', () => {
            expect(resolveTitle({ title: null })).toBe('');
            expect(resolveTitle({ title: undefined })).toBe('');
        });

        it('coerces non-string titles to string', () => {
            expect(resolveTitle({ title: 42 })).toBe('42');
        });
    });

    describe('function template', () => {
        it('passes the resolved title into the function', () => {
            expect(
                resolveTitle({
                    title: 'About',
                    titleTemplate: (t) => `${t} — ParkSpot`,
                }),
            ).toBe('About — ParkSpot');
        });

        it('falls back to the raw title if the template throws', () => {
            expect(
                resolveTitle({
                    title: 'About',
                    titleTemplate: () => {
                        throw new Error('boom');
                    }, 
                }),
            ).toBe('About');
        });
    });

    describe('string template — %s substitution (Phase 2.5 hardening)', () => {
        it('substitutes %s with the title when title is non-empty', () => {
            expect(
                resolveTitle({
                    title: 'About',
                    titleTemplate: 'ParkSpot | %s',
                }),
            ).toBe('ParkSpot | About');
        });

        // PRIMARY REGRESSION: the user-reported bug where the document
        // <title> rendered as `'ParkSpot | '` on /srp and other pages
        // whose `title` was undefined / empty when metaInfo() ran.
        it('returns "" (no-op) when title is undefined and template has %s', () => {
            expect(
                resolveTitle({
                    title: undefined,
                    titleTemplate: 'ParkSpot | %s',
                }),
            ).toBe('');
        });

        it('returns "" when title is the empty string', () => {
            expect(
                resolveTitle({ title: '', titleTemplate: 'ParkSpot | %s' }),
            ).toBe('');
        });

        it('returns "" when title is whitespace-only', () => {
            expect(
                resolveTitle({
                    title: '   \t\n',
                    titleTemplate: 'ParkSpot | %s',
                }),
            ).toBe('');
        });

        it('returns "" for null + template (legacy SRP shape)', () => {
            // PageSrp pre-fix: { title: this.title /* undefined */,
            //   titleTemplate: PAGE_TITLE.SEARCH + '%s' } i.e.
            //   'ParkSpot | %s' applied to undefined → must NOT render
            //   'ParkSpot | '.
            expect(
                resolveTitle({
                    title: null,
                    titleTemplate: 'ParkSpot | %s',
                }),
            ).toBe('');
        });

        it('still substitutes for templates whose static suffix is non-empty', () => {
            // Sanity: the no-%s branch must keep returning the template
            // verbatim. Only the %s branch is hardened.
            expect(
                resolveTitle({
                    title: '',
                    titleTemplate: 'ParkSpot — Find & Book Parking',
                }),
            ).toBe('ParkSpot — Find & Book Parking');
        });
    });

    describe('no template + nullish title', () => {
        it('returns "" so @unhead leaves the document title alone', () => {
            // Empty string is @unhead's "no change" signal; this means
            // the index.html shell title (or the previously-rendered
            // title) stays intact rather than getting clobbered.
            expect(resolveTitle({})).toBe('');
            expect(resolveTitle({ title: null })).toBe('');
        });
    });
});
