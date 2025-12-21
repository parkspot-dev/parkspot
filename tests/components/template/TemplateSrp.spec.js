import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TemplateSrp from '@/components/templates/TemplateSrp.vue';
import { createStore } from 'vuex';

const MOCK_OPTIONS = [
    { name: 'Option A', value: 'a' },
    { name: 'Option B', value: 'b' },
];

const MOCK_SPOTS = [
    { ID: 1, name: 'Spot 1', distance: 10, rent: 100, status: 'available' },
    { ID: 2, name: 'Spot 2', distance: 20, rent: 200, status: 'booked' },
];

const EXPECTED_COORDINATES = [20.0, 10.0];

const mockFilterManagerInstance = {
    addFilter: vi.fn(),
    removeFilter: vi.fn(),
    handleStatusFilter: vi.fn(),
    loadFiltersFromQuery: vi.fn(),
    sortFilteredResults: vi.fn(),
};

vi.mock('@/modules/filter', () => ({
    default: class {
        constructor() {
            return mockFilterManagerInstance;
        }
    },
}));

const mockStore = createStore({
    modules: {
        map: {
            namespaced: true,
            state: {
                selectedLocation: null,
                filters: {},
                filteredSpots: MOCK_SPOTS,
                selectedSort: { name: 'Distance', value: 'distance' },
            },
        },
    },
});

const stubComponents = {
    'SearchInput': {
        template: "<input class='map-search' @input='$emit(\"changed\")' />",
    },
    'FilterDropdown': {
        props: ['options', 'selectedValue', 'label', 'removable'],
        template: `
            <div class="filter-dropdown-stub">
                <span>{{ label }}: {{ selectedValue }}</span>
                <button @click="$emit('update', 'new-value')">Update</button>
            </div>
        `,
    },
    'MoleculeSRPCard': {
        props: ['spot'],
        template:
            "<div class='srp-card' @click='$emit(\"on-details\", spot.ID)'>{{ spot.ID }}</div>",
    },
    'MapContainer': { template: "<div class='map-container-stub'>Map</div>" },
    'AtomCheckbox': { template: "<div class='atom-checkbox-stub'></div>" },
    'SelectInput': { template: "<div class='select-input-stub'></div>" },
    'b-tag': { template: '<span><slot /></span>' },
};

describe('TemplateSrp.vue - Complete Test Suite', () => {
    let wrapper;

    const mountComponent = (props = {}) =>
        mount(TemplateSrp, {
            props: {
                spots: MOCK_SPOTS,
                totals: MOCK_SPOTS.length,
                reRender: 1,
                currentPage: 1,
                ...props,
            },
            global: {
                plugins: [mockStore],
                stubs: stubComponents,
                mocks: {
                    $route: { query: { latlng: '10.0,20.0' } },
                },
                directives: {
                    'click-outside': vi.fn(),
                },
            },
            data() {
                return {
                    distanceFilterOptions: MOCK_OPTIONS,
                    rentFilterOptions: MOCK_OPTIONS,
                    sortFilterOptions: MOCK_OPTIONS,
                    statusFilterOptions: MOCK_OPTIONS,
                };
            },
        });

    beforeEach(() => {
        vi.clearAllMocks();
        wrapper = mountComponent();
    });

    afterEach(() => {
        wrapper?.unmount();
    });

    it('renders main structure and components', () => {
        expect(wrapper.find('.srp-container').exists()).toBe(true);
        expect(wrapper.findAll('.srp-card').length).toBe(MOCK_SPOTS.length);
    });

    it('loads center from route query on mounted', () => {
        expect(wrapper.vm.center).toEqual(EXPECTED_COORDINATES);
        expect(
            mockFilterManagerInstance.loadFiltersFromQuery,
        ).toHaveBeenCalled();
    });

    it('toggles filter container visibility on click', async () => {
        const filterTrigger = wrapper.find('.filter-dropdown');
        expect(wrapper.vm.isFilterContainerOpen).toBe(false);
        await filterTrigger.trigger('click');
        expect(wrapper.vm.isFilterContainerOpen).toBe(true);
        expect(wrapper.find('.filters').exists()).toBe(true);
    });

    it('emits flyToSrp on SearchInput changed event', async () => {
        const searchInput = wrapper.find('.map-search');
        await searchInput.trigger('input');
        expect(wrapper.emitted('flyToSrp')).toBeTruthy();
    });

    it('filter dropdown events call corresponding FilterManager methods', async () => {
        await wrapper.find('.filter-dropdown').trigger('click');
        await flushPromises();
        const dropdown = wrapper.find('.filter-dropdown-stub');
        await dropdown.find('button').trigger('click');
        expect(mockFilterManagerInstance.addFilter).toHaveBeenCalled();
    });

    it('sort dropdown calls sortFilteredResults on update', async () => {
        const sortDropdown = wrapper.find(
            '.sort-dropdown .filter-dropdown-stub',
        );
        await sortDropdown.find('button').trigger('click');
        expect(
            mockFilterManagerInstance.sortFilteredResults,
        ).toHaveBeenCalled();
    });

    it('maintains expected structure for a single SRP card', () => {
        const firstSrpCard = wrapper.findAll('.srp-card')[0];
        expect(firstSrpCard.html()).toMatchSnapshot();
    });
});
