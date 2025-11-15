<template>
    <div class="page-my-booking">
        <h1 class="page-title">My Bookings</h1>

        <div class="booking-layout">
            <BookingSidebar
                :activebookings="activeBookings"
                :pastbookings="pastBookings"
                :requestbookings="requestedBookings"
                :selectedBooking="selectedBooking"
                @select-booking="onSelectBooking"
                @update-query="onQueryUpdate"
            />
            <BookingDetails :booking="selectedBooking" />
        </div>
    </div>
</template>

<script>
import BookingSidebar from '@/components/my-bookings/BookingSidebar.vue';
import BookingDetails from '@/components/my-bookings/BookingDetails.vue';
import { mapActions, mapState } from 'vuex';

export default {
    name: 'PageMyBooking',
    components: { BookingSidebar, BookingDetails },

    data() {
        return {
            selectedBooking: null,
        };
    },

    computed: {
        ...mapState('myBookings', [
            'isLoading',
            'hasError',
            'errorMessage',
            'activeBookings',
            'pastBookings',
            'requestedBookings',
        ]),
    },

    methods: {
        ...mapActions('myBookings', ['fetchUsersRequests']),

        onSelectBooking(booking) {
            this.selectedBooking = booking;
        },

        onQueryUpdate(query) {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', query.tab);

            if (query.bookingId)
                url.searchParams.set('bookingId', query.bookingId);
            else url.searchParams.delete('bookingId');

            window.history.replaceState({}, '', url.toString());
        },

        restoreSelectionFromUrl() {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get('tab');
            const bookingId = params.get('bookingId');
            let list = [];
            if (tab === 'Active') list = this.activeBookings;
            else if (tab === 'Request') list = this.requestedBookings;
            else list = this.pastBookings;

            const booking =
                list.find((b) => b.BookingID == bookingId) || list[0];

            if (booking) this.selectedBooking = booking;
        },
    },

    mounted() {
        this.fetchUsersRequests().then(() => {
            this.restoreSelectionFromUrl();
        });
    },
};
</script>

<style scoped lang="scss">
.page-my-booking {
    background: #f5f5fb;
    min-height: 100vh;
    padding: 20px;
}

.page-title {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 20px;
}

.booking-layout {
    display: flex;
    gap: 20px;
    align-items: flex-start;
}

.booking-layout > *:first-child {
    width: 320px;
    flex-shrink: 0;
}

.booking-layout > *:last-child {
    flex: 1;
}

@media (max-width: 992px) {
    .booking-layout {
        flex-direction: column;
    }

    .booking-layout > *:first-child {
        width: 100%;
    }
}
</style>
