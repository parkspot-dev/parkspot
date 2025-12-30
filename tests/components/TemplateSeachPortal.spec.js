import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';
import TemplateSearchPortal from '@/components/templates/TemplateSearchPortal.vue';

describe('TemplateSearchPortal.vue', () => {
    let store;
    let wrapper;

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
                        extractExpiringRequests: vi.fn(),
                        extractRequetsByAgentName: vi.fn(),
                        extractRequetsByStatus: vi.fn(),
                        resetFilterParkingRequests: vi.fn(),
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
                            '<button class="atom-button"><slot /></button>',
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
        vi.restoreAllMocks();
    });

    it('renders search portal layout', () => {
        expect(wrapper.find('.search-portal-wrapper').exists()).toBe(true);
    });

    it('shows expiring requests banner', () => {
        expect(wrapper.text()).toContain('expiring requests');
    });

    it('renders summary section when enabled', () => {
        expect(wrapper.find('.summary').exists()).toBe(true);
        expect(wrapper.find('.atom-button').exists()).toBe(true);
    });

    it('toggles summary on button click', async () => {
        const btn = wrapper.find('.atom-button');
        expect(wrapper.vm.summary.show).toBe(false);
        await btn.trigger('click');
        await flushPromises();
        expect(wrapper.vm.summary.show).toBe(true);
        await btn.trigger('click');
        await flushPromises();
        expect(wrapper.vm.summary.show).toBe(false);
    });

    it('applies expiring filter when banner is clicked', async () => {
        const spy = vi.spyOn(
            store._actions['searchPortal/extractExpiringRequests'],
            '0',
        );

        await wrapper.vm.handleExpiringRequests();
        await flushPromises();
        expect(wrapper.vm.filters.isExpiring).toBe(true);
        expect(spy).toHaveBeenCalled();
    });

    it('applies agent filter', async () => {
        const spy = vi.spyOn(
            store._actions['searchPortal/extractRequetsByAgentName'],
            '0',
        );

        await wrapper.vm.handleAgentFilter('dev');
        await flushPromises();
        expect(wrapper.vm.filters.Agent).toBe('dev');
        expect(spy).toHaveBeenCalled();
    });

    it('applies status filter', async () => {
        const spy = vi.spyOn(
            store._actions['searchPortal/extractRequetsByStatus'],
            '0',
        );

        await wrapper.vm.handleStatusFilter('Registered');
        await flushPromises();
        expect(wrapper.vm.filters.Status).toBe('Registered');
        expect(spy).toHaveBeenCalled();
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
        const emitted = wrapper.emitted('updateRequest');
        expect(emitted.at(-1)[0].Status).toBe(2);
    });

    it('emits updateRequest when comment is updated', async () => {
        wrapper.vm.onCommentUpdate(parkingRequests[0], '', 'new comment');
        await flushPromises();
        const emitted = wrapper.emitted('updateRequest');
        expect(emitted.at(-1)[0].Comments).toContain('new comment');
    });

    it('emits updateRequest when next call date changes', async () => {
        wrapper.vm.onDateUpdate(parkingRequests[0], '2025-01-01T00:00:00Z');
        await flushPromises();
        const emitted = wrapper.emitted('updateRequest');
        expect(emitted.at(-1)[0].NextCall).toBe('2025-01-01T00:00:00Z');
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

    it('switches desktop and mobile view correctly', () => {
        wrapper.vm.windowWidth = 1200;
        wrapper.vm.isMobileDevice = false;
        expect(wrapper.vm.isDesktopView).toBe(true);
        wrapper.vm.windowWidth = 500;
        expect(wrapper.vm.isDesktopView).toBe(false);
    });

    it('has correct initial filter state', () => {
        expect(wrapper.vm.filters.isExpiring).toBe(false);
        expect(wrapper.vm.filters.Agent).toBe('');
        expect(wrapper.vm.filters.Status).toBe('');
    });
});
