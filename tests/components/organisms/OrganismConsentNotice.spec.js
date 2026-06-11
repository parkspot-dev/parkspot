// PR-2 of conversion-tracking. Pin the disclosure-only contract of
// OrganismConsentNotice so a future copy/UX patch can't accidentally
// re-introduce a Reject button or flip the persistence semantics.
//
// What we assert:
//   - The strip is hidden initially and slides in after the show delay.
//   - "Got it" writes { acknowledged, timestamp } to localStorage and
//     hides the strip.
//   - A fresh acknowledgement (within 12 months) suppresses the strip.
//   - An expired acknowledgement re-shows the strip.
//   - localStorage failures (Safari private mode) don't throw.
//   - There is no Reject / Manage Preferences button (disclosure-only).
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import OrganismConsentNotice from '@/components/organisms/OrganismConsentNotice.vue';

const STORAGE_KEY = 'parkspot_consent_notice';
const TWELVE_MONTHS_MS = 365 * 24 * 60 * 60 * 1000;

const stubs = {
    // <router-link> isn't installed in this unit test; stub to a plain
    // anchor so we can still inspect the link target.
    'router-link': {
        props: ['to'],
        template: '<a :href="to"><slot /></a>',
    },
};

const mountIt = () =>
    mount(OrganismConsentNotice, {
        global: { stubs },
        attachTo: document.body,
    });

describe('OrganismConsentNotice.vue — disclosure-only cookie notice', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        window.localStorage.clear();
    });

    afterEach(() => {
        vi.useRealTimers();
        window.localStorage.clear();
    });

    it('is hidden on mount and slides in after the show delay', async () => {
        const w = mountIt();
        // Pre-delay: strip should not be in the DOM yet.
        expect(w.find('.consent-notice').exists()).toBe(false);
        await vi.advanceTimersByTimeAsync(1500);
        expect(w.find('.consent-notice').exists()).toBe(true);
        expect(w.text()).toMatch(/We use cookies/i);
        expect(w.text()).toMatch(/Privacy Policy/i);
        w.unmount();
    });

    it('does not render any Reject / Manage Preferences UI', async () => {
        const w = mountIt();
        await vi.advanceTimersByTimeAsync(1500);
        const buttons = w.findAll('button');
        expect(buttons.length).toBe(1);
        expect(buttons[0].text().trim()).toBe('Got it');
        // Sanity: no copy that would imply a choice beyond acknowledgement.
        expect(w.text()).not.toMatch(/reject/i);
        expect(w.text()).not.toMatch(/manage preferences/i);
        w.unmount();
    });

    it('writes acknowledgement to localStorage and hides on click', async () => {
        const w = mountIt();
        await vi.advanceTimersByTimeAsync(1500);
        await w.find('button').trigger('click');
        const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
        expect(stored.acknowledged).toBe(true);
        expect(typeof stored.timestamp).toBe('number');
        expect(w.find('.consent-notice').exists()).toBe(false);
        w.unmount();
    });

    it('stays hidden when a fresh acknowledgement exists', async () => {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ acknowledged: true, timestamp: Date.now() }),
        );
        const w = mountIt();
        await vi.advanceTimersByTimeAsync(2000);
        expect(w.find('.consent-notice').exists()).toBe(false);
        w.unmount();
    });

    it('re-shows after the 12-month TTL has elapsed', async () => {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                acknowledged: true,
                // 13 months ago — past the 12-month TTL.
                timestamp: Date.now() - (TWELVE_MONTHS_MS + 1000),
            }),
        );
        const w = mountIt();
        await vi.advanceTimersByTimeAsync(1500);
        expect(w.find('.consent-notice').exists()).toBe(true);
        w.unmount();
    });

    it('survives localStorage failures (Safari private mode)', async () => {
        const original = window.localStorage.getItem;
        window.localStorage.getItem = () => {
            throw new Error('SecurityError');
        };
        try {
            const w = mountIt();
            await vi.advanceTimersByTimeAsync(1500);
            // Falls through to "show" because the stored ack can't be
            // read — disclosure is the safe default.
            expect(w.find('.consent-notice').exists()).toBe(true);

            // Click should also tolerate setItem throwing.
            window.localStorage.setItem = () => {
                throw new Error('SecurityError');
            };
            await w.find('button').trigger('click');
            // Strip still hides on click even if persistence failed.
            expect(w.find('.consent-notice').exists()).toBe(false);
            w.unmount();
        } finally {
            window.localStorage.getItem = original;
        }
    });
});
