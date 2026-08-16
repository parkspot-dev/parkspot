import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createStore } from 'vuex';
import OrganismHomeCard from '@/components/organisms/OrganismHomeCard.vue';

const mountWithLocDetails = (LocDetails) => {
    const store = createStore({
        modules: {
            map: {
                namespaced: true,
                getters: { getLocDetails: () => LocDetails },
            },
        },
    });
    const push = vi.fn();
    const wrapper = shallowMount(OrganismHomeCard, {
        global: {
            plugins: [store],
            mocks: { $router: { push } },
        },
    });
    return { wrapper, push };
};

describe('OrganismHomeCard.vue flyToSrp', () => {
    it('does not navigate or throw when no location has been selected', () => {
        const { wrapper, push } = mountWithLocDetails({
            locDetails: null,
            lnglat: null,
        });

        expect(() => wrapper.vm.flyToSrp()).not.toThrow();
        expect(push).not.toHaveBeenCalled();
    });

    it('navigates to srp when a location is selected', () => {
        const { wrapper, push } = mountWithLocDetails({
            locDetails: { locName: 'Koramangala' },
            lnglat: [77.6, 12.9],
        });

        wrapper.vm.flyToSrp();

        expect(push).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'srp' }),
        );
    });
});
