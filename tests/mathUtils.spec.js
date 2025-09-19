import { add, multiply } from '@/utils/mathUtils';
import { describe, expect, it } from 'vitest';

describe('mathUtils functions', () => {
    it('adds two number', () => {
        expect(add(2, 3)).toBe(5);
        expect(add(4, 5)).toBe(9);
    });

    it('multiplies two numbers', () => {
        expect(multiply(2, 3)).toBe(6);
        expect(multiply(-1, 5)).toBe(-5);
    });
});
