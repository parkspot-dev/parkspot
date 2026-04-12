import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';
import TemplateSearchPortal from '@/components/templates/TemplateSearchPortal.vue';

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
        IsExpiring: false,
    },
];

const buildStore = ({ isAdmin = true } = {}) => {
    const applyParkingRequestFilters = vi.fn();

    const store = createStore({
        modules: {
            searchPortal: {
                namespaced: true,
                state: () => ({
                    agentList: [{ id: 'dev', name: 'dev' }],
                    expiringRequestsCount: 1,
                    parkingRequests,
                    filteredParkingRequests: parkingRequests,
                }),
                mutations: {
                    setParkingRequests(state, requests) {
                        state.parkingRequests = requests;
                        state.filteredParkingRequests = requests;
                    },
                },
                actions: {
                    applyParkingRequestFilters,
                    getAgents: vi.fn(),
                    setAgents: vi.fn(),
                },
            },
            user: {
                namespaced: true,
                state: () => ({
                    isAdmin,
                    userProfile: { FullName: 'dev' },
                }),
            },
        },
    });

    return { store, applyParkingRequestFilters };
};

const createBTableColumnStub = () => ({
    name: 'b-table-column',
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
});

const mountComponent = ({
    isAdmin = true,
    isLoading = false,
    isSummary = true,
} = {}) => {
    const { store, applyParkingRequestFilters } = buildStore({ isAdmin });

    const wrapper = mount(TemplateSearchPortal, {
        props: {
            parkingRequests,
            isLoading,
            isSummary,
        },
        global: {
            plugins: [store],
            mocks: {
                $route: {
                    query: {},
                },
            },
            stubs: {
                AtomButton: {
                    name: 'AtomButton',
                    inheritAttrs: false,
                    template:
                        '<button v-bind="$attrs" class="atom-button" @click="$emit(\'click\')"><slot /></button>',
                },
                AtomIcon: {
                    name: 'AtomIcon',
                    template:
                        '<button data-testid="summary-close" @click="$emit(\'click\')" />',
                },
                AtomInput: {
                    name: 'AtomInput',
                    inheritAttrs: false,
                    props: ['modelValue', 'placeholder'],
                    template: '<input />',
                },
                AtomTextarea: {
                    name: 'AtomTextarea',
                    inheritAttrs: false,
                    props: ['modelValue'],
                    template: '<textarea />',
                },
                AtomDatePicker: {
                    name: 'AtomDatePicker',
                    template: '<div />',
                },
                AtomSelectInput: {
                    name: 'AtomSelectInput',
                    props: ['modelValue', 'list', 'placeholder'],
                    template: '<div />',
                },
                SelectInput: {
                    name: 'SelectInput',
                    props: ['defaultValue', 'list', 'name'],
                    template: '<div />',
                },
                FilterDropdown: {
                    name: 'FilterDropdown',
                    props: ['label', 'options', 'selectedValue'],
                    template: '<div />',
                },
                MobileView: {
                    name: 'MobileView',
                    template: '<div data-testid="mobile-view-stub" />',
                },
                'b-table': {
                    name: 'b-table',
                    template: '<div data-testid="desktop-table"><slot /><slot name="empty" /></div>',
                },
                'b-table-column': createBTableColumnStub(),
            },
        },
    });

    applyParkingRequestFilters.mockClear();

    return { wrapper, applyParkingRequestFilters };
};

describe('TemplateSearchPortal.vue', () => {
    let wrapper;
    let applyParkingRequestFilters;

    beforeEach(() => {
        vi.clearAllMocks();
        window.history.pushState({}, '', '/search-portal');

        ({ wrapper, applyParkingRequestFilters } = mountComponent());
    });

    afterEach(() => {
        wrapper?.unmount();
    });

    const switchToDesktopView = async () => {
        await wrapper.setData({
            windowWidth: 1200,
            isMobileDevice: false,
        });
        await flushPromises();
    };

    it('renders the search portal layout with expiring requests summary', () => {
        expect(wrapper.get('.search-portal-wrapper').exists()).toBe(true);
        expect(wrapper.text()).toContain('expiring requests');
        expect(wrapper.get('.atom-button').text()).toBe(
            'Show Summary',
        );
    });

    it('shows and hides the summary panel when the user clicks the summary button', async () => {
        const summaryButton = wrapper.getComponent({ name: 'AtomButton' });

        summaryButton.vm.$emit('click');
        await flushPromises();

        expect(wrapper.get('.atom-button').text()).toBe(
            'Hide Summary',
        );
        expect(wrapper.get('.so-summary').text()).toContain(
            'Total Requests: 1',
        );

        summaryButton.vm.$emit('click');
        await flushPromises();

        expect(wrapper.get('.atom-button').text()).toBe(
            'Show Summary',
        );
    });

    it('applies the expiring filter when the user clicks the expiring requests link', async () => {
        await wrapper.get('.hyperlink').trigger('click');
        await flushPromises();

        expect(applyParkingRequestFilters).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                isExpiring: true,
                status: null,
                agentName: '',
            }),
        );
        expect(window.location.search).toContain('isExpiring=true');
    });

    it('applies the agent filter when the user selects an agent', async () => {
        const agentFilter = wrapper.findAllComponents({ name: 'FilterDropdown' })[1];

        agentFilter.vm.$emit('update', 'dev');
        await flushPromises();

        expect(applyParkingRequestFilters).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                isExpiring: false,
                status: null,
                agentName: 'dev',
            }),
        );
        expect(window.location.search).toContain('agent=dev');
    });

    it('applies the status filter when the user selects a status', async () => {
        const statusFilter = wrapper.findAllComponents({ name: 'FilterDropdown' })[2];

        statusFilter.vm.$emit('update', 'Registered');
        await flushPromises();

        expect(applyParkingRequestFilters).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                isExpiring: false,
                status: 1,
                agentName: '',
            }),
        );
        expect(window.location.search).toContain('status=1');
    });

    it('applies all active filters when the user combines filter selections', async () => {
        const [requestTypeFilter, agentFilter, statusFilter] = wrapper.findAllComponents({
            name: 'FilterDropdown',
        });

        requestTypeFilter.vm.$emit('update');
        agentFilter.vm.$emit('update', 'dev');
        statusFilter.vm.$emit('update', 'Registered');
        await flushPromises();

        expect(applyParkingRequestFilters).toHaveBeenLastCalledWith(
            expect.anything(),
            expect.objectContaining({
                isExpiring: true,
                status: 1,
                agentName: 'dev',
            }),
        );
    });

    it('clears the agent filter when the user removes it from the dropdown', async () => {
        const agentFilter = wrapper.findAllComponents({ name: 'FilterDropdown' })[1];

        agentFilter.vm.$emit('update', 'dev');
        await flushPromises();
        applyParkingRequestFilters.mockClear();

        agentFilter.vm.$emit('remove');
        await flushPromises();

        expect(applyParkingRequestFilters).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                isExpiring: false,
                status: null,
                agentName: '',
            }),
        );
    });

    it('clears the status filter when the user removes it from the dropdown', async () => {
        const statusFilter = wrapper.findAllComponents({ name: 'FilterDropdown' })[2];

        statusFilter.vm.$emit('update', 'Registered');
        await flushPromises();
        applyParkingRequestFilters.mockClear();

        statusFilter.vm.$emit('remove');
        await flushPromises();

        expect(applyParkingRequestFilters).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                isExpiring: false,
                status: null,
                agentName: '',
            }),
        );
    });

    it('emits updateRequest when the admin changes the assigned agent', async () => {
        const agentSelect = wrapper
            .findAllComponents({ name: 'AtomSelectInput' })
            .find((component) => component.props('placeholder') === 'Select Agent');

        agentSelect.vm.$emit('change', 'dev');
        await flushPromises();

        expect(wrapper.emitted('updateRequest')).toBeDefined();
        expect(wrapper.emitted('updateRequest')[0][0]).toEqual(
            expect.objectContaining({
                ID: 1,
                Agent: 'dev',
            }),
        );
    });

    it('opens the connect popup when a non-admin user clicks connect', async () => {
        wrapper.unmount();
        ({ wrapper, applyParkingRequestFilters } = mountComponent({ isAdmin: false }));
        await switchToDesktopView();

        await wrapper.get('.btn.px-2').trigger('click');
        await flushPromises();

        expect(wrapper.get('.popup-container').exists()).toBe(true);
        expect(wrapper.text()).toContain('Contact With dev on');
    });

    it('emits updateRequest when the user changes status from the connect popup', async () => {
        wrapper.unmount();
        ({ wrapper, applyParkingRequestFilters } = mountComponent({ isAdmin: false }));
        await switchToDesktopView();

        await wrapper.get('.btn.px-2').trigger('click');
        await flushPromises();

        const statusSelect = wrapper.getComponent({ name: 'SelectInput' });

        statusSelect.vm.$emit('change', { target: { value: 'Processing' } });
        await flushPromises();

        expect(wrapper.emitted('updateRequest')).toBeDefined();
        expect(wrapper.emitted('updateRequest')[0][0]).toEqual(
            expect.objectContaining({
                ID: 1,
                Status: 2,
            }),
        );
    });

    it('emits updateRequest when the user changes the lat lng field', async () => {
        const latLngInput = wrapper
            .findAllComponents({ name: 'AtomInput' })
            .find(
                (component) =>
                    component.props('modelValue') === '28.613900, 77.209000',
            );

        latLngInput.vm.$emit('change', {
            target: { value: '28.700000,77.300000' },
        });
        await flushPromises();

        expect(wrapper.emitted('updateRequest')).toBeDefined();
        expect(wrapper.emitted('updateRequest')[0][0]).toEqual(
            expect.objectContaining({
                ID: 1,
                Latitude: 28.7,
                Longitude: 77.3,
            }),
        );
    });

    it('appends a note and emits updateRequest when the user updates comments from the popup', async () => {
        wrapper.unmount();
        ({ wrapper, applyParkingRequestFilters } = mountComponent({ isAdmin: false }));
        await switchToDesktopView();

        await wrapper.get('.btn.px-2').trigger('click');
        await wrapper.setData({ newComment: 'New comment' });
        await flushPromises();

        await wrapper.get('.popup .btn').trigger('click');
        await flushPromises();

        expect(wrapper.emitted('updateRequest')).toBeDefined();
        expect(wrapper.emitted('updateRequest')[0][0]).toEqual(
            expect.objectContaining({
                ID: 1,
            }),
        );
        expect(wrapper.emitted('updateRequest')[0][0].Comments).toContain(
            'New comment',
        );
    });

    it('emits toSrp when the user clicks the lat lng link', async () => {
        await wrapper.get('.lat-lng-link a').trigger('click');
        await flushPromises();

        expect(wrapper.emitted('toSrp')).toBeDefined();
        expect(wrapper.emitted('toSrp')[0]).toEqual([28.6139, 77.209]);
    });

    it('shows the mobile loader and hides the mobile content while loading', async () => {
        wrapper.unmount();
        ({ wrapper, applyParkingRequestFilters } = mountComponent({ isLoading: true }));

        await wrapper.setData({
            windowWidth: 500,
            isMobileDevice: false,
        });
        await flushPromises();

        expect(wrapper.get('.loading').exists()).toBe(true);
        expect(wrapper.find('[data-testid="mobile-view-stub"]').exists()).toBe(false);
    });
});
