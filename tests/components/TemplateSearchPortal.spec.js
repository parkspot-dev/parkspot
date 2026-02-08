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
        vi.clearAllMocks();

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
                        extractRequestsByAgentName,
                        extractRequestsByStatus,
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
                    'b-table': {
                        template: '<div><slot /></div>',
                    },
                    'b-table-column': {
                        template: `
                          <div>
                            <slot
                              :row="{
                                ID: 1,
                                Name: 'dev',
                                Mobile: '9999999999',
                                EmailID: 'dev@test.com',
                                City: 'Delhi',
                                Agent: 'dev',
                                Priority: 2,
                                Status: 1,
                                IsExpiring: false,
                                CreatedAt: '2024-01-01T10:00:00Z',
                                UpdatedAt: '2024-01-01T12:00:00Z',
                                NextCall: '2024-01-02T10:00:00Z',
                                Latitude: 28.6139,
                                Longitude: 77.209,
                                Comments: ''
                              }"
                              :filters="{ Agent: '', Status: '' }"
                            />
                          </div>
                        `,
                    },
                },
            },
        });
    });

    afterEach(() => {
        wrapper?.unmount();
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

        await wrapper.vm.showSummary();
        await flushPromises();
        expect(wrapper.vm.summary.show).toBe(true);

        await wrapper.vm.showSummary();
        await flushPromises();
        expect(wrapper.vm.summary.show).toBe(false);
    });

    it('applies expiring filter when banner is clicked', async () => {
        await wrapper.vm.handleExpiringRequests();
        await flushPromises();

        expect(resetFilterParkingRequests).toHaveBeenCalled();
        expect(extractExpiringRequests).toHaveBeenCalled();
        expect(wrapper.vm.filters.isExpiring).toBe(true);
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

    it('applyFilters applies all active filters', async () => {
        await wrapper.setData({
            filters: {
                Agent: 'dev',
                Status: 'Registered',
                UpdatedAt: null,
                isExpiring: true,
            },
        });

        await wrapper.vm.applyFilters();
        await flushPromises();
        expect(resetFilterParkingRequests).toHaveBeenCalled();
        expect(extractExpiringRequests).toHaveBeenCalled();
        expect(extractRequestsByAgentName).toHaveBeenCalled();
        expect(extractRequestsByStatus).toHaveBeenCalled();
    });

    it('removeAgentFilter clears agent filter', async () => {
        await wrapper.setData({
            filters: { ...wrapper.vm.filters, Agent: 'dev' },
        });

        await wrapper.vm.removeAgentFilter();
        await flushPromises();
        expect(wrapper.vm.filters.Agent).toBe('');
        expect(resetFilterParkingRequests).toHaveBeenCalled();
    });

    it('removeStatusFilter clears status filter', async () => {
        await wrapper.setData({
            filters: { ...wrapper.vm.filters, Status: 'Registered' },
        });
        await wrapper.vm.removeStatusFilter();
        await flushPromises();
        expect(wrapper.vm.filters.Status).toBe('');
        expect(resetFilterParkingRequests).toHaveBeenCalled();
    });

    it('getPriority returns correct labels', () => {
        expect(wrapper.vm.getPriority(1)).toBe('Low');
        expect(wrapper.vm.getPriority(2)).toBe('Medium');
        expect(wrapper.vm.getPriority(3)).toBe('High');
    });

    it('emits updateRequest when agent is updated', async () => {
        await wrapper.vm.onAgentUpdate(parkingRequests[0], 1);
        await flushPromises();
        const emitted = wrapper.emitted('updateRequest');
        expect(emitted).toBeTruthy();
        expect(emitted[0][0].Agent).toBe('dev');
    });

    it('emits updateRequest when status is updated', async () => {
        await wrapper.vm.onStatusUpdate(parkingRequests[0], 2);
        await flushPromises();
        const payload = wrapper.emitted('updateRequest').at(-1)[0];
        expect(payload.Status).toBe(2);
    });

    it('updates latitude and longitude correctly', async () => {
        await wrapper.vm.updateLatLng(
            parkingRequests[0],
            '28.700000,77.300000',
        );
        await flushPromises();
        const payload = wrapper.emitted('updateRequest').at(-1)[0];
        expect(payload.Latitude).toBeCloseTo(28.7);
        expect(payload.Longitude).toBeCloseTo(77.3);
    });

    it('stores old comments safely', () => {
        wrapper.vm.storeOldComment({ Comments: 'old comment' });
        expect(wrapper.vm.oldComments).toBe('old comment');
    });

    it('onCommentUpdate appends comment and emits updateRequest', async () => {
        const row = { ID: 1, Comments: '' };

        await wrapper.vm.onCommentUpdate(row, '', 'New comment');
        await flushPromises();
        const emitted = wrapper.emitted('updateRequest');
        expect(emitted).toBeTruthy();
        expect(row.Comments).toContain('New comment');
    });

    it('opens connect popup with selected row', async () => {
        await wrapper.vm.onConnect(parkingRequests[0]);
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

    it('formatDate formats date to YYYY-MM-DD', () => {
        expect(wrapper.vm.formatDate('2024-01-15T10:00:00Z')).toBe(
            '2024-01-15',
        );
    });

    it('getLatLng returns lat,lng string', () => {
        expect(wrapper.vm.getLatLng(28.6, 77.2)).toBe('28.6,77.2');
    });

    it('emits toSrp event with latitude and longitude', async () => {
        await wrapper.vm.toSrp(28.6, 77.2);
        await flushPromises();
        const emitted = wrapper.emitted('toSrp');
        expect(emitted).toBeTruthy();
        expect(emitted[0]).toEqual([28.6, 77.2]);
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
