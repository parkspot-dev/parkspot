<template>
    <div id="Home">
        <TemplateHomeBanner @flyToSrp="flyToSrp"></TemplateHomeBanner>
        <TemplateFeatureHome></TemplateFeatureHome>
        <TemplateOurProducts @arrowBtn="onArrowBtn"></TemplateOurProducts>
        <PageAbout></PageAbout>
        <TemplateTestimonial></TemplateTestimonial>
        <PageContactUs></PageContactUs>
    </div>
</template>
<script>
import TemplateFeatureHome from '@/components/templates/TemplateFeatureHome.vue';
import PageContactUs from './PageContactUs.vue';
import TemplateHomeBanner from '../components/templates/TemplateHomeBanner.vue';
import TemplateOurProducts from '../components/templates/TemplateOurProducts.vue';
import TemplateTestimonial from '../components/templates/TemplateTestimonial.vue';
import PageAbout from './PageAbout.vue';
import { getCoordinate } from '../includes/LatLng';
import { mapGetters } from 'vuex';
import { PAGE_TITLE } from '@/constant/constant';
export default {
    name: 'PageHome',
    components: {
        PageAbout,
        TemplateFeatureHome,
        PageContactUs,
        TemplateHomeBanner,
        TemplateTestimonial,
        TemplateOurProducts,
    },
    metaInfo() {
        return {
            title: PAGE_TITLE.HOMEPAGE,
        };
    },
    data() {
        return {};
    },
    computed: {
        ...mapGetters({
            LocDetails: 'map/getLocDetails',
        }),
    },
    methods: {
        flyToSrp() {
            const coordinate = getCoordinate(this.LocDetails.lnglat.toString())
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
        },
        onArrowBtn() {
            this.$router.push({ name: 'contactUs' });
        },
    },
};
</script>
<style></style>
