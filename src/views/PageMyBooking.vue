<template>
    <div class="page-my-booking">
        <h1 class="page-title">My Bookings</h1>

        <div class="booking-layout">
            <!-- Sidebar -->
            <BookingSidebar
                :activebookings="activeBookings"
                :pastbookings="pastBookings"
                :requestbookings="requestedBookings"
                :selectedBooking="selectedBooking"
                @select-booking="onSelectBooking"
            />

            <!-- Right Details -->
            <BookingDetails
                :booking="selectedBooking"
            />
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
          console.log("this is bookings", booking);
            this.selectedBooking = booking;
        },
    },
    mounted() {
        this.fetchUsersRequests();
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

/* Sidebar */
.booking-layout > *:first-child {
    width: 320px;
    flex-shrink: 0;
}

/* Details section */
.booking-layout > *:last-child {
    flex: 1;
}

/* ✅ Responsive */
@media (max-width: 992px) {
    .booking-layout {
        flex-direction: column;
    }

    .booking-layout > *:first-child {
        width: 100%;
    }
}
</style>
