<template>
    <TemplateNearBy
        :near-by-location="nearByLocation"
        :spots="spots"
        :is-loading="isLoading"
        @details="spotDetails"
    ></TemplateNearBy>
</template>

<script>
import TemplateNearBy from '../components/templates/TemplateNearBy.vue';
import { PAGE_TITLE } from '@/constant/constant';
import { buildAreaPageMeta } from '@/utils/seo/meta.js';
import { metaPayloadToHead } from '@/utils/seo/to-head.js';

/**
 * Resolve `route.params.location` safely. Trims whitespace and tolerates
 * the value being absent or non-string (which happens when the route is
 * matched without a param, e.g. during the SPA fallback to `/`). Exported
 * so unit tests can exercise it without mounting the component.
 *
 * @param {object} route
 * @returns {string}
 */
function safeLocationFromRoute(route) {
    const raw = route?.params?.location;
    if (typeof raw !== 'string') {
        return '';
    }
    return raw.trim();
}

export default {
    name: 'PageNearBy',
    components: {
        TemplateNearBy,
    },
    // Produce the same rich SEO payload that the edge function injects on
    // the initial HTML response. Using the shared buildAreaPageMeta()
    // keeps client-side and server-side metadata byte-identical so SPA
    // navigation never regresses title / description / canonical / og /
    // JSON-LD that a crawler or social preview already saw.
    metaInfo() {
        // Touching $route.fullPath makes this reactive: if the user
        // navigates between two /bangalore/parking-near-* pages, the
        // meta payload is recomputed with the new URL.
        const fullPath = this.$route?.fullPath || '';
        const base =
            typeof window !== 'undefined' && window.location
                ? window.location.origin
                : 'https://www.parkspot.in';
        const url = new URL(fullPath || '/', base);
        const enhancement =
            Array.isArray(this.spots) && this.spots.length > 0
                ? { sitesCount: this.spots.length }
                : null;
        const payload = buildAreaPageMeta(url, enhancement);
        const head = metaPayloadToHead(payload);
        return {
            // Preserve the PAGE_TITLE.DISCOVER prefix as a fallback for
            // the brief moment before Firebase data arrives and the area
            // name is resolved. buildAreaPageMeta always returns a title
            // so this template only applies when the URL is malformed.
            title: head.title || this.title || '',
            titleTemplate: head.title ? undefined : PAGE_TITLE.DISCOVER + '%s',
            meta: head.meta,
            link: head.link,
            script: head.script,
        };
    },
    data() {
        return {
            nearByLocation: '',
            show: false,
            title: undefined,
            isLoading: true,
        };
    },
    computed: {
        // `spots` is fed by the `seoPages` Vuex module. During SSG the
        // server prefetches it via `serverPrefetch`; vite-ssg serializes
        // the store state into `initialState` and the client hydrates
        // from the same payload — so the computed already has data on
        // first paint and there is no hydration mismatch.
        spots() {
            const loc =
                this.nearByLocation || safeLocationFromRoute(this.$route);
            return this.$store.getters['seoPages/spotsForLocation'](loc);
        },
    },
    async serverPrefetch() {
        // SSR-only hook. Populates the Vuex store so the prerendered HTML
        // already contains the spot list. Any failure here is non-fatal:
        // the page still SSGs (without spots) and the client refetches.
        this.nearByLocation = safeLocationFromRoute(this.$route);
        if (!this.nearByLocation) {
            this.isLoading = false;
            return;
        }
        try {
            await this.$store.dispatch(
                'seoPages/loadPage',
                this.nearByLocation,
            );
            const data = this.$store.getters['seoPages/pageForLocation'](
                this.nearByLocation,
            );
            if (!data) {
                this.show = true;
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(
                `[PageNearBy] serverPrefetch failed for slug "${this.nearByLocation}":`,
                err,
            );
        } finally {
            this.isLoading = false;
            this.title = this.nearByLocation;
        }
    },
    mounted() {
        this.nearByLocation = safeLocationFromRoute(this.$route);
        this.title = this.nearByLocation;
        // Hydration shortcut: if `serverPrefetch` already loaded this
        // slug, skip the client fetch — we'd just briefly flash the same
        // data and waste an RTDB round-trip.
        if (
            this.$store.getters['seoPages/hasLoadedLocation'](
                this.nearByLocation,
            )
        ) {
            this.isLoading = false;
            return;
        }
        this.getPageData();
    },
    methods: {
        async getPageData() {
            this.isLoading = true;
            const data = await this.$store.dispatch(
                'seoPages/loadPage',
                this.nearByLocation,
            );
            if (data == null) {
                this.show = !this.show;
            }
            this.isLoading = false;
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
    },
};

export { safeLocationFromRoute };
</script>

<style></style>
