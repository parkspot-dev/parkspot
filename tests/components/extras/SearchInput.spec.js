import { describe, it, expect, vi } from 'vitest';
import SearchInput from '@/components/extras/SearchInput.vue';

const createContext = () => ({
    updateMapConfig: vi.fn(),
    updateSelectedLocation: vi.fn(),
    updateSelectedCity: vi.fn(),
    updateSelectedState: vi.fn(),
    updateSelectedCountry: vi.fn(),
});

describe('SearchInput selected watcher', () => {
    it('ignores a null selection instead of reading location.center', () => {
        const context = createContext();

        expect(() =>
            SearchInput.watch.selected.call(context, null),
        ).not.toThrow();
        expect(context.updateMapConfig).not.toHaveBeenCalled();
    });

    it('recenters the map for a valid Mapbox selection', () => {
        const context = createContext();
        const location = {
            center: [77.5, 12.9],
            context: [{ text: 'Bengaluru' }, { text: 'Karnataka' }],
        };

        SearchInput.watch.selected.call(context, location);

        expect(context.updateMapConfig).toHaveBeenCalledWith([77.5, 12.9]);
        expect(context.updateSelectedLocation).toHaveBeenCalledWith(location);
        expect(context.updateSelectedCountry).toHaveBeenCalledWith(undefined);
    });
});
