<template>
    <div>
        <LoaderModal v-if="isLoading"></LoaderModal>
        <TemplateSpotDetail
            v-else
            @account-updated="refreshSpotDetails"
            @go-to-search-portal="goToSearchPortal"
            @change-availability="changeAvailability"
            @change-last-call-date="changeLastCallDate"
            @change-remark="changeRemark"
        ></TemplateSpotDetail>
    </div>
</template>

<script>
import TemplateSpotDetail from '../components/templates/TemplateSpotDetail.vue';
import LoaderModal from '../components/extras/LoaderModal.vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import { PAGE_TITLE } from '@/constant/constant';
import { getActiveTabStatusLabel } from '../constant/enums';

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
        };
    },
    computed: {
        ...mapState('sdp', {
            isLoading: (state) => state.loading,
            title: (state) => state.title,
        }),
    },
    async mounted() {
        this.spotId = this.$route.params.spotId;
        if (this.spotId.includes('#')) {
            this.spotId = encodeURIComponent(this.spotId);
        }
        try {
            await this.getSpotDetails({
                spotId: this.spotId,
            });
        } catch (error) {
            this.$buefy.toast.open({
                message: `Something went wrong!`,
                type: 'is-danger',
                duration: 2000,
            });
            this.$router.push({
                name: 'error',
                params: { msg: error.DisplayMsg },
            });
        }
        this.getUserLocation();
    },
    methods: {
        ...mapActions('sdp', [
            'getSpotDetails',
            'updateAvailability',
            'updateLastCallDate',
            'updateRemark',
        ]),
        ...mapActions('searchPortal', [
            'activeTab',
            'updateActiveTab',
            'updateSOLatLngInput',
        ]),
        ...mapMutations('map', {
            updateUserLocation: 'update-user-location',
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
        goToSearchPortal(latLng) {
            this.updateActiveTab(1);
            this.updateSOLatLngInput(latLng.join(','));
            this.$router.push({
                name: 'SearchPortal',
                query: {
                    latlng: latLng.join(','),
                    tab: getActiveTabStatusLabel(
                        this.$store.state.searchPortal.activeTab,
                    ),
                },
            });
        },
        async changeAvailability(availableCount) {
            await this.updateAvailability(availableCount);
            await this.getSpotDetails({
                spotId: this.spotId,
            });
        },
        async changeLastCallDate(lastCallDate) {
            await this.updateLastCallDate(lastCallDate);
            await this.getSpotDetails({
                spotId: this.spotId,
            });
        },
        async changeRemark(remark) {
            await this.updateRemark(remark);
            await this.getSpotDetails({
                spotId: this.spotId,
            });
        },
        async refreshSpotDetails() {
            await this.getSpotDetails({
                spotId: this.spotId,
            });
        },
    },
};
</script>
