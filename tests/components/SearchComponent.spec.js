import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createStore } from 'vuex';
import SearchComponent from '@/components/vo-portal/SearchComponent.vue';

const stubs = {
    AtomButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
    AtomParagraph: { template: '<p><slot /></p>' },
    SearchInput: { template: '<input />' },
    TopSearchesCard: { template: '<div class="top-search-card"></div>' },
};

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
    const wrapper = mount(SearchComponent, {
        global: {
            plugins: [store],
            stubs,
            mocks: { $router: { push } },
        },
    });
    return { wrapper, push };
};

describe('SearchComponent.vue flyToSrp', () => {
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
