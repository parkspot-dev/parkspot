<template>
    <div class="booking-portal-root">
        <!--- Search Bar-->
        <div class="search-control">
            <p></p>
            <MoleculeSearchBox
                placeholder="Booking ID"
                @on-search="searchBooking"
            ></MoleculeSearchBox>
        </div>
        <LoaderModal v-if="isLoading"></LoaderModal>
        <TemplateBookingPortal
            v-if="bookingDetails"
            @payment-link="getPaymentLink"
            @refresh-payment-status="refreshPaymentStatus"
            @update-booking-details="updateBookingDetails"
        ></TemplateBookingPortal>
        <ActiveBookings
            v-else
            :activeBookings="activeBookings"
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
            bookingID: '',
        };
    },
    async created() {
        if (this.$route.query['bookingId'] != undefined) {
            this.getAgents();
            this.getBookingDetails(this.$route.query['bookingId']);
        } else {
            this.getActiveBooking();
        }
    },
    computed: {
        ...mapState('bookingPortal', [
            'hasError',
            'errorMessage',
            'isLoading',
            'bookingDetails',
            'activeBookings',
        ]),
    },

    methods: {
        ...mapActions('bookingPortal', [
            'getBookingDetails',
            'getPaymentLink',
            'getActiveBooking',
            'updateBookingDetails',
            'refreshPaymentStatus',
            'getAgents',
        ]),
        searchBooking(bookingId) {
            this.$router.push({
                path: this.$route.path,
                query: { bookingId: bookingId },
            });
            this.getBookingDetails(bookingId);
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
    watch: {
        hasError(error) {
            if (error) {
                this.alertError(this.errorMessage);
            }
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
