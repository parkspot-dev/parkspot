import { describe, it, expect, vi } from 'vitest';
import mapModule from '@/store/map';

vi.mock('@/services/api', () => ({
    mayaClient: { get: vi.fn(), post: vi.fn() },
    mapBoxClient: { get: vi.fn() },
}));

const createState = () => JSON.parse(JSON.stringify(mapModule.state));

describe('map store mutations', () => {
    it('sets city/state/country from a well-formed geocoding result', () => {
        const state = createState();
        mapModule.mutations['update-selected-city'](state, { text: 'Bengaluru' });
        mapModule.mutations['update-selected-state'](state, { text: 'Karnataka' });
        mapModule.mutations['update-selected-country'](state, { text: 'India' });

        expect(state.selectedLocation.city).toBe('Bengaluru');
        expect(state.selectedLocation.state).toBe('Karnataka');
        expect(state.selectedLocation.country).toBe('India');
    });

    it('does not throw when city/state/country context is undefined', () => {
        const state = createState();

        expect(() =>
            mapModule.mutations['update-selected-city'](state, undefined),
        ).not.toThrow();
        expect(() =>
            mapModule.mutations['update-selected-state'](state, undefined),
        ).not.toThrow();
        expect(() =>
            mapModule.mutations['update-selected-country'](state, undefined),
        ).not.toThrow();

        expect(state.selectedLocation.city).toBe('');
        expect(state.selectedLocation.state).toBe('');
        expect(state.selectedLocation.country).toBe('');
    });
});
