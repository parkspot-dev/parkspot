import { describe, expect, it } from 'vitest';
import { isValidNumber } from '@/utils/isValidNumber';

describe('isValidNumber', () => {
    describe('Structure tests', () => {
        it('exports a validation function', () => {
            expect(isValidNumber).toBeDefined();
        });
    });

    describe('Behavior tests', () => {
        it('returns false for undefined values', () => {
            expect(isValidNumber(undefined)).toBe(false);
        });

        it('returns false for null values', () => {
            expect(isValidNumber(null)).toBe(false);
        });

        it('returns false for NaN values', () => {
            expect(isValidNumber(Number.NaN)).toBe(false);
        });

        it('returns true for finite numbers', () => {
            expect(isValidNumber(42)).toBe(true);
        });

        it('returns true for string values that are not NaN', () => {
            expect(isValidNumber('42')).toBe(true);
            expect(isValidNumber('')).toBe(true);
            expect(isValidNumber('abc')).toBe(true);
        });
    });

    describe('Accessibility tests', () => {
        it('always returns a boolean value for UI validation consumers', () => {
            expect(typeof isValidNumber(5)).toBe('boolean');
            expect(typeof isValidNumber(undefined)).toBe('boolean');
        });
    });

    describe('Focused snapshot tests', () => {
        it('matches the validation result matrix snapshot', () => {
            expect({
                emptyString: isValidNumber(''),
                finiteNumber: isValidNumber(42),
                invalidNumber: isValidNumber(Number.NaN),
                nullValue: isValidNumber(null),
                stringValue: isValidNumber('42'),
                undefinedValue: isValidNumber(undefined),
            }).toMatchInlineSnapshot(`
              {
                "emptyString": true,
                "finiteNumber": true,
                "invalidNumber": false,
                "nullValue": false,
                "stringValue": true,
                "undefinedValue": false,
              }
            `);
        });
    });
});
