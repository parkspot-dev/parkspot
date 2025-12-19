<template>
    <div class="booking-sidebar">
        <div class="sidebar-header">
            <div class="filter-buttons">
                <button
                    v-for="tab in tabs"
                    :key="tab"
                    :class="{ active: activeTab === tab }"
                    @click="changeTab(tab)"
                >
                    {{ tab }}
                </button>
            </div>
        </div>

        <!-- List of bookings based on active tab -->
        <div class="booking-list">
            <div
                v-for="booking in filteredBookings"
                :key="booking.BookingID"
                class="booking-card"
                :class="{
                    selected:
                        selectedBooking &&
                        selectedBooking.BookingID === booking.BookingID,
                }"
                @click="selectCard(booking)"
            >
                <div class="card-left">
                    <img
                        :src="booking?.SiteDetails?.SiteImageURI"
                        alt="booking"
                    />
                </div>
                <div class="card-right">
                    <p class="booking-id">
                        Booking ID: <strong>{{ booking.BookingID }}</strong>
                    </p>
                    <h3 class="siteDetails">
                        {{ booking?.SiteDetails?.SiteName }}
                    </h3>
                    <p class="address">{{ booking?.SiteDetails?.Address }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BookingSidebar',
    props: {
        activebookings: {
            type: Array,
            default: () => [],
        },
        pastbookings: {
            type: Array,
            default: () => [],
        },
        requestbookings: {
            type: Array,
            default: () => [],
        },
        selectedBooking: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['tab-change', 'select-booking', 'update-query'],

    data() {
        return {
            tabs: ['Past', 'Active', 'Request'],
            activeTab: 'Active',
        };
    },

    computed: {
        filteredBookings() {
            if (this.activeTab === 'Active') return this.activebookings || [];
            if (this.activeTab === 'Past') return this.pastbookings || [];
            if (this.activeTab === 'Request') return this.requestbookings || [];
            return [];
        },
    },

    watch: {
        activebookings() {
            this.restoreFromUrl();
        },
        pastbookings() {
            this.restoreFromUrl();
        },
        requestbookings() {
            this.restoreFromUrl();
        },
    },

    mounted() {
        this.restoreFromUrl();
    },

    methods: {
        // User clicks on tab
        changeTab(tab) {
            this.activeTab = tab;
            this.$emit('tab-change', tab);
            const firstBooking = this.filteredBookings[0];
            if (firstBooking) this.selectCard(firstBooking);
            else this.emitQuery();
        },

        selectCard(booking) {
            this.$emit('select-booking', booking);
            this.emitQuery(booking.BookingID);
        },

        emitQuery(bookingId = null) {
            this.$emit('update-query', {
                tab: this.activeTab,
                bookingId,
            });
        },

        restoreFromUrl() {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get('tab');
            const bookingId = params.get('bookingId');

            if (tab && this.tabs.includes(tab)) this.activeTab = tab;
            this.$nextTick(() => {
                const booking =
                    this.filteredBookings.find(
                        (b) => b.BookingID == bookingId,
                    ) || this.filteredBookings[0];

                if (booking) this.selectCard(booking);
                else this.$emit('tab-change', this.activeTab);
            });
        },
    },
};
</script>

<style scoped lang="scss">
.booking-sidebar {
    background: var(--parkspot-white);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    height: 85vh;
    overflow-y: auto;
    padding: 16px;
}

.sidebar-header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}

.filter-buttons {
    background: #f3f4f6;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    padding: 4px;
}

.filter-buttons button {
    background: transparent;
    border-radius: 6px;
    border: none;
    color: var(--parkspot-black);
    cursor: pointer;
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 0;
    transition: 0.2s;
}

.filter-buttons button.active {
    background: var(--secondary-color);
    color: var(--parkspot-white);
}

.booking-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.booking-card {
    align-items: center;
    background: var(--parkspot-white);
    border-radius: 10px;
    border: 1px solid transparent;
    cursor: pointer;
    display: flex;
    gap: 12px;
    padding: 10px;
    transition: all 0.2s ease;
}

.booking-card.selected {
    border: 2px solid var(--secondary-color);
}

.card-left img {
    border-radius: 6px;
    height: 100px;
    object-fit: cover;
    width: 80px;
}

.card-right {
    flex: 4;
    position: relative;
    text-align: left;
}

.booking-id {
    color: var(--grey-shade);
    font-size: 12px;
    margin-bottom: 4px;
    padding-top: 4px;
}

.card-right h3 {
    color: var(--parkspot-black);
    font-size: 14px;
    font-weight: 600;
    margin: 0;
}

.address {
    color: var(--parkspot-black);
    font-size: 12px;
    margin-bottom: 8px;
    margin-top: 4px;
}

.status-badge {
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 6px;
    position: absolute;
    right: 0;
    text-transform: uppercase;
    top: 0;
}

.cancel-btn {
    border-radius: 6px;
    border: 1px solid var(--parkspot-red) !important;
    box-shadow: inset;
    color: var(--parkspot-red);
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    padding: 8px 12px;
}
.siteDetails {
    color: var(--secondary-color) !important;
}
@media (max-width: 768px) {
    .booking-list {
        max-height: calc(5 * 124px);
        overflow-y: auto;
    }

    .booking-sidebar {
        height: auto;
        max-height: 90vh;
    }
}
</style>
