<template>
    <BodyWrapper
        class="home-banner"
        :class="activeTab === 'VO' ? 'image-car-owner' : 'image-spot-owner'"
    >
        <OrganismHomeCard
            class="home-cta"
            @changed="getActiveTab"
        ></OrganismHomeCard>
        <div
            :class="
                activeTab === 'VO' ? 'm-image-car-owner' : 'm-image-spot-owner'
            "
        ></div>
    </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import OrganismHomeCard from '../organisms/OrganismHomeCard.vue';
import carImage from '/assets/home-car-owner.jpg';
import spotImage from '/assets/home-spot-owner.jpg';

export default {
    name: 'TemplateHomeBanner',
    components: {
        BodyWrapper,
        OrganismHomeCard,
    },
    data() {
        return {
            activeTab: 'VO',
            carOwnerImage: 'url(/assets/home-car-owner.jpg)',
            spotOwnerImage: `url('/assets/home-spot-owner.jpg')`,
            mCarOwnerImage: 'url(/assets/m-home-car-owner.jpg)',
            mSpotOwnerImage: `url('/assets/m-home-spot-owner.jpg')`,
        };
    },
    methods: {
        getActiveTab(activeTab) {
            this.activeTab = activeTab;
        },
    },
};
</script>

<style lang="scss" scoped>
.image-spot-owner {
    background-image: v-bind(spotOwnerImage);
    -webkit-transition: background-image 1s;

    @media only screen and (max-width: 1024px) {
        background-image: unset;
        background-color: var(--parkspot-white);
    }
}
.image-car-owner {
    background-image: v-bind(carOwnerImage);
    -webkit-transition: background-image 1s;

    @media only screen and (max-width: 1024px) {
        background-image: unset;
        background-color: var(--parkspot-white);
    }
}
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

    .m-image-car-owner {
        display: none;
        height: 187px;
        background-image: v-bind(mCarOwnerImage);
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        transform: scale(1.25);
        -webkit-transition: background-image 1s;

        @media only screen and (max-width: 1024px) {
            display: block;
        }
    }
    .m-image-spot-owner {
        display: none;
        height: 187px;
        background-image: v-bind(mSpotOwnerImage);
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        transform: scale(1.25);
        -webkit-transition: background-image 1s;

        @media only screen and (max-width: 1024px) {
            display: block;
        }
    }
}
</style>
