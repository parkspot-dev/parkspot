import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ActiveBookings from "@/components/booking-portal/ActiveBookings.vue";


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
        Name: 'Vendor One',
        Mobile: '1234567890',
        SOContactDetails: {
            FullName: 'SO Name',
            Mobile: '8888888888',
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

let wrapper;

beforeEach(() => {
    wrapper = factory();
});

afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
});

describe('ActiveBookings.vue', () => {
    it('renders component', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('renders b-table', () => {
        expect(wrapper.find('.b-table').exists()).toBe(true);
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
});