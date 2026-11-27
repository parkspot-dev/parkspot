import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getPtid } from '@/utils/ptid';

describe('getPtid', () => {
    beforeEach(() => {
        window.sessionStorage.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('reuses the stored id', () => {
        window.sessionStorage.setItem('ptid', 'tab-123');
        expect(getPtid()).toBe('tab-123');
    });

    it('creates and stores an id when none exists', () => {
        const ptid = getPtid();
        expect(ptid).toBeTruthy();
        expect(window.sessionStorage.getItem('ptid')).toBe(ptid);
    });

    it('returns an empty string when sessionStorage access throws', () => {
        vi.stubGlobal(
            'sessionStorage',
            new Proxy(
                {},
                {
                    get() {
                        throw new Error('Storage access denied');
                    },
                },
            ),
        );

        expect(getPtid()).toBe('');
    });

    it('returns an empty string when sessionStorage writes fail', () => {
        vi.stubGlobal('sessionStorage', {
            getItem: () => null,
            setItem: () => {
                throw new Error('Quota exceeded');
            },
        });

        expect(getPtid()).toBe('');
    });
});
