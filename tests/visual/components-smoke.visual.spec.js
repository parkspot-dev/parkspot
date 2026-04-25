// Auto-discovery visual smoke spec.
//
// import.meta.glob() is Vite's compile-time directory expansion:
// every match is a real lazy import. We register one Vitest test per
// .vue file under src/components/** and src/views/**, mount it with
// the permissive helpers from ./test-helpers.js, and write a baseline
// PNG. Subsequent runs fail fast on any pixel diff above the
// configured threshold.
//
// Why one harness instead of one spec per component: 143 hand-written
// specs would mean 143 places to keep stub configs in sync the next
// time we add a new design-system primitive. Centralising it means
// 100% of components opt in to visual coverage by default; opting out
// happens through the explicit skip-list (./skip-list.js).
//
// On a mount failure: the test fails LOUDLY (not silently). That is
// deliberate -- a component that cannot mount blindly with empty
// props is a real concern (likely a missing prop default) and the
// resulting test name in CI tells you exactly which file to fix or
// add to the skip-list with a reason.

import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import { renderOptions, tick } from './test-helpers.js';
import { skipReason } from './skip-list.js';

// Map atomic-design folders to display names. Atoms / molecules /
// organisms / templates split because they tend to fail (or pass) for
// distinct reasons; grouping makes the run report easier to read.
const SETS = {
    atoms:           import.meta.glob('/src/components/atoms/**/*.vue'),
    molecules:       import.meta.glob('/src/components/molecules/**/*.vue'),
    organisms:       import.meta.glob('/src/components/organisms/**/*.vue'),
    templates:       import.meta.glob('/src/components/templates/**/*.vue'),
    extras:          import.meta.glob('/src/components/extras/**/*.vue'),
    'global':        import.meta.glob('/src/components/global/**/*.vue'),
    'vo-portal':     import.meta.glob('/src/components/vo-portal/**/*.vue'),
    'so-portal':     import.meta.glob('/src/components/so-portal/**/*.vue'),
    'search-portal': import.meta.glob('/src/components/search-portal/**/*.vue'),
    'booking-portal':import.meta.glob('/src/components/booking-portal/**/*.vue'),
    'my-bookings':   import.meta.glob('/src/components/my-bookings/**/*.vue'),
    views:           import.meta.glob('/src/views/**/*.vue'),
};

function shortName(filePath) {
    return filePath.split('/').pop().replace(/\.vue$/, '');
}

for (const [setName, files] of Object.entries(SETS)) {
    const entries = Object.entries(files);
    if (entries.length === 0) continue;

    describe(`visual / ${setName}`, () => {
        for (const [filePath, loader] of entries) {
            const name = shortName(filePath);
            const reason = skipReason(filePath);

            if (reason) {
                test.skip(`${name} — skipped (${reason})`, () => {});
                continue;
            }

            test(name, async () => {
                const mod = await loader();
                const Component = mod.default ?? mod;
                if (!Component) {
                    throw new Error(`No default export from ${filePath}`);
                }

                const screen = render(Component, renderOptions());
                await tick();

                await expect.element(screen.baseElement)
                    .toMatchScreenshot(`${setName}__${name}`);
            });
        }
    });
}
