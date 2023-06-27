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
<<<<<<< HEAD
        <p v-if="hasError">{{ errorMessage }}</p>
=======
        <p v-if="hasError"> {{ errorMessage }}</p>
>>>>>>> 0723eb3e (create booking portal store)
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
<<<<<<< HEAD
    computed: {
        ...mapState('bookingPortal', ['hasError', 'errorMessage']),
    },
    methods: {
        ...mapActions('bookingPortal', ['getBookingDetails']),
    },
=======
    computed: mapState('bookingPortal', ['hasError', 'errorMessage']),
    methods: mapActions('bookingPortal', ['getBookingDetails']),
>>>>>>> 0723eb3e (create booking portal store)
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
