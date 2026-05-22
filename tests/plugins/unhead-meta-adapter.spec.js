// Unit tests for `resolveTitle` and `buildHeadPayload` — the
// vue-meta → @unhead/vue bridge. Functions are exposed via the
// `__test__` export so we can exercise the orphan-suffix guard
// (Phase 2.5) and the sibling-collision guard (Phase 2.5b) without
// having to stand up a full Vue render tree.
//
// See ssg-research/04-integration-plan.md § Phase 2.5 / 2.5b.
import { describe, it, expect } from 'vitest';
import { __test__ } from '@/plugins/unhead-meta-adapter.js';

const { resolveTitle, buildHeadPayload } = __test__;

describe('resolveTitle', () => {
    describe('plain title (no template)', () => {
        it('returns the title verbatim', () => {
            expect(resolveTitle({ title: 'About | ParkSpot' })).toBe(
                'About | ParkSpot',
            );
        });

        // Phase 2.5b: nullish title with no template = no contribution.
        // Returning `undefined` (rather than `''`) lets the
        // payload-builder omit the `title` key entirely, so earlier
        // useHead entries (parent / index.html shell) stand.
        it('returns undefined for nullish title with no template', () => {
            expect(resolveTitle({ title: null })).toBeUndefined();
            expect(resolveTitle({ title: undefined })).toBeUndefined();
            expect(resolveTitle({})).toBeUndefined();
        });

        it('returns undefined for empty / whitespace title with no template', () => {
            expect(resolveTitle({ title: '' })).toBeUndefined();
            expect(resolveTitle({ title: '   \t\n' })).toBeUndefined();
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

        it('returns undefined when a throwing template wraps an empty title', () => {
            // Failsafe: a throwing template with no usable title
            // should still abstain rather than emit an empty string.
            expect(
                resolveTitle({
                    title: '',
                    titleTemplate: () => {
                        throw new Error('boom');
                    },
                }),
            ).toBeUndefined();
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

        // PRIMARY REGRESSION (Phase 2.5): the user-reported bug where the
        // document <title> rendered as `'ParkSpot | '` on /srp and other
        // pages whose `title` was undefined / empty when metaInfo() ran.
        it('returns undefined (no-op) when title is undefined and template has %s', () => {
            expect(
                resolveTitle({
                    title: undefined,
                    titleTemplate: 'ParkSpot | %s',
                }),
            ).toBeUndefined();
        });

        it('returns undefined when title is the empty string', () => {
            expect(
                resolveTitle({ title: '', titleTemplate: 'ParkSpot | %s' }),
            ).toBeUndefined();
        });

        it('returns undefined when title is whitespace-only', () => {
            expect(
                resolveTitle({
                    title: '   \t\n',
                    titleTemplate: 'ParkSpot | %s',
                }),
            ).toBeUndefined();
        });

        it('returns undefined for null + template (legacy SRP shape)', () => {
            // PageSrp pre-fix: { title: this.title /* undefined */,
            //   titleTemplate: PAGE_TITLE.SEARCH + '%s' } i.e.
            //   'ParkSpot | %s' applied to undefined → must NOT render
            //   'ParkSpot | '.
            expect(
                resolveTitle({
                    title: null,
                    titleTemplate: 'ParkSpot | %s',
                }),
            ).toBeUndefined();
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
});

describe('buildHeadPayload', () => {
    // Phase 2.5b regression: when a component declares metaInfo() but
    // has no title to express, the `title` key MUST be absent from the
    // useHead payload. Otherwise sibling components' titles (e.g. the
    // homepage <PageHome> hosting <TemplateContactUs> et al.) get
    // clobbered with the empty string by @unhead's last-wins ordering.
    it('omits the `title` key when there is no title to express', () => {
        const payload = buildHeadPayload({});
        expect(payload).not.toHaveProperty('title');
    });

    it('omits the `title` key for orphan template substitution', () => {
        const payload = buildHeadPayload({
            title: undefined,
            titleTemplate: 'ParkSpot | %s',
        });
        expect(payload).not.toHaveProperty('title');
    });

    it('includes the resolved title when metaInfo provides one', () => {
        const payload = buildHeadPayload({
            title: 'Homepage Banner',
        });
        expect(payload.title).toBe('Homepage Banner');
    });

    it('passes through meta / link / script arrays verbatim', () => {
        const meta = [{ name: 'description', content: 'x' }];
        const link = [{ rel: 'canonical', href: '/' }];
        const script = [{ type: 'application/ld+json', children: '{}' }];
        const payload = buildHeadPayload({ title: 't', meta, link, script });
        expect(payload.meta).toBe(meta);
        expect(payload.link).toBe(link);
        expect(payload.script).toBe(script);
    });

    it('coerces non-array meta / link / script inputs to empty arrays', () => {
        // Failsafe: a malformed metaInfo() output must not poison the
        // payload shape. The bridge has always normalised to arrays;
        // keep that contract.
        const payload = buildHeadPayload({
            title: 't',
            meta: undefined,
            link: null,
            script: 'oops',
        });
        expect(payload.meta).toEqual([]);
        expect(payload.link).toEqual([]);
        expect(payload.script).toEqual([]);
    });
});
