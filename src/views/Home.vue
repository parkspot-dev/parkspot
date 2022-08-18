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
import { mapGetters } from 'vuex';
export default {
    name: 'Home',
    components: {
        PageAbout,
        TemplateFeatureHome,
        PageContactUs,
        TemplateHomeBanner,
        TemplateTestimonial,
        TemplateOurProducts,
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
            this.$router.push({
                name: 'srp',
                query: {
                    lat: this.LocDetails.lnglat[1],
                    lng: this.LocDetails.lnglat[0],
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
