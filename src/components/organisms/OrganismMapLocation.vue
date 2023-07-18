<template>
    <div class="map-location">
        <div class="map-location-header">
            <h1>Map Location</h1>
            <h2>Please fill all the fields</h2>
        </div>
        <MapContainer
            class="user-profile-map"
            :center="userLatLng"
            :userLatLng="userLatLng"
            :drag="true"
            @change-position="updateUserProfileLatLng"
        ></MapContainer>
        <AtomButton
            :class="['is-pulled-right', 'save-btn']"
            @click.native="saveProfile"
        >
            Save Profile
        </AtomButton>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AtomButton from '../atoms/AtomButton.vue';
import MapContainer from '../extras/MapContainer.vue';

export default {
    name: 'OrganismMapLocation',
    components: {
        AtomButton,
        MapContainer,
    },
    computed: {
        ...mapState('user', ['userLatLng']),
    },
    mounted() {
        this.getUserLocation();
    },
    methods: {
        ...mapActions('user', ['updateUserProfileLatLng']),
        getUserLocation() {
            const geolocation = navigator.geolocation;
            if (geolocation) {
                geolocation.getCurrentPosition(
                    this.onGeoSuccess,
                    this.onGeoError,
                );
            } else {
                console.log('Geolocation is not supported by this browser.');
            }
        },
        onGeoSuccess(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const location = { lat, lng };
            this.updateUserProfileLatLng(location);
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
    },
};
</script>

<style lang="scss" scoped>
.map-location-header {
    background-color: var(--secondary-color);
    padding: 20px 30px;
    margin-bottom: 30px;

    h1 {
        color: black;
        font-weight: 600;
        font-size: 24px;
    }

    h2 {
        color: #e8faff;
        font-size: 14px;
    }
}

.user-profile-map {
}

.save-btn {
    margin-top: 32px;
}
</style>
