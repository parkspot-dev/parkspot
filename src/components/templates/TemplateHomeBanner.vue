<template>
    <BodyWrapper class="home-banner" :style="backgroundImageStyle">
        <OrganismHomeCard class="home-cta" @changed="getActiveTab" />
        <div
            :class="{
                'm-image-car-owner': activeTab === 'VO',
                'm-image-spot-owner': activeTab !== 'VO',
            }"
        ></div>
    </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import OrganismHomeCard from '../organisms/OrganismHomeCard.vue';
import homeCarOwner from '/assets/home-car-owner.jpg';
import homeSpotOwner from '/assets/home-spot-owner.jpg';

export default {
    name: 'TemplateHomeBanner',
    components: {
        BodyWrapper,
        OrganismHomeCard,
    },
    data() {
        return {
            activeTab: 'VO',
        };
    },
    computed: {
        backgroundImageStyle() {
            const image =
                this.activeTab === 'VO' ? homeCarOwner : homeSpotOwner;
            return {
                backgroundImage: `url(${image})`,
            };
        },
    },
    methods: {
        getActiveTab(activeTab) {
            this.activeTab = activeTab;
        },
    },
};
</script>

<style lang="scss" scoped>
.home-banner {
    position: relative;
    height: 629px;
    max-height: 1000px;

    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    @media only screen and (max-width: 1024px) {
        height: 790px;
        max-height: 1000px;
    }

    .home-cta {
        position: absolute;
        top: 0;
        left: 100px;

        @media only screen and (max-width: 1024px) {
            position: relative;
            top: unset;
            left: unset;
            margin-bottom: 20px;
        }
    }

    .m-image-car-owner,
    .m-image-spot-owner {
        display: none;
        height: 187px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        transform: scale(1.25);
        transition: background-image 1s;

        @media only screen and (max-width: 1024px) {
            display: block;
        }
    }
}
</style>
