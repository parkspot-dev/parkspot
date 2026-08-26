<template>
    <div class="booking-portal-root">
        <!--- Search Bar-->
        <div class="search-control">
            <p></p>
            <MoleculeSearchBox
                placeholder="Booking ID"
                :initial-value="searchText"
                @on-search="searchBooking"
                @clear-input="onClearInput"
            ></MoleculeSearchBox>
        </div>
        <LoaderModal v-if="isLoading"></LoaderModal>
        <TemplateBookingPortal
            v-if="bookingDetails"
            @payment-link="getPaymentLink"
            @refresh-payment-status="refreshPaymentStatus"
            @update-booking-details="updateBookingDetails"
        >
        </TemplateBookingPortal>
        <ActiveBookings
            v-else
            :active-bookings="activeBookings"
            :booking-type="activeBookingType"
            @type-change="onBookingTypeChange"
        ></ActiveBookings>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ActiveBookings from '../components/booking-portal/ActiveBookings.vue';
import LoaderModal from '../components/extras/LoaderModal.vue';
import MoleculeSearchBox from '../components/molecules/MoleculeSearchBox.vue';
import TemplateBookingPortal from '../components/templates/TemplateBookingPortal.vue';

export default {
    name: 'BookingPortal',
    components: {
        MoleculeSearchBox,
        TemplateBookingPortal,
        LoaderModal,
        ActiveBookings,
    },
    data() {
        return {
            bookingID: this.searchText,
        };
    },
    computed: {
        ...mapState('bookingPortal', [
            'hasError',
            'errorMessage',
            'isLoading',
            'bookingDetails',
            'activeBookings',
            'activeBookingType',
            'searchText',
        ]),
    },
    watch: {
        'hasError'(error) {
            if (error) {
                this.alertError(this.errorMessage);
            }
        },
        '$route.query.status'(newStatus) {
            if (!this.$route.query.bookingId) {
                const status = newStatus || 'active';
                if (status !== this.activeBookingType) {
                    this.getBookingsByStatus(status);
                }
            }
        },
    },
    async created() {
        if (this.$route.query['bookingId'] != undefined) {
            const bookingId = this.$route.query['bookingId'];
            this.updateSearchText(bookingId);
            this.getAgents();
            this.getBookingDetails(bookingId);
        } else {
            this.updateSearchText('');
            this.resetBookingDetails();
            const status = this.$route.query['status'] || 'active';
            await this.getBookingsByStatus(status);
        }
    },

    methods: {
        ...mapActions('bookingPortal', [
            'getBookingDetails',
            'getPaymentLink',
            'getActiveBooking',
            'getUpcomingBooking',
            'getBookingsByStatus',
            'updateBookingDetails',
            'refreshPaymentStatus',
            'getAgents',
            'updateSearchText',
            'resetBookingDetails',
        ]),
        async onBookingTypeChange(type) {
            if (type === this.activeBookingType) return;
            const query = { ...this.$route.query };
            if (type === 'upcoming') {
                query.status = 'upcoming';
            } else {
                delete query.status;
            }
            this.$router.push({
                path: this.$route.path,
                query,
            });
            await this.getBookingsByStatus(type);
        },
        searchBooking(bookingId) {
            this.resetBookingDetails();
            this.updateSearchText(bookingId);

            this.$router.push({
                path: this.$route.path,
                query: { bookingId: bookingId },
            });
            this.getBookingDetails(bookingId);
        },
        // Clear Input
        async onClearInput() {
            if (this.$route.query.bookingId) {
                this.updateSearchText('');
                this.resetBookingDetails();
                const query = {};
                if (this.$route.query.status === 'upcoming') {
                    query.status = 'upcoming';
                }
                this.$router.push({
                    name: 'booking-portal',
                    query,
                });
                const status = query.status || 'active';
                await this.getBookingsByStatus(status);
            }
        },
        alertError(msg) {
            this.$buefy.dialog.alert({
                title: 'Error',
                message: msg,
                type: 'is-danger',
                hasIcon: true,
                icon: 'alert-circle',
                ariaRole: 'alertdialog',
                ariaModal: true,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.booking-portal-root {
    padding: 16px;
    text-align: center;
    background: #f5f5fb;
}
</style>
