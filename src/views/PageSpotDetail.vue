<template>
    <TemplateSpotDetail></TemplateSpotDetail>
</template>

<script>
import TemplateSpotDetail from '../components/templates/TemplateSpotDetail.vue';
import { mapActions, mapMutations } from 'vuex';

export default {
    name: 'PageSpotDetail',
    components: {
        TemplateSpotDetail,
    },
    data() {
        return {
            spotId: null,
            spotDetails: null,
        };
    },
    mounted() {
        this.spotId = this.$route.params.spotId;
        if (this.spotId.includes('#')) {
            this.spotId = encodeURIComponent(this.spotId);
        }
        this.getSpotDetails(this.spotId);
        this.getUserLocation();
    },
    methods: {
        ...mapActions('srp', {
            getSpotDetails: 'getSpotDetails',
        }),
        ...mapMutations('srp', {
            updateUserLocation: 'update-user-location',
        }),
        getUserLocation() {
            const geolocation = navigator.geolocation;
            if (geolocation) {
                geolocation.getCurrentPosition(
                    this.onGeoSuccess,
                    this.onGeoError,
                    this.setMap,
                );
            } else {
                console.log('Geolocation is not supported by this browser.');
            }
        },
        onGeoSuccess(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const location = { lat: lat, lng: lng };
            this.updateUserLocation(location);
        },
        onGeoError(error) {
            let detailError;

            if (error.code === error.PERMISSION_DENIED) {
                detailError = 'User denied the request for Geolocation.';
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                detailError = 'Location information is unavailable.';
            } else if (error.code === error.TIMEOUT) {
                detailError = 'The request to get user location timed out.';
            } else if (error.code === error.UNKNOWN_ERROR) {
                detailError = 'An unknown error occurred.';
            }

            console.log(detailError);
        },

        setMap() {
            console.log('setting map');
        },
    },
};
</script>