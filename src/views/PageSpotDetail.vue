<template>
    <div>
        <TemplateSpotDetail></TemplateSpotDetail>
        <LoaderModal :isLoading="isLoading"></LoaderModal>
    </div>
</template>

<script>
import TemplateSpotDetail from '../components/templates/TemplateSpotDetail.vue';
import LoaderModal from '../components/extras/LoaderModal.vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import { PAGE_TITLE } from '@/constant/constant';

export default {
    name: 'PageSpotDetail',
    components: {
        TemplateSpotDetail,
        LoaderModal,
    },
    metaInfo() {
        return {
            title: this.title,
            titleTemplate: PAGE_TITLE.TITLE_TEMPLATE + '%s',
        };
    },
    data() {
        return {
            spotId: null,
            spotDetails: null,
            isAdmin: false,
        };
    },
    computed: {
        ...mapState('sdp', {
            isLoading: (state) => state.loading,
            title: (state) => state.title,
        }),
    },
    mounted() {
        this.spotId = this.$route.params.spotId;
        if (this.spotId.includes('#')) {
            this.spotId = encodeURIComponent(this.spotId);
        }
        if (this.$route.name === 'adminOnly-spot-detail') {
            this.isAdmin = true;
        }
        this.getSpotDetails({ spotId: this.spotId, isAdmin: this.isAdmin });
        this.getUserLocation();
    },
    methods: {
        ...mapActions('sdp', {
            getSpotDetails: 'getSpotDetails',
        }),
        ...mapMutations('map', {
            updateManConfig: 'update-map-config',
        }),
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
            const location = [lng, lat];
            this.updateManConfig(location);
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