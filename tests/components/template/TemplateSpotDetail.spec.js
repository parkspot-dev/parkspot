import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';
import TemplateSpotDetail from '@/components/templates/TemplateSpotDetail.vue';

const flushPromises = () => new Promise(setImmediate);

describe('TemplateSpotDetail.vue', () => {
    let store;
    let actions;

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
                        template:
                            '<input class="date-picker" @change="$emit(\'changed\', $event.target.value)" />',
                    },
                    AtomTextarea: {
                        template:
                            '<textarea class="remark-textarea" @input="$emit(\'changed\', $event.target.value)" />',
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
        vi.restoreAllMocks();
    });

    it('renders spot title and address', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('h1').text()).toBe('Test Spot');
        expect(wrapper.text()).toContain('C-51 Shyam Park Extension');
        expect(wrapper.text()).toContain('Ghaziabad');
    });

    it('returns images when available', () => {
        const wrapper = mountComponent();
        expect(wrapper.vm.displayImages).toEqual(['img1.jpg']);
    });

    it('falls back to thumbnail when images is empty', () => {
        store = createStoreInstance({
            state: { images: [] },
        });
        const wrapper = mountComponent();
        expect(wrapper.vm.displayImages).toEqual(['thumb1.jpg']);
    });

    it('hides facilities section when no facilities', () => {
        store = createStoreInstance({
            state: {
                spotDetails: {
                    Facilities: [],
                },
            },
        });
        const wrapper = mountComponent();
        expect(wrapper.find('.facility-card').exists()).toBe(false);
    });

    it('emits changeAvailability -1 on Mark Rented', async () => {
        const wrapper = mountComponent();
        const btn = wrapper.findAll('button').find(b =>
            b.text().includes('Mark Rented'),
        );
        expect(btn).toBeDefined();
        await btn.trigger('click');
        expect(wrapper.emitted().changeAvailability[0]).toEqual([-1]);
    });

    it('emits changeAvailability 1 on Mark Available', async () => {
        store = createStoreInstance({
            state: { isAvailable: false },
        });
        const wrapper = mountComponent();
        const btn = wrapper.findAll('button').find(b =>
            b.text().includes('Mark Available'),
        );
        expect(btn).toBeDefined();
        await btn.trigger('click');
        expect(wrapper.emitted().changeAvailability[0]).toEqual([1]);
    });

    it('emits goToSearchPortal with lat long', async () => {
        const wrapper = mountComponent();
        const btn = wrapper.findAll('button').find(b =>
            b.text().includes("Interested VO's"),
        );
        expect(btn).toBeDefined();
        await btn.trigger('click');
        expect(wrapper.emitted().goToSearchPortal[0]).toEqual([[11.11, 22.22]]);
    });

    it('emits changeLastCallDate from AtomDatePicker', async () => {
        const wrapper = mountComponent();
        const picker = wrapper.find('.date-picker');
        expect(picker.exists()).toBe(true);
        await picker.setValue('2025-12-20');
        expect(wrapper.emitted().changeLastCallDate[0]).toEqual(['2025-12-20']);
    });

    it('emits changeRemark from AtomTextarea', async () => {
        const wrapper = mountComponent();
        const textarea = wrapper.find('.remark-textarea');
        expect(textarea.exists()).toBe(true);
        await textarea.setValue('Updated Remark');
        expect(wrapper.emitted().changeRemark[0]).toEqual(['Updated Remark']);
    });

    it('handles getSpotDetails failure gracefully', async () => {
        store = createStoreInstance({
            actions: {
                getSpotDetails: vi.fn().mockRejectedValue(
                    new Error('API Error'),
                ),
            },
        });

        expect(() => mountComponent()).not.toThrow();
        await flushPromises();
    });

    it('matches snapshot for title section', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('h1').html()).toMatchSnapshot();
    });

    it('matches snapshot for first facility item', () => {
        const wrapper = mountComponent();
        const facility = wrapper.find('.facility-card');
        expect(facility.exists()).toBe(true);
        expect(facility.html()).toMatchSnapshot();
    });
});
