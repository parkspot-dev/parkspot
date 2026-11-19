import { describe, it, expect, vi, beforeEach } from 'vitest';
import mapModule from '@/store/map';
import { mapBoxClient } from '@/services/api';

vi.mock('@/services/api', () => ({
    mayaClient: { get: vi.fn(), post: vi.fn() },
    mapBoxClient: { get: vi.fn() },
}));

const createState = () => JSON.parse(JSON.stringify(mapModule.state));

describe('map store mutations', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('sets city/state/country from a well-formed geocoding result', () => {
        const state = createState();
        mapModule.mutations['update-selected-city'](state, {
            text: 'Bengaluru',
        });
        mapModule.mutations['update-selected-state'](state, {
            text: 'Karnataka',
        });
        mapModule.mutations['update-selected-country'](state, {
            text: 'India',
        });

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

    it('replaces an existing filter by name without removing other filters', () => {
        const state = createState();
        const initialRentFilter = {
            name: 'rent',
            minValue: 0,
            maxValue: 100,
        };
        const updatedRentFilter = {
            name: 'rent',
            minValue: 100,
            maxValue: 200,
        };
        const distanceFilter = {
            name: 'distance',
            minValue: 0,
            maxValue: 10,
        };

        mapModule.mutations['update-filter-array'](state, initialRentFilter);
        mapModule.mutations['update-filter-array'](state, distanceFilter);
        mapModule.mutations['update-filter-array'](state, updatedRentFilter);

        expect(state.filters).toEqual([updatedRentFilter, distanceFilter]);
    });
});

describe('map store actions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('clears locations without calling Mapbox for an empty query', async () => {
        const commit = vi.fn();

        await mapModule.actions.searchLocation({ commit }, '   ');

        expect(mapBoxClient.get).not.toHaveBeenCalled();
        expect(commit).toHaveBeenCalledWith('update-location', []);
    });

    it('URL-encodes the query before calling Mapbox', async () => {
        const commit = vi.fn();
        mapBoxClient.get.mockResolvedValue({ features: [{ id: 'place-1' }] });

        await mapModule.actions.searchLocation(
            { commit },
            'MG Road & 5th Cross',
        );

        expect(mapBoxClient.get).toHaveBeenCalledWith(
            expect.stringContaining(encodeURIComponent('MG Road & 5th Cross')),
        );
        expect(commit).toHaveBeenCalledWith('update-location', [
            { id: 'place-1' },
        ]);
    });
});
