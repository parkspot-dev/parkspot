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
import { mapState, mapActions } from 'vuex';
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
            this.updateMapCenter(this.getLatLng());
            await this.callSrp();
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
        ...mapActions('map', [
            'callSrp',
            'updateSrpResults',
            'updateMapCenter',
        ]),

        // methods to get Lat and Long
        getLatLng() {
            const queryParam = new URLSearchParams(window.location.search);
            const coordinate = getCoordinate(queryParam.get('latlng'));
            return { lat: coordinate[0], lng: coordinate[1] };
        },

        flyToSrp() {
            this.$nextTick(() => {
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
