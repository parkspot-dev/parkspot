<template>
    <div id="Home">
        <TemplateHomeBanner></TemplateHomeBanner>
        <TemplateFeatureHome></TemplateFeatureHome>
        <TemplateOurProducts @arrowBtn="onArrowBtn"></TemplateOurProducts>
        <PageAbout></PageAbout>
        <TestimonialSection></TestimonialSection>
        <PageContactUs></PageContactUs>
    </div>
</template>
<script>
import { PAGE_TITLE } from '@/constant/constant';
import PageAbout from './PageAbout.vue';
import PageContactUs from './PageContactUs.vue';
import TemplateFeatureHome from '../components/templates/TemplateFeatureHome.vue';
import TemplateHomeBanner from '../components/templates/TemplateHomeBanner.vue';
import TemplateOurProducts from '../components/templates/TemplateOurProducts.vue';
import TestimonialSection from '@/components/global/TestimonialSection.vue';
export default {
    name: 'PageHome',
    components: {
        PageAbout,
        TemplateFeatureHome,
        PageContactUs,
        TemplateHomeBanner,
        TemplateOurProducts,
        TestimonialSection
    },
    metaInfo() {
        return {
            title: PAGE_TITLE.HOMEPAGE,
        };
    },
    data() {
        return {};
    },
    methods: {
        onArrowBtn() {
            this.$router.push({ name: 'contactUs' });
        },
    },
};
</script>
<style lang="scss" scoped></style>
