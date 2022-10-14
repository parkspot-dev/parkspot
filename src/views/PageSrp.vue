<template>
    <section>
        <TemplateSrp
            :spots="paginatedSrpResults"
            :totals="totalPages"
            :currentPage="currentPage"
            :reRender="reRender"
            @changed="onPageChange"
            @flyToSrp="flyToSrp"
        ></TemplateSrp>
        <LoaderModal :isLoading="isLoading"></LoaderModal>
    </section>
</template>
<script>
import TemplateSrp from '../components/templates/TemplateSrp.vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import LoaderModal from '../components/extras/LoaderModal.vue';
import { getCoordinate } from '../includes/LatLng';

export default {
    name: 'PageSrp',
    components: {
        TemplateSrp,
        LoaderModal,
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
    },

    async mounted() {
        try {
            this.isLoading = true;
            await this.updateMapConfig(this.getLatLng()); // map center takes [lng, lat]
            await this.srpCall();
            this.reRender++;
            this.isLoading = false;
        } catch (errorMsg) {
            this.$router.push({ name: 'error', params: { msg: errorMsg } });
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
    },
};
</script>
