import { describe, expect, it } from 'vitest';
import { isValidNumber } from '@/utils/isValidNumber';

describe('isValidNumber', () => {
    describe('Structure tests', () => {
        it('exports a validation function', () => {
            expect(isValidNumber).toBeDefined();
        });
    });

    describe('Validates different input scenarios correctly', () => {
        it('returns false for null and undefined', () => {
            expect(isValidNumber(null)).toBe(false);
            expect(isValidNumber(undefined)).toBe(false);
        });

        it('returns false for empty or invalid strings', () => {
            expect(isValidNumber('')).toBe(false);
            expect(isValidNumber('   ')).toBe(false);
            expect(isValidNumber('abc')).toBe(false);
        });

        it('returns false for NaN values', () => {
            expect(isValidNumber(Number.NaN)).toBe(false);
        });

        it('returns true for valid integers', () => {
            expect(isValidNumber(42)).toBe(true);
            expect(isValidNumber('42')).toBe(true);
            expect(isValidNumber(' 42 ')).toBe(true);
        });

        it('returns false for non-integer numbers', () => {
            expect(isValidNumber(12.5)).toBe(false);
            expect(isValidNumber('12.5')).toBe(false);
        });
    });

    describe('Ensures consistent return type for consumers', () => {
        it('always returns a boolean', () => {
            expect(typeof isValidNumber(5)).toBe('boolean');
            expect(typeof isValidNumber('abc')).toBe('boolean');
        });
    });
});
