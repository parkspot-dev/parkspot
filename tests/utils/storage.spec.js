import { afterEach, describe, expect, it, vi } from 'vitest';
import { reportError } from '@/telemetry';
import {
    getStoredValue,
    removeStoredValue,
    setStoredValue,
} from '@/utils/storage.js';

vi.mock('@/telemetry', () => ({
    reportError: vi.fn(),
}));

describe('storage helpers', () => {
    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
        localStorage.clear();
        sessionStorage.clear();
        removeStoredValue('key');
        removeStoredValue('key', 'session');
    });

    it('reads and writes the requested storage area', () => {
        setStoredValue('key', 'local-value');
        setStoredValue('key', 'session-value', 'session');

        expect(getStoredValue('key')).toBe('local-value');
        expect(getStoredValue('key', 'session')).toBe('session-value');
    });

    it('removes values from storage and memory', () => {
        setStoredValue('key', 'value');
        removeStoredValue('key');

        expect(getStoredValue('key')).toBeNull();
        expect(localStorage.getItem('key')).toBeNull();
    });

    it('reports storage failures instead of failing silently', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('Access is denied for this document.');
        });
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('Access is denied for this document.');
        });
        vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
            throw new Error('Access is denied for this document.');
        });

        expect(() => setStoredValue('key', 'value')).not.toThrow();
        expect(getStoredValue('key')).toBeNull();
        expect(() => removeStoredValue('key')).not.toThrow();

        expect(reportError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                source: 'storage',
                storage_operation: 'write',
            }),
        );
        expect(reportError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                source: 'storage',
                storage_operation: 'read',
            }),
        );
    });
});
