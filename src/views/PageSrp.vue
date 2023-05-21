<template>
    <section>
        <TemplateSrp
            :spots="filteredSrpResults"
            :totals="totalPages"
            :currentPage="currentPage"
            :reRender="reRender"
            @changed="onPageChange"
            @flyToSrp="flyToSrp"
            @details="spotDetails"
            @filter="onFilter"
        ></TemplateSrp>
        <LoaderModal :isLoading="isLoading"></LoaderModal>
    </section>
</template>
<script>
import TemplateSrp from '../components/templates/TemplateSrp.vue';
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import LoaderModal from '../components/extras/LoaderModal.vue';
import { getCoordinate } from '../includes/LatLng';
import { PAGE_TITLE } from '@/constant/constant';

export default {
    name: 'PageSrp',
    components: {
        TemplateSrp,
        LoaderModal,
    },
    metaInfo() {
        return {
            title: this.title,
            titleTemplate: PAGE_TITLE.SEARCH + '%s',
        };
    },
    data() {
        return {
            reRender: 0,
            isLoading: false,
            currentPage: 1,
        };
    },
    watch: {
        $route: {
            handler: function (to) {
                if (to.name == 'srp') {
                    this.title = to.params.location;
                }
            },
            deep: true,
            immediate: true,
        },
        // filter change will re-render the map
        filteredSrpResults() {
            this.reRender++;
        },
    },
    computed: {
        ...mapState('map', ['srpResults', 'filteredSrpResults']),
    },

    async mounted() {
        try {
            this.isLoading = true;
            // await this.updateMapOptions(this.getLatLng());
            await this.srpCall();
            this.reRender++;
            this.isLoading = false;
        } catch (errorMsg) {
            console.log(errorMsg);
            this.$router.push({
                name: 'error',
            });
        }
    },
    methods: {
        ...mapMutations({
            updateMapCenter: 'map/update-map-center',
            updateMapOptions: 'map/update-map-options',
            updatePaginatedSrpData: 'map/update-paginated-srp-data',
        }),
        ...mapActions({
            srpCall: 'map/srpCall',
            updateCenterSrp: 'map/updateCenterSrp',
            updateSrpResults: 'map/updateSrpResults',
        }),

        onPageChange(pageNum) {
            this.isLoading = true;
            this.updatePaginatedSrpData(pageNum);
            this.updateCenterSrp();
            this.currentPage = pageNum;
            this.reRender++;
            this.isLoading = false;
        },
        // methods to get Lat and Long

        getLatLng() {
            const queryParam = new URLSearchParams(window.location.search);
            const coordinate = getCoordinate(queryParam.get('latlng'));
            // coordinate.reverse(); // map center takes [lng, lat] so reverse() used
            return { lat: coordinate[0], lng: coordinate[1] };
        },

        flyToSrp() {
            this.$nextTick(() => {
                const coordinate = getCoordinate(
                    this.LocDetails.lnglat.toString(),
                )
                    .reverse()
                    .toString();

                this.$router.push({
                    name: 'srp',
                    query: {
                        latlng: coordinate,
                    },
                    params: {
                        location: this.LocDetails.locDetails.locName,
                    },
                });
            });
        },

        spotDetails(spotID) {
            const route = this.$router.resolve({
                name: 'spot-detail',
                params: {
                    spotId: spotID,
                },
            });
            window.open(route.href);
        },
        onFilter(filterOption) {
            this.updateSrpResults(filterOption);
        },
    },
};
</script>
