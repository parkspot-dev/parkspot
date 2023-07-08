<template>
    <div class="booking-portal-root">
        <!--- Search Bar-->
        <div class="search-control">
            <p></p>
            <molecule-search-box
                placeholder="Booking ID"
                @on-search="getBookingDetails"
            ></molecule-search-box>
        </div>
        <p v-if="hasError"> {{ errorMessage }}</p>
        <template-booking-portal v-else></template-booking-portal>
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
    computed: mapState('bookingPortal', ['hasError', 'errorMessage']),
    methods: mapActions('bookingPortal', ['getBookingDetails']),
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
