<template>
    <div id="Home">
        <OrganismLogin :modal="loginModal"></OrganismLogin>
        <TemplateHomeBanner @flyToSrp="flyToSrp"></TemplateHomeBanner>
        <TemplateFeatureHome></TemplateFeatureHome>
        <TemplateOurProducts @arrowBtn="onArrowBtn"></TemplateOurProducts>
        <PageAbout></PageAbout>
        <TemplateTestimonial></TemplateTestimonial>
        <PageContactUs></PageContactUs>
    </div>
</template>
<script>
import TemplateFeatureHome from '../components/templates/TemplateFeatureHome.vue';
import PageContactUs from './PageContactUs.vue';
import TemplateHomeBanner from '../components/templates/TemplateHomeBanner.vue';
import TemplateOurProducts from '../components/templates/TemplateOurProducts.vue';
import TemplateTestimonial from '../components/templates/TemplateTestimonial.vue';
import PageAbout from './PageAbout.vue';
import OrganismLogin from '../components/organisms/OrganismLogin.vue';
import { PAGE_TITLE } from '@/constant/constant';
import { mapState } from 'vuex';
export default {
    name: 'PageHome',
    components: {
        PageAbout,
        TemplateFeatureHome,
        PageContactUs,
        TemplateHomeBanner,
        TemplateTestimonial,
        TemplateOurProducts,
        OrganismLogin,
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
        ...mapState('user', {
            loginModal: (state) => state.loginModal,
        }),
    },
    methods: {
        onArrowBtn() {
            this.$router.push({ name: 'contactUs' });
        },
    },
};
</script>
<style lang="scss" scoped></style>
