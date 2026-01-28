import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import PageSpotRequest from "@/views/PageSpotRequest.vue";
import { createStore } from "vuex";

vi.mock("@/constant/enums", () => ({
    getIdBasedOnLabel: (list, label) => {
        const found = list.find((s) => s.name === label);
        return found ? found.id : null;
    },
    getSpotRequestStatusLabel: (id) => {
        const map = {
            1: 'Registered',
            2: 'Processing',
            4: 'Verified',
            8: 'Duplicate,'
        };
        return map[id] || 'Not Set';
    },
    SpotRequestStatus: [],
}));


const fetchSpotRequests = vi.fn();
const updateStatus = vi.fn();

const BTableStub = {
    template: `
        <div class="b-table">
            <slot />
        </div>
    `,
};

const BTableColumnStub = {
    template: `
        <div class="b-table-column">
            <slot v-bind="{ row }"></slot>
        </div>
    `,
    data() {
        return {
            row: {
                ID: 1,
                ApartmentName: 'Test Apt',
                Address: 'Test Address',
                Status: 1,
                Remark: 'Test Remark',
                LastCallDate: '2025-01-01T10:00:00Z',
            },
        };
    },
};

const globalStubs = {
    'b-table': BTableStub,
    'b-table-column': BTableColumnStub,

    'AtomButton': {
        template: `<button @click="$emit('click')"><slot /></button>`,
    },
    'AtomIcon': {
        template: `<i @click="$emit('click')"></i>`,
    },
    'AtomSelectInput': {
        template: `<select></select>`,
    },
    'MoleculeSearchBox': {
        template: `<input @input="$emit('on-search', $event.target.value)" />`,
    },
    'SelectInput': {
        props: ['defaultValue'],
        template: `
            <select @change="$emit('change', $event)">
                <option>{{ defaultValue }}</option>
            </select>
        `,
    },
    'LoaderModal': {
        template: `<div class="loader-modal"></div>`,
    },
};


const createStoreMock = () =>
    createStore({
        modules: {
            spotRequests: {
                namespaced: true,
                state: () => ({
                    isLoading: false,
                    hasError: false,
                    errorMessage: '',
                    spotRequests: [],
                }),
                actions: {
                    fetchSpotRequests,
                    updateStatus,
                },
            },
        },
    });

const buefyMock = {
    dialog: {
        alert: vi.fn(),
    },
    toast: {
        open: vi.fn(),
    },
};

let wrapper;

const factory = () => {
    wrapper = mount(PageSpotRequest, {
        global: {
            stubs: globalStubs,
            mocks: {
                $buefy: buefyMock,
                $router: {push: vi.fn()},
                $route: {path: '/spot/requests'},
            },
            plugins: [createStoreMock()],
        },
    });

    return wrapper;
};

describe('PageSpotRequest.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        wrapper?.unmount();
    });

    it('renders component', () => {
        wrapper = factory();
        expect(wrapper.exists()).toBe(true);
    });

    it('calls fetchSpotRequests on mount', () => {
        factory();
        expect(fetchSpotRequests).toHaveBeenCalled();
    });

    it('shows loader when isLoading is true', async () => {
        wrapper = factory();

        wrapper.vm.$store.state.spotRequests.isLoading = true;
        await wrapper.vm.$nextTick();

        expect(wrapper.find('.loader-modal').exists()).toBe(true);
    });

    it('toggles summary visibility', () => {
        wrapper = factory();

        expect(wrapper.vm.summary.show).toBe(false);
        wrapper.vm.showSummary();
        expect(wrapper.vm.summary.show).toBe(true);
        wrapper.vm.showSummary();
        expect(wrapper.vm.summary.show).toBe(false);
    });

    it('updates summary counts correctly', () => {
        wrapper = factory();
        
        const data = [
            {Status: 1},
            {Status: 2},
            {Status: 2},
            {Status: 4},
        ];

        wrapper.vm.updateSummary(data);

        expect(wrapper.vm.summary.status[1]).toBe(1);
        expect(wrapper.vm.summary.status[2]).toBe(2);
        expect(wrapper.vm.summary.status[4]).toBe(1);
    });

    it('searchSpotRequest with valid numeric ID', () => {
        wrapper = factory();
        wrapper.vm.searchSpotRequest('123');

        expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
            path: '/spot/requests',
            query: {requestId: '123'},
        });
    });

    it('searchSpotRequest with invalid ID shows error', () => {
        wrapper = factory();
        wrapper.vm.searchSpotRequest('abc');

        expect(buefyMock.dialog.alert).toHaveBeenCalled();
    });

    it('formats date correctly', () => {
        wrapper = factory();
        const formatted = wrapper.vm.formatDate('2025-01-04T12:34:56Z');
        expect(formatted).toContain('2025');
    });

    it('creates correct request detail URL', () => {
        wrapper = factory();
        const url = wrapper.vm.RequestDetailURL(99);

        expect(url).toBe('/spot/requests/?requestId=99');
    });

    it('updates status successfully', async () => {
        wrapper = factory();
        const row = {ID: 1, Status: 1};

        await wrapper.vm.onStatusUpdate(row, 'Processing');

        expect(updateStatus).toHaveBeenCalled();
        expect(buefyMock.toast.open).toHaveBeenCalled();
    });

    it('shows error on invalid status update', async () => {
        wrapper = factory();
        const row = {ID: 1, Status: 1};

        await wrapper.vm.onStatusUpdate(row, 'InvalidStatus');

        expect(buefyMock.dialog.alert).toHaveBeenCalled();
    });

    it('shows error dialog when hasError becomes true', async () => {
        wrapper = factory();
        wrapper.vm.$store.state.spotRequests.hasError = true;
        await wrapper.vm.$nextTick();

        expect(buefyMock.dialog.alert).toHaveBeenCalled();
    });

    it('handles Duplicate status correctly in summary', () => {
        wrapper = factory();

        const data = [{ Status: 1 }, { Status: 8 }, { Status: 8 }];

        wrapper.vm.updateSummary(data);

        expect(wrapper.vm.summary.status[1]).toBe(1);
        expect(wrapper.vm.summary.status[8]).toBe(2);
    });

    it('updates status to Duplicate successfully', async () => {
        wrapper = factory();
        const row = { ID: 1, Status: 1 };

        await wrapper.vm.onStatusUpdate(row, 'Duplicate');

        expect(updateStatus).toHaveBeenCalledWith(
            expect.any(Object),
            expect.objectContaining({
                Status: 8,
            }),
        );


        expect(buefyMock.toast.open).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.stringContaining('Duplicate'),
            }),
        );
    });

});
