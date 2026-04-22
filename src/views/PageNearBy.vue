<template>
    <TemplateNearBy
        :near-by-location="nearByLocation"
        :spots="spots"
        :is-loading="isLoading"
        @details="spotDetails"
    ></TemplateNearBy>
</template>

<script>
import { getValueFromFirebase } from '../firebase';
import TemplateNearBy from '../components/templates/TemplateNearBy.vue';
import { PAGE_TITLE } from '@/constant/constant';
import { buildAreaPageMeta } from '@/utils/seo/meta.js';
import { metaPayloadToHead } from '@/utils/seo/to-head.js';
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
        const base = typeof window !== 'undefined' && window.location
            ? window.location.origin
            : 'https://www.parkspot.in';
        const url = new URL(fullPath || '/', base);
        const enhancement = Array.isArray(this.spots) && this.spots.length > 0
            ? { sitesCount: this.spots.length }
            : null;
        const payload = buildAreaPageMeta(url, enhancement);
        const head = metaPayloadToHead(payload);
        return {
            // Preserve the PAGE_TITLE.DISCOVER prefix as a fallback for
            // the brief moment before Firebase data arrives and the area
            // name is resolved. buildAreaPageMeta always returns a title
            // so this template only applies when the URL is malformed.
            title: head.title || (this.title || ''),
            titleTemplate: head.title ? undefined : PAGE_TITLE.DISCOVER + '%s',
            meta: head.meta,
            link: head.link,
            script: head.script,
        };
    },
    data() {
        return {
            spots: [],
            nearByLocation: '',
            show: false,
            title: undefined,
            isLoading: true,
        };
    },
    mounted() {
        this.nearByLocation = this.$route.params.location.trim();
        this.getPageData();
        this.title = this.nearByLocation;
    },
    methods: {
        async getPageData() {
            this.isLoading = true;
            const pageData = await getValueFromFirebase(
                `seo-pages/${this.nearByLocation}`,
            );
            if (pageData == null) {
                this.show = !this.show;
                return;
            }
            this.spots = [...pageData.Sites];
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
</script>

<style></style>
