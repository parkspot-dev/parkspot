<template>
    <div class="booking-portal-root">
        <!--- Search Bar-->
        <div class="search-control">
            <p></p>
            <MoleculeSearchBox
                placeholder="Booking ID"
                @on-search="getBookingDetails"
            ></MoleculeSearchBox>
        </div>
        <p v-if="hasError">{{ errorMessage }}</p>
        <TemplateBookingPortal
            v-if="bookingDetails"
            @payment-link="getPaymentLink"
            @update-booking-details="updateBookingDetails"
        ></TemplateBookingPortal>
        <LoaderModal :isLoading="isLoading"></LoaderModal>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import LoaderModal from '../components/extras/LoaderModal.vue';
import MoleculeSearchBox from '../components/molecules/MoleculeSearchBox.vue';
import TemplateBookingPortal from '../components/templates/TemplateBookingPortal.vue';

export default {
    name: 'BookingPortal',
    components: { MoleculeSearchBox, TemplateBookingPortal, LoaderModal },

    data() {
        return {
            bookingID: '',
        };
    },

    computed: {
        ...mapState('bookingPortal', [
            'hasError',
            'errorMessage',
            'isLoading',
            'bookingDetails',
        ]),
    },

    methods: {
        ...mapActions('bookingPortal', [
            'getBookingDetails',
            'getPaymentLink',
            'updateBookingDetails',
        ]),
    },
};
</script>

<style lang="scss" scoped>
.booking-portal-root {
    padding: 16px;
    text-align: center;
    background: #f5f5fb;
}

.search-control {
    display: flex;
    justify-content: center;
    margin: 16px;
}
</style>
