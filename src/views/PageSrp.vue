<template>
    <section class="srp-wrapper">
        <div class="srp-slot">
            <TemplateSrp
            v-if="srpResults && srpResults.length > 0"
            :spots="filteredSrpResults"
            :totals="totalPages"
            :current-page="currentPage"
            :re-render="reRender"
            @changed="onPageChange"
            @fly-to-srp="flyToSrp"
            @details="spotDetails"
            @filter="onFilter"
        ></TemplateSrp>
        </div>
        <LoaderModal v-if="isLoading" class="overlay"></LoaderModal>
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
    computed: {
        ...mapGetters({
            paginatedSrpResults: 'map/getPaginateSrpResults',
            totalPages: 'map/getTotalPages',
            LocDetails: 'map/getLocDetails',
        }),
        ...mapState('map', ['srpResults', 'filteredSrpResults']),
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
    },

    async mounted() {
        try {
            this.isLoading = true;
            const center = this.getLatLng();
            if (Array.isArray(center) && center.length === 2) {
                await this.updateMapConfig(center);
            } 
            await this.srpCall();
            this.reRender++;
            this.isLoading = false;
        } catch (errorMsg) {
            this.$router.push({
                name: 'error',
                params: {
                    msg: errorMsg,
                },
                replace: true,
            });
        }
    },
    methods: {
        ...mapMutations({
            updateMapCenter: 'map/update-map-center',
            updateMapConfig: 'map/update-map-config',
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
            coordinate.reverse(); // map center takes [lng, lat] so reverse() used
            return coordinate;
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

<style lang="scss" scoped>
.srp-wrapper {
    position: relative;
}

.overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.6);
}

.srp-slot {
    min-height: 700px;
}
</style>