// The filter returned by createErrorFilter() runs inside the agent for
// every error about to be recorded: truthy drops it, `{ group }`
// fingerprints it, falsy records it unchanged.
import { describe, expect, it } from 'vitest';
import {
    RATE_LIMIT,
    RATE_WINDOW_MS,
    createErrorFilter,
} from '@/telemetry/error-filter.js';

const error = (message, extra = {}) => Object.assign(new Error(message), extra);

describe('createErrorFilter()', () => {
    it('defaults to 20 reports per message per minute', () => {
        expect(RATE_LIMIT).toBe(20);
        expect(RATE_WINDOW_MS).toBe(60000);
    });

    it.each([undefined, null, 'Script error.', 42])(
        'records non-object input %o as is',
        (input) => {
            expect(createErrorFilter()(input)).toBe(false);
        },
    );

    it('records ordinary errors unchanged', () => {
        expect(createErrorFilter()(error('x is undefined'))).toBe(false);
    });

    it.each([
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications.',
        'Script error.',
        'Script error',
        'Firebase: Error (auth/popup-closed-by-user).',
        'Firebase: Error (auth/cancelled-popup-request).',
        'Firebase: Error (auth/user-cancelled).',
    ])('drops "%s"', (message) => {
        expect(createErrorFilter()(error(message))).toBe(true);
    });

    it('keeps Firebase errors the visitor did not cause', () => {
        expect(
            createErrorFilter()(
                error('Firebase: Error (auth/network-request-failed).'),
            ),
        ).toBe(false);
    });

    describe('browser extensions', () => {
        it('drops errors whose source is an extension', () => {
            const filter = createErrorFilter();
            expect(
                filter(
                    error('boom', {
                        sourceURL: 'chrome-extension://abc/content.js',
                    }),
                ),
            ).toBe(true);
            expect(
                filter(
                    error('boom', {
                        sourceURL: 'moz-extension://abc/inject.js',
                    }),
                ),
            ).toBe(true);
        });

        it('trusts sourceURL over the stack', () => {
            const filter = createErrorFilter();
            expect(
                filter(
                    error('boom', {
                        sourceURL: 'https://www.parkspot.in/assets/app.js',
                        stack: 'at x (chrome-extension://abc/content.js:1:1)',
                    }),
                ),
            ).toBe(false);
        });

        it('drops errors whose stack only has extension frames', () => {
            const stack =
                'Error: boom\n    at x (chrome-extension://abc/content.js:1:1)';
            expect(createErrorFilter()(error('boom', { stack }))).toBe(true);
        });

        it('keeps errors whose stack also passes through page scripts', () => {
            const stack = [
                'Error: boom',
                '    at x (chrome-extension://abc/content.js:1:1)',
                '    at y (https://www.parkspot.in/assets/app.js:2:3)',
            ].join('\n');
            expect(createErrorFilter()(error('boom', { stack }))).toBe(false);
        });
    });

    it.each([
        [
            'Failed to fetch dynamically imported module: https://www.parkspot.in/assets/PageSrp-B1.js',
            'chunk-load',
        ],
        ['Importing a module script failed.', 'chunk-load'],
        ['Unable to preload CSS for /assets/PageSrp-B1.css', 'chunk-load'],
        ['Network Error', 'network'],
        ['Failed to fetch', 'network'],
        ['Load failed', 'network'],
        ['Unhandled Promise Rejection: Failed to fetch', 'network'],
        ['NetworkError when attempting to fetch resource.', 'network'],
    ])('groups "%s" as %s', (message, group) => {
        expect(createErrorFilter()(error(message))).toEqual({ group });
    });

    describe('rate limit', () => {
        it('drops a message once it passes the limit', () => {
            const filter = createErrorFilter({ limit: 2, now: () => 0 });
            expect(filter(error('loop'))).toBe(false);
            expect(filter(error('loop'))).toBe(false);
            expect(filter(error('loop'))).toBe(true);
            // Other messages and other error types have their own budget.
            expect(filter(error('other'))).toBe(false);
            expect(filter(new TypeError('loop'))).toBe(false);
        });

        it('keeps the group for errors within the limit', () => {
            const filter = createErrorFilter({ limit: 1, now: () => 0 });
            expect(filter(error('Network Error'))).toEqual({
                group: 'network',
            });
            expect(filter(error('Network Error'))).toBe(true);
        });

        it('starts a new budget when the window ends', () => {
            let time = 0;
            const filter = createErrorFilter({
                limit: 1,
                windowMs: 1000,
                now: () => time,
            });
            expect(filter(error('loop'))).toBe(false);
            expect(filter(error('loop'))).toBe(true);
            time = 999;
            expect(filter(error('loop'))).toBe(true);
            time = 1000;
            expect(filter(error('loop'))).toBe(false);
        });

        it('stops tracking after 500 distinct messages', () => {
            const filter = createErrorFilter({ limit: 1, now: () => 0 });
            expect(filter(error('loop'))).toBe(false);
            expect(filter(error('loop'))).toBe(true);
            for (let i = 0; i < 499; i++) filter(error(`message ${i}`));
            // The counters were cleared, so "loop" is allowed again.
            expect(filter(error('loop'))).toBe(false);
        });
    });
});
