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
            v-else
            @payment-link="getPaymentLink"
        ></TemplateBookingPortal>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import MoleculeSearchBox from '../components/molecules/MoleculeSearchBox.vue';
import TemplateBookingPortal from '../components/templates/TemplateBookingPortal.vue';
export default {
    components: { MoleculeSearchBox, TemplateBookingPortal },
    name: 'BookingPortal',
    data() {
        return {
            bookingID: '',
        };
    },
    computed: {
        ...mapState('bookingPortal', ['hasError', 'errorMessage']),
    },
    methods: {
        ...mapActions('bookingPortal', ['getBookingDetails', 'getPaymentLink']),
    },
};
</script>

<style lang="scss" scoped>
.booking-portal-root {
    padding: 16px;
    text-align: center;
}

.search-control {
    display: flex;
    justify-content: center;
    margin: 16px;
}
</style>
