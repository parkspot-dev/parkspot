import { describe, it, expect, vi, afterEach } from 'vitest';
import { withTimeout } from '@/utils/with-timeout';

describe('withTimeout', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('resolves with the promise value when it settles before the timeout', async () => {
        const result = await withTimeout(Promise.resolve('ok'), 1000);
        expect(result).toBe('ok');
    });

    it('resolves with the fallback when the promise does not settle in time', async () => {
        vi.useFakeTimers();
        const never = new Promise(() => {});
        const promise = withTimeout(never, 3000, 'fallback');
        await vi.advanceTimersByTimeAsync(3000);
        await expect(promise).resolves.toBe('fallback');
    });

    it('fallback defaults to undefined on timeout', async () => {
        vi.useFakeTimers();
        const never = new Promise(() => {});
        const promise = withTimeout(never, 500);
        await vi.advanceTimersByTimeAsync(500);
        await expect(promise).resolves.toBeUndefined();
    });

    it('propagates a rejection when the promise rejects before the timeout', async () => {
        const err = new Error('boom');
        await expect(withTimeout(Promise.reject(err), 1000)).rejects.toBe(err);
    });

    it('does not resolve with the fallback if the promise already resolved', async () => {
        vi.useFakeTimers();
        const promise = withTimeout(Promise.resolve('real'), 1000, 'fallback');
        await vi.advanceTimersByTimeAsync(1000);
        await expect(promise).resolves.toBe('real');
    });
});
