<template>
    <div class="booking-sidebar">
        <div class="sidebar-header">
            <div class="filter-buttons">
                <button
                    v-for="tab in tabs"
                    :key="tab"
                    @click="changeTab(tab)"
                    :class="{ active: activeTab === tab }"
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
                @click="selectCard(booking)"
                :class="{
                    selected:
                        selectedBooking &&
                        selectedBooking.BookingID === booking.BookingID,
                }"
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
                    <h3>{{ booking?.SiteDetails?.SiteName }}</h3>
                    <p class="address">{{ booking?.SiteDetails?.Address }}</p>
                    <div v-if="activeTab !== 'Past'" class="btn-container">
                        <AtomButton
                            class="cancel-btn"
                            @click.native="cancelBooking(booking)"
                        >
                            Cancel
                        </AtomButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BookingSidebar',
    props: {
        activebookings: Array,
        pastbookings: Array,
        requestbookings: Array,
        selectedBooking: Object,
    },

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

    methods: {
        // User clicks on tab
        changeTab(tab) {
            this.activeTab = tab;
            this.$emit('tab-change', tab);
            const firstBooking = this.filteredBookings[0];
            if (firstBooking) this.selectCard(firstBooking);
            else this.emitQuery();
        },

        cancelBooking(booking) {
            const phone = '917488239471';

            const message = `I want to cancel my booking.
Booking ID: ${booking.BookingID}`;

            const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

            const win = window.open(url, '_blank');

            if (!win) {
                alert(
                    `Could not open WhatsApp. Please contact us on 7488239471 to cancel the booking.`,
                );
            }
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
};
</script>
<style scoped lang="scss">
.booking-sidebar {
    background: var(--parkspot-white);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 16px;
    display: flex;
    flex-direction: column;
    height: 85vh;
    overflow-y: auto;
}

.sidebar-header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}
.filter-buttons {
    display: flex;
    justify-content: space-between;
    background: #f3f4f6;
    border-radius: 8px;
    padding: 4px;
}

.filter-buttons button {
    flex: 1;
    background: transparent;
    border: none;
    font-weight: 500;
    font-size: 14px;
    color: var(--parkspot-black);
    padding: 8px 0;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s;
}

.filter-buttons button.active {
    background: var(--secondary-color);
    color: #fff;
}

.booking-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.booking-card {
    display: flex;
    gap: 12px;
    background: #fafafa;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    align-items: center;
    border: 1px solid transparent;
}

.booking-card.selected {
    border: 2px solid var(--secondary-color);
}

.card-left img {
    width: 80px;
    height: 100px;
    border-radius: 6px;
    object-fit: cover;
}

.card-right {
    flex: 4;
    text-align: left;
    position: relative;
}

.booking-id {
    padding-top: 4px;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 4px;
}

.card-right h3 {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    margin: 0;
}

.address {
    margin-top: 4px;
    font-size: 12px;
    color: black;
    margin-bottom: 8px;
}

.status-badge {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 6px;
    border-radius: 4px;
    text-transform: uppercase;
}

.cancel-btn {
    border-radius: 6px;
    border: 1px solid #eb2727 !important;
    border: none;
    box-shadow: inset;
    color: #eb2727;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 12px;
    transition: 0.2s ease;
}
</style>
