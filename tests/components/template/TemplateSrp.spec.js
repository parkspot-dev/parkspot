import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TemplateSrp from '@/components/templates/TemplateSrp.vue';
import { createStore } from 'vuex';

const MOCK_OPTIONS = [
    { name: 'Option A', value: 'a' },
    { name: 'Option B', value: 'b' },
];

const MOCK_SPOTS = [
    { ID: 1, name: 'Spot 1', distance: 10, rent: 100, status: 'available' },
    { ID: 2, name: 'Spot 2', distance: 20, rent: 200, status: 'booked' },
    { ID: 3, name: 'Spot 3', distance: 30, rent: 300, status: 'available' },
];

const mockFilterManagerInstance = {
    addFilter: vi.fn(),
    removeFilter: vi.fn(),
    handleStatusFilter: vi.fn(),
    loadFiltersFromQuery: vi.fn(),
    sortFilteredResults: vi.fn(),
};

vi.mock('@/modules/filter', () => {
    class MockFilterManager {
        constructor() {
            return mockFilterManagerInstance;
        }
    }

    return {
        default: MockFilterManager,
    };
});

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
            getters: {},
        },
    },
});

const mockRoute = {
    query: {
        latlng: '10.0,20.0',
    },
};

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
        <button v-if="removable !== false" @click="$emit('remove')">Remove</button>
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
    'b-tag': { template: "<span class='b-tag'><slot /></span>" },
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
                    $route: mockRoute,
                },
                directives: {
                    'click-outside': vi.fn(),
                },
            },
            data() {
                return {
                    distanceFilterOptions: MOCK_OPTIONS,
                    rentFilerOptions: MOCK_OPTIONS,
                    sortFilterOptions: MOCK_OPTIONS,
                    statusFilterOptions: MOCK_OPTIONS,
                };
            },
        });

    beforeEach(() => {
        vi.clearAllMocks();
        wrapper = mountComponent();
    });

    it('1. Renders main structure and components', () => {
        expect(wrapper.find('.srp-container').exists()).toBe(true);
        expect(wrapper.find('.srp-map').exists()).toBe(true);
        expect(wrapper.find('.map-search').exists()).toBe(true);
        expect(wrapper.find('.map-container-stub').exists()).toBe(true);
        expect(wrapper.findAll('.srp-card').length).toBe(MOCK_SPOTS.length);
        expect(wrapper.text()).toContain(`Spots found: ${MOCK_SPOTS.length}`);
    });

    it('2. Loads center from route query on mounted', () => {
        expect(wrapper.vm.center).toEqual([20.0, 10.0]);
        expect(
            mockFilterManagerInstance.loadFiltersFromQuery,
        ).toHaveBeenCalled();
    });

    it('3. Toggles filter container visibility on click', async () => {
        const filterTrigger = wrapper.find('.filter-dropdown');
        const arrowIcon = wrapper.find('.material-symbols-outlined');

        expect(wrapper.vm.isFilterContainerOpen).toBe(false);
        expect(arrowIcon.classes()).not.toContain('rotate');

        await filterTrigger.trigger('click');
        expect(wrapper.vm.isFilterContainerOpen).toBe(true);
        expect(wrapper.find('.filters').exists()).toBe(true);
        expect(arrowIcon.classes()).toContain('rotate');
    });

    it('4. Emits "flyToSrp" on SearchInput "changed" event', async () => {
        const searchInput = wrapper.find('.map-search');
        await searchInput.trigger('input');

        expect(wrapper.emitted('flyToSrp')).toBeTruthy();
    });

    it('5. Emits "details" event on SRP card click', async () => {
        const firstCard = wrapper.findAll('.srp-card')[0];
        const spotID = MOCK_SPOTS[0].ID;

        await firstCard.trigger('click');

        expect(wrapper.emitted('details')).toBeTruthy();
        expect(wrapper.emitted('details')[0]).toEqual([spotID]);
    });

    it('6. FilterDropdown events call corresponding FilterManager methods', async () => {
        const filterTrigger = wrapper.find('.filter-dropdown');
        await filterTrigger.trigger('click');

        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        const allDynamicDropdowns = wrapper.findAll(
            '.filters .filter-dropdown-stub',
        );

        const distanceDropdown = allDynamicDropdowns.filter((w) =>
            w.text().includes('Search Within'),
        )[0];
        const rentDropdown = allDynamicDropdowns.filter((w) =>
            w.text().includes('Rent Range'),
        )[0];
        const statusDropdown = allDynamicDropdowns.filter((w) =>
            w.text().includes('Availability'),
        )[0];

        expect(distanceDropdown.exists()).toBe(true);
        expect(rentDropdown.exists()).toBe(true);
        expect(statusDropdown.exists()).toBe(true);

        const distanceButtons = distanceDropdown.findAll('button');
        await distanceButtons[0].trigger('click');
        expect(mockFilterManagerInstance.addFilter).toHaveBeenCalledWith(
            'distance',
            'new-value',
        );

        const rentButtons = rentDropdown.findAll('button');
        await rentButtons[1].trigger('click');
        expect(mockFilterManagerInstance.removeFilter).toHaveBeenCalledWith(
            'rent',
        );

        const statusButtons = statusDropdown.findAll('button');
        await statusButtons[0].trigger('click');
        expect(
            mockFilterManagerInstance.handleStatusFilter,
        ).toHaveBeenCalledWith('status', 'new-value');
    });

    it('7. Sort Dropdown calls sortFilteredResults on update', async () => {
        const sortContainer = wrapper.find('.sort-dropdown');
        const sortDropdown = sortContainer
            .findAll('.filter-dropdown-stub')
            .filter((w) => w.text().includes('Select'))[0];

        expect(sortDropdown.exists()).toBe(true);
        const sortButtons = sortDropdown.findAll('button');
        await sortButtons[0].trigger('click');

        expect(
            mockFilterManagerInstance.sortFilteredResults,
        ).toHaveBeenCalledWith('new-value', 'asc');
    });

    it('8. FilterManager is correctly bound', () => {
        expect(wrapper.vm.filterManager).toBeDefined();
    });

    it('9. Maintains expected structure for a single SRP card', () => {
        const firstSrpCard = wrapper.findAll('.srp-card')[0];
        expect(firstSrpCard.html()).toMatchSnapshot();
    });
});
