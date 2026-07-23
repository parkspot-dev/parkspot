import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ActiveBookings from '@/components/booking-portal/ActiveBookings.vue';

vi.mock('@/constant/enums', () => ({
    getPaymentPeriodicityLabel: vi.fn(() => 'Monthly'),
    getBookingStatusLabel: vi.fn(() => 'Active'),
}));

const routerMock = {
    resolve: vi.fn(({ name, params, query }) => {
        return {
            href: `/mocked/${name}?${params?.spotId || query?.bookingId}`,
        };
    }),
};

const mockBookings = [
    {
        ID: 101,
        Name: 'Dev Shrivastav',
        Mobile: '8595788258',
        SOContactDetails: {
            FullName: 'Dev Shrivastav',
            Mobile: '8595788258',
        },
        SiteID: 'SITE123',
        Status: 1,
        Rent: 5000,
        PaymentPeriod: 2,
    },
];

const stubs = {
    BTable: {
        template: '<div class="b-table"><slot /></div>',
    },
    BTableColumn: {
        template: '<div class="b-table-column"><slot :row="rowMock" /></div>',
        data() {
            return {
                rowMock: mockBookings[0],
            };
        },
    },
    BInput: {
        props: ['modelValue', 'value'],
        template:
            '<input class="b-input" :value="modelValue || value" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    },
    BField: {
        template: '<div class="b-field"><slot /></div>',
    },
};

const factory = (props = {}) =>
    mount(ActiveBookings, {
        props: {
            activeBookings: mockBookings,
            ...props,
        },
        global: {
            stubs,
            mocks: {
                $router: routerMock,
            },
        },
    });

describe('ActiveBookings.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = factory();
    });

    afterEach(() => {
        wrapper.unmount();
        vi.clearAllMocks();
    });

    it('renders component', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('uses default empty array for activeBookings prop', () => {
        const defaultWrapper = mount(ActiveBookings, {
            global: {
                stubs,
                mocks: {
                    $router: routerMock,
                },
            },
        });
        expect(defaultWrapper.vm.activeBookings).toEqual([]);
        defaultWrapper.unmount();
    });

    it('renders b-table', () => {
        expect(wrapper.find('.b-table').exists()).toBe(true);
    });

    it('updates mobileSearchQuery when b-input receives input', async () => {
        const inputWrapper = wrapper.find('.b-input');
        expect(inputWrapper.exists()).toBe(true);
        await inputWrapper.setValue('Search Query');
        expect(wrapper.vm.mobileSearchQuery).toBe('Search Query');
    });

    it('generates SDP URL correctly', () => {
        const url = wrapper.vm.sdpURL('SITE123');

        expect(routerMock.resolve).toHaveBeenCalled();
        expect(url).toContain('spot-detail');
    });

    it('generates booking details URL correctly', () => {
        const url = wrapper.vm.bookingDetailsURL(101);

        expect(routerMock.resolve).toHaveBeenCalled();
        expect(url).toContain('booking-portal');
    });

    it('returns payment periodicity label', () => {
        const label = wrapper.vm.getPaymentPeriodicityLabel(2);
        expect(label).toBe('Monthly');
    });

    it('returns booking status label', () => {
        const label = wrapper.vm.getBookingStatusLabel(1);
        expect(label).toBe('Active');
    });

    describe('filteredActiveBookings computed property', () => {
        const sampleBookings = [
            {
                ID: 1,
                Name: 'Dev Shrivastav',
                Mobile: '8595788258',
                SOContactDetails: {
                    FullName: 'Space Owner One',
                    Mobile: '7777711111',
                },
            },
            {
                ID: 2,
                Name: 'Vendor Two',
                Mobile: '9999922222',
                SOContactDetails: {
                    FullName: 'Dev Manager',
                    Mobile: '8595788258',
                },
            },
            {
                ID: 3,
                Name: null,
                Mobile: null,
                SOContactDetails: null,
            },
        ];

        it('returns all active bookings when mobileSearchQuery is empty', () => {
            wrapper = factory({ activeBookings: sampleBookings });
            wrapper.vm.mobileSearchQuery = '';
            expect(wrapper.vm.filteredActiveBookings).toHaveLength(3);
        });

        it('filters active bookings by VO Name', () => {
            wrapper = factory({ activeBookings: sampleBookings });
            wrapper.vm.mobileSearchQuery = 'shrivastav';
            expect(wrapper.vm.filteredActiveBookings).toHaveLength(1);
            expect(wrapper.vm.filteredActiveBookings[0].ID).toBe(1);
        });

        it('filters active bookings by VO Mobile', () => {
            wrapper = factory({ activeBookings: sampleBookings });
            wrapper.vm.mobileSearchQuery = '8595788258';
            expect(wrapper.vm.filteredActiveBookings).toHaveLength(2);
            expect(wrapper.vm.filteredActiveBookings[0].ID).toBe(1);
        });

        it('filters active bookings by SO Name', () => {
            wrapper = factory({ activeBookings: sampleBookings });
            wrapper.vm.mobileSearchQuery = 'manager';
            expect(wrapper.vm.filteredActiveBookings).toHaveLength(1);
            expect(wrapper.vm.filteredActiveBookings[0].ID).toBe(2);
        });

        it('filters active bookings by SO Mobile', () => {
            wrapper = factory({ activeBookings: sampleBookings });
            wrapper.vm.mobileSearchQuery = '7777711111';
            expect(wrapper.vm.filteredActiveBookings).toHaveLength(1);
            expect(wrapper.vm.filteredActiveBookings[0].ID).toBe(1);
        });

        it('returns empty array when search query matches no items', () => {
            wrapper = factory({ activeBookings: sampleBookings });
            wrapper.vm.mobileSearchQuery = 'nonexistent';
            expect(wrapper.vm.filteredActiveBookings).toHaveLength(0);
        });

        it('handles missing or null fields gracefully', () => {
            wrapper = factory({ activeBookings: sampleBookings });
            wrapper.vm.mobileSearchQuery = 'something';
            expect(() => wrapper.vm.filteredActiveBookings).not.toThrow();
        });
    });
});
