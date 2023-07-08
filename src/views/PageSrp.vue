<template>
    <section>
        <TemplateSrp
            :spots="filteredSrpResults"
            :currentPage="currentPage"
            :reRender="reRender"
            @flyToSrp="flyToSrp"
            @details="spotDetails"
            @filter="onFilter"
        ></TemplateSrp>
        <LoaderModal :isLoading="isLoading"></LoaderModal>
    </section>
</template>
<script>
import TemplateSrp from '../components/templates/TemplateSrp.vue';
import { mapState, mapActions, mapMutations } from 'vuex';
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
            title: undefined,
            PAGE_TITLE,
        };
    },
    watch: {
        $route: {
            handler: function (to) {
                if (to.name == 'srp') {
                    console.log('sdfads', to);
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
        ...mapState('map', [
            'srpResults',
            'filteredSrpResults',
            'selectedLocationLatLng',
        ]),
    },

    async mounted() {
        try {
            this.isLoading = true;
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
        }),
        ...mapActions({
            srpCall: 'map/srpCall',
            updateCenterSrp: 'map/updateCenterSrp',
            updateSrpResults: 'map/updateSrpResults',
        }),

        // methods to get Lat and Long
        getLatLng() {
            const queryParam = new URLSearchParams(window.location.search);
            const coordinate = getCoordinate(queryParam.get('latlng'));
            console.log('getLatLng', coordinate);
            return { lat: coordinate[0], lng: coordinate[1] };
        },

        flyToSrp() {
            this.$nextTick(() => {
                console.log('flytosrp', this.selectedLocationLatLng);
                const coordinate = getCoordinate(
                    [
                        this.selectedLocationLatLng.lat,
                        this.selectedLocationLatLng.lng,
                    ].toString(),
                ).toString();
                this.$router.push({
                    name: 'srp',
                    query: {
                        latlng: coordinate,
                    },
                    params: {
                        location: this.selectedLocationLatLng.formattedAddress,
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
