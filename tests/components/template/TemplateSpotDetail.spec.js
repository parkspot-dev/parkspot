import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';
import TemplateSpotDetail from '@/components/templates/TemplateSpotDetail.vue';

describe('TemplateSpotDetail.vue', () => {
    let store;
    let actions;
    let wrapper;

    const mountComponent = () =>
        mount(TemplateSpotDetail, {
            global: {
                plugins: [store],
                stubs: {
                    BodyWrapper: { template: '<div><slot /></div>' },
                    ImageGallery: {
                        template: '<div />',
                        props: ['images', 'locationName', 'removable'],
                    },
                    SpotRateCard: true,
                    MapContainer: {
                        template: '<div />',
                        props: ['center', 'spotDetails', 'zoom'],
                    },
                    InfographicSteps: true,
                    AtomDatePicker: {
                        name: 'AtomDatePicker',
                        template: '<div class="date-picker"></div>',
                    },
                    AtomTextarea: {
                        name: 'AtomTextarea',
                        template: '<div class="remark-textarea"></div>',
                    },
                    AtomButton: {
                        template:
                            '<button @click="$emit(\'click\')"><slot /></button>',
                    },
                },
            },
        });

    const createStoreInstance = (overrides = {}) => {
        actions = {
            getSpotDetails: vi.fn().mockResolvedValue(),
            ...overrides.actions,
        };

        return createStore({
            modules: {
                sdp: {
                    namespaced: true,
                    actions,
                    state: {
                        images: ['img1.jpg'],
                        thumbnail: ['thumb1.jpg'],
                        center: [12.97, 77.59],
                        isAvailable: true,
                        ownerInfoDetails: {
                            UserName: 'dev_shrivastav',
                            FullName: 'Dev Shrivastav',
                            Mobile: '9876543210',
                            KYCStatus: 1,
                        },
                        paymentDetails: 'UPI: dev@okaxis',
                        selectedSpot: [
                            { Name: 'Test Spot', Lat: 11.11, Long: 22.22 },
                        ],
                        spotDetails: {
                            Name: 'Test Spot',
                            Address: 'C-51 Shyam Park Extension',
                            Area: 'Ghaziabad',
                            City: 'Uttar Pradesh',
                            Facilities: [
                                {
                                    FacilityID: 1,
                                    Name: 'CCTV',
                                    IconURL: 'cctv_icon',
                                },
                            ],
                            Remark: 'Good',
                            UpdatedAt: '2025-12-01',
                            LastCallDate: '2025-12-10',
                            Lat: 11.11,
                            Long: 22.22,
                        },
                        spotInProgressBookings: [
                            {
                                ID: 'B1',
                                Status: 1,
                                AgentFullName: 'Preety Sharma',
                            },
                        ],
                        ...overrides.state,
                    },
                },
            },
        });
    };

    beforeEach(() => {
        store = createStoreInstance();
    });

    afterEach(() => {
        wrapper?.unmount();
        vi.restoreAllMocks();
    });

    it('renders spot title and address', () => {
        wrapper = mountComponent();
        expect(wrapper.find('h1').text()).toBe('Test Spot');
        expect(wrapper.text()).toContain('C-51 Shyam Park Extension');
        expect(wrapper.text()).toContain('Ghaziabad');
        expect(wrapper.text()).toContain('Uttar Pradesh');
    });

    it('returns images when available', () => {
        wrapper = mountComponent();
        expect(wrapper.vm.displayImages).toEqual(['img1.jpg']);
    });

    it('falls back to thumbnail when images is empty', () => {
        store = createStoreInstance({
            state: { images: [] },
        });
        wrapper = mountComponent();
        expect(wrapper.vm.displayImages).toEqual(['thumb1.jpg']);
    });

    it('hides facilities section when no facilities', () => {
        store = createStoreInstance({
            state: {
                spotDetails: { Facilities: [] },
            },
        });

        wrapper = mountComponent();
        expect(wrapper.find('.facility-card').exists()).toBe(false);
    });

    it('emits goToSearchPortal with correct lat long', async () => {
        wrapper = mountComponent();
        const buttons = wrapper.findAll('button');
        await buttons[0].trigger('click');
        expect(wrapper.emitted().goToSearchPortal[0]).toEqual([[11.11, 22.22]]);
    });

    it('emits changeAvailability -1 on Mark Rented', async () => {
        wrapper = mountComponent();
        const buttons = wrapper.findAll('button');
        await buttons[1].trigger('click');
        expect(wrapper.emitted().changeAvailability[0]).toEqual([-1]);
    });

    it('emits changeAvailability 1 on Mark Available', async () => {
        store = createStoreInstance({
            state: { isAvailable: false },
        });

        wrapper = mountComponent();
        const buttons = wrapper.findAll('button');
        await buttons[1].trigger('click');
        expect(wrapper.emitted().changeAvailability[0]).toEqual([1]);
    });

    it('emits changeLastCallDate from AtomDatePicker', async () => {
        wrapper = mountComponent();
        const picker = wrapper.findComponent({ name: 'AtomDatePicker' });
        picker.vm.$emit('changed', '2025-12-20');
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().changeLastCallDate[0]).toEqual(['2025-12-20']);
    });

    it('emits changeRemark from AtomTextarea', async () => {
        wrapper = mountComponent();
        const textarea = wrapper.findComponent({ name: 'AtomTextarea' });
        textarea.vm.$emit('changed', 'Updated Remark');
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().changeRemark[0]).toEqual(['Updated Remark']);
    });

    it('handles getSpotDetails failure gracefully', async () => {
        store = createStoreInstance({
            actions: {
                getSpotDetails: vi
                    .fn()
                    .mockRejectedValue(new Error('API Error')),
            },
        });

        wrapper = mountComponent();
        await flushPromises();
        expect(wrapper.exists()).toBe(true);
    });

    it('matches snapshot for title section', () => {
        wrapper = mountComponent();
        expect(wrapper.find('h1').html()).toMatchSnapshot();
    });

    it('matches snapshot for first facility item', () => {
        wrapper = mountComponent();
        const facility = wrapper.find('.facility-card');
        expect(facility.exists()).toBe(true);
        expect(facility.html()).toMatchSnapshot();
    });

    it('updates rent when SpotRateCard emits update-rent', async () => {
        actions.updateRent = vi.fn();
        store = createStoreInstance({ actions });
        wrapper = mountComponent();
        const rateCard = wrapper.findComponent({ name: 'SpotRateCard' });

        rateCard.vm.$emit('update-rent', 6000);
        await wrapper.vm.$nextTick();

        expect(actions.updateRent).toHaveBeenCalledTimes(1);
        expect(actions.updateRent).toHaveBeenCalledWith(
            expect.anything(),
            6000,
        );
    });

    it('does not update rent and shows error for invalid rent', async () => {
        actions.updateRent = vi.fn();
        store = createStoreInstance({ actions });
        wrapper = mountComponent();

        wrapper.vm.$buefy = {
            dialog: {
                alert: vi.fn(),
            },
        };

        wrapper.vm.saveRent(-100);
        await wrapper.vm.$nextTick();
        expect(actions.updateRent).not.toHaveBeenCalled();
        expect(wrapper.vm.$buefy.dialog.alert).toHaveBeenCalled();
    });

    it('updates address when saveAddress is called', async () => {
        actions.updateAddress = vi.fn();
        store = createStoreInstance({ actions });
        wrapper = mountComponent();
        wrapper.vm.isEditingAddress = true;
        wrapper.vm.editableAddress = 'New Address Line';

        await wrapper.vm.saveAddress();
 
        expect(actions.updateAddress).toHaveBeenCalledTimes(1);
        expect(actions.updateAddress).toHaveBeenCalledWith(
            expect.anything(),
            'New Address Line',
        );
        expect(wrapper.vm.isEditingAddress).toBe(false);
    });

    it('resets editableAddress and exits edit mode on cancelAddressEdit', async () => {
        wrapper = mountComponent();
        wrapper.vm.isEditingAddress = true;
        wrapper.vm.editableAddress = 'Wrong Address';
        wrapper.vm.cancelAddressEdit();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isEditingAddress).toBe(false);
        expect(wrapper.vm.editableAddress).toBe('C-51 Shyam Park Extension');
    });
});
