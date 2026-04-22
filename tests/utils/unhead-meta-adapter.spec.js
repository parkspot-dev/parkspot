import { describe, expect, it, vi } from 'vitest';

// The adapter imports @unhead/vue at module load. That package is not
// available under vitest without a real install, so we stub it with a
// lightweight fake whose useHead() simply stores the last value and
// re-invokes the getter on demand.
vi.mock('@unhead/vue', () => {
    const calls = [];
    return {
        useHead: (source) => {
            calls.push(source);
        },
        __calls: calls,
    };
});

const { __test__ } = await import('../../src/plugins/unhead-meta-adapter.js');
const { resolveTitle } = __test__;

describe('resolveTitle', () => {
    it('returns "" when title and template are missing', () => {
        expect(resolveTitle({})).toBe('');
    });

    it('returns the plain title when no template is present', () => {
        expect(resolveTitle({ title: 'Hello' })).toBe('Hello');
    });

    it('substitutes "%s" in a string template', () => {
        expect(
            resolveTitle({ title: 'Home', titleTemplate: 'ParkSpot - %s' }),
        ).toBe('ParkSpot - Home');
    });

    it('uses a function template when provided', () => {
        expect(
            resolveTitle({
                title: 'About',
                titleTemplate: (t) => `[${t}] ParkSpot`,
            }),
        ).toBe('[About] ParkSpot');
    });

    it('coerces null / undefined titles to an empty string', () => {
        expect(resolveTitle({ title: null, titleTemplate: 'ParkSpot - %s' }))
            .toBe('ParkSpot - ');
        expect(resolveTitle({ title: undefined, titleTemplate: 'Fixed' }))
            .toBe('Fixed');
    });
});
