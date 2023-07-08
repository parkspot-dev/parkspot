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
        <template-booking-portal></template-booking-portal>
    </div>
</template>

<script>
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
    methods: {
        getBookingDetails(bookingID) {
            console.log('booking id ::', { bookingID });
        },
    },
};
</script>

<style lang="scss" scoped>
.booking-portal-root {
    padding: 16px;
}

.search-control {
    display: flex;
    justify-content: center;
    margin: 16px;
}
</style>
