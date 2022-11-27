<template>
    <BodyWrapper
        class="home-banner"
        :class="activeTab === 'car' ? 'image-car-owner' : 'image-spot-owner'"
    >
        <OrganismHomeCard
            class="home-cta"
            @changed="getActiveTab"
        ></OrganismHomeCard>
    </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import OrganismHomeCard from '../organisms/OrganismHomeCard.vue';

export default {
    name: 'TemplateHomeBanner',
    components: {
        BodyWrapper,
        OrganismHomeCard,
    },
    emits: ['flyToSrp'],
    data() {
        return {
            activeTab: 'car',
        };
    },
    methods: {
        flyToSrp() {
            this.$emit('flyToSrp');
        },
        getActiveTab(activeTab) {
            this.activeTab = activeTab;
        },
    },
};
</script>

<style lang="scss" scoped>
.image-car-owner {
    // background-color: yellow;
    background-image: url('../../assets/Home-Banner.jpg');
    background-image: linear-gradient(
            to right bottom,
            rgba(35, 30, 20, 45%),
            rgba(35, 30, 20, 45%)
        ),
        url('../../assets/Home-Banner.jpg');
}
.image-spot-owner {
    background-color: green;
}
.home-banner {
    height: 629px;
    max-height: 1000px;

    position: relative;

    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    .home-cta {
        position: absolute;
        top: 0;
        left: 0;
    }
}

// @media only screen and (max-width: 800px) {
//     .banner-header {
//         padding: 0 3rem;
//     }

//     .banner-title {
//         font-size: 2.25rem;
//         text-align: center;
//     }
//     .banner-subtitle {
//         text-align: center;
//     }
// }
</style>
