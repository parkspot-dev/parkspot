import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';
import TemplateSearchPortal from '@/components/templates/TemplateSearchPortal.vue';

describe('TemplateSearchPortal.vue', () => {
    let store;
    let wrapper;

    let extractExpiringRequests;
    let extractRequestsByAgentName;
    let extractRequestsByStatus;
    let resetFilterParkingRequests;

    const parkingRequests = [
        {
            ID: 1,
            Name: 'dev',
            Mobile: '9999999999',
            EmailID: 'dev@test.com',
            City: 'Delhi',
            Agent: 'dev',
            Priority: 2,
            Status: 1,
            CreatedAt: '2024-01-01T10:00:00Z',
            UpdatedAt: '2024-01-01T12:00:00Z',
            NextCall: '2024-01-02T10:00:00Z',
            Latitude: 28.6139,
            Longitude: 77.209,
            Comments: '',
        },
    ];

    beforeEach(() => {
        extractExpiringRequests = vi.fn();
        extractRequestsByAgentName = vi.fn();
        extractRequestsByStatus = vi.fn();
        resetFilterParkingRequests = vi.fn();

        store = createStore({
            modules: {
                searchPortal: {
                    namespaced: true,
                    state: () => ({
                        agentList: [{ id: 1, name: 'dev' }],
                        expiringRequestsCount: 1,
                        filteredParkingRequests: parkingRequests,
                    }),
                    actions: {
                        extractExpiringRequests,
                        extractRequestsByAgentName: extractRequestsByAgentName,
                        extractRequestsByStatus: extractRequestsByStatus,
                        resetFilterParkingRequests,
                    },
                },
                user: {
                    namespaced: true,
                    state: () => ({
                        isAdmin: true,
                        userProfile: { FullName: 'dev' },
                    }),
                },
            },
        });

        wrapper = mount(TemplateSearchPortal, {
            props: {
                parkingRequests,
                isLoading: false,
                isSummary: true,
            },
            global: {
                plugins: [store],
                stubs: {
                    'AtomButton': {
                        template:
                            '<button class="atom-button" @click="$emit(\'click\')"><slot /></button>',
                    },
                    'AtomIcon': true,
                    'AtomInput': true,
                    'AtomTextarea': true,
                    'AtomDatePicker': true,
                    'AtomSelectInput': true,
                    'SelectInput': true,
                    'FilterDropdown': true,
                    'MobileView': true,
                    'b-table': true,
                    'b-table-column': true,
                },
            },
        });
    });

    afterEach(() => {
        wrapper.unmount();
        vi.clearAllMocks();
    });

    it('renders search portal layout', () => {
        expect(wrapper.find('.search-portal-wrapper').exists()).toBe(true);
    });

    it('shows expiring requests banner', () => {
        expect(wrapper.text()).toContain('expiring requests');
    });

    it('renders summary button when enabled', () => {
        expect(wrapper.find('.summary').exists()).toBe(true);
        expect(wrapper.find('.atom-button').exists()).toBe(true);
    });

    it('toggles summary section on button click', async () => {
        expect(wrapper.vm.summary.show).toBe(false);
        wrapper.vm.showSummary();
        await flushPromises();
        expect(wrapper.vm.summary.show).toBe(true);
        wrapper.vm.showSummary();
        await flushPromises();
        expect(wrapper.vm.summary.show).toBe(false);
    });

    it('applies expiring filter when banner is clicked', async () => {
        await wrapper.vm.handleExpiringRequests();
        await flushPromises();
        expect(resetFilterParkingRequests).toHaveBeenCalled();
        expect(extractExpiringRequests).toHaveBeenCalled();
    });

    it('applies agent filter', async () => {
        await wrapper.vm.handleAgentFilter('dev');
        await flushPromises();
        expect(resetFilterParkingRequests).toHaveBeenCalled();
        expect(extractRequestsByAgentName).toHaveBeenCalledWith(
            expect.any(Object),
            'dev',
        );
    });

    it('applies status filter', async () => {
        await wrapper.vm.handleStatusFilter('Registered');
        await flushPromises();
        expect(resetFilterParkingRequests).toHaveBeenCalled();
        expect(extractRequestsByStatus).toHaveBeenCalledWith(
            expect.any(Object),
            1,
        );
    });

    it('emits updateRequest when agent is updated', async () => {
        wrapper.vm.onAgentUpdate(parkingRequests[0], 1);
        await flushPromises();
        const emitted = wrapper.emitted('updateRequest');
        expect(emitted).toBeTruthy();
        expect(emitted[0][0].Agent).toBe('dev');
    });

    it('emits updateRequest when status is updated', async () => {
        wrapper.vm.onStatusUpdate(parkingRequests[0], 2);
        await flushPromises();
        const payload = wrapper.emitted('updateRequest').at(-1)[0];
        expect(payload.Status).toBe(2);
    });

    it('updates latitude and longitude correctly', async () => {
        wrapper.vm.updateLatLng(parkingRequests[0], '28.700000, 77.300000');
        await flushPromises();
        const payload = wrapper.emitted('updateRequest').at(-1)[0];
        expect(payload.Latitude).toBeCloseTo(28.7);
        expect(payload.Longitude).toBeCloseTo(77.3);
    });

    it('opens connect popup with selected row', async () => {
        wrapper.vm.onConnect(parkingRequests[0]);
        await flushPromises();
        expect(wrapper.vm.isOpen).toBe(true);
        expect(wrapper.vm.selectedRow.ID).toBe(1);
    });

    it('switches desktop and mobile view correctly', async () => {
        await wrapper.setData({
            windowWidth: 1200,
            isMobileDevice: false,
        });

        expect(wrapper.vm.isDesktopView).toBe(true);
        await wrapper.setData({
            windowWidth: 500,
        });
        expect(wrapper.vm.isDesktopView).toBe(false);
    });

    it('has correct initial filter state', () => {
        expect(wrapper.vm.filters).toEqual({
            Agent: '',
            Status: '',
            UpdatedAt: null,
            isExpiring: false,
        });
    });
});
