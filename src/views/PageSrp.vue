<template>
    <section class="srp-wrapper">
        <div class="srp-slot">
            <TemplateSrp
            v-if="srpResults && srpResults.length > 0"
            :spots="filteredSrpResults"
            :totals="totalPages"
            :current-page="currentPage"
            :re-render="reRender"
            :headline="title"
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
import { track, EVENTS } from '@/lib/analytics';

export default {
    name: 'PageSrp',
    components: {
        TemplateSrp,
        LoaderModal,
    },
    // Direct title pattern (Phase 2.5). Previously the metaInfo
    // returned `{ title: this.title, titleTemplate: 'ParkSpot | %s' }`
    // but `this.title` was never declared in data() — so it stayed
    // undefined, the watcher assignment created a non-reactive
    // property, and useHead resolved the template against an empty
    // string. Result: the document <title> rendered as `'ParkSpot | '`
    // (trailing pipe + space) on first paint and after every SPA nav.
    // We now declare `title` in data(), give it a meaningful default,
    // and skip the template entirely.
    metaInfo() {
        return {
            title: this.title,
        };
    },
    data() {
        return {
            reRender: 0,
            isLoading: false,
            currentPage: 1,
            title: PAGE_TITLE.SEARCH_RESULTS,
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
                    // Compose a clean, branded title from the route
                    // param. `to.params.location` is occasionally
                    // empty / undefined on direct loads — fall back
                    // to the generic headline so we never emit an
                    // orphan-suffixed title.
                    //
                    // The value comes from the Mapbox autocomplete via
                    // the `map/update-selected-location` mutation,
                    // which stores the full Mapbox `place_name` —
                    // e.g. `"Indiranagar, Bengaluru, Karnataka 560038,
                    // India"`. That's ~80 characters once you wrap it
                    // in the prefix + brand suffix, past Google's
                    // SERP-title truncation point (~60ch) and
                    // visually noisy in the browser tab. Keep only
                    // the most-specific segment (everything before
                    // the first comma) so the title reads `Car
                    // Parking near Indiranagar | ParkSpot`. Falls
                    // back to the whole string if there's no comma
                    // (city-level picks, programmatic pushes from
                    // tests, etc.).
                    const raw =
                        typeof to.params.location === 'string'
                            ? to.params.location.trim()
                            : '';
                    const loc = raw.includes(',')
                        ? raw.split(',')[0].trim()
                        : raw;
                    this.title = loc
                        ? `${PAGE_TITLE.SEARCH_RESULTS_PREFIX}${loc}${PAGE_TITLE.BRAND_SUFFIX}`
                        : PAGE_TITLE.SEARCH_RESULTS;
                }
            },
            deep: true,
            immediate: true,
        },
    },

    async mounted() {
        try {
            this.isLoading = true;
            // Booking-funnel step 1: route entry to /srp with a `latlng`
            // query. `search_term` is the verbatim latlng string per
            // events.csv (no funnel_name on `search` itself — it's a
            // GA4 recommended event whose only required param is
            // search_term).
            const latlngQuery = this.$route.query.latlng;
            if (latlngQuery) {
                track(EVENTS.SEARCH, { search_term: latlngQuery });
            }
            const center = this.getLatLng();
            if (Array.isArray(center) && center.length === 2) {
                await this.updateMapConfig(center);
            }
            await this.srpCall();
            this.reRender++;
            this.isLoading = false;
            // Step 2: view_search_results once the SRP fetch resolved.
            track(EVENTS.VIEW_SEARCH_RESULTS, {
                funnel_name: 'booking',
                step_index: 2,
                item_count: Array.isArray(this.srpResults)
                    ? this.srpResults.length
                    : 0,
            });
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