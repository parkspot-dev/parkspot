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

export default {
    name: 'TemplateHomeBanner',
    components: {
        BodyWrapper,
        OrganismHomeCard,
    },
    emits: ['flyToSrp'],
    data() {
        return {
            activeTab: 'VO',
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
.image-spot-owner {
    background-image: url('../../assets/home-spot-owner.jpg');
    -webkit-transition: background-image 1s;

    @media only screen and (max-width: 1024px) {
        background-image: unset;
        background-color: #ffffff;
    }
}
.image-car-owner {
    background-image: url('../../assets/home-car-owner.jpg');
    -webkit-transition: background-image 1s;

    @media only screen and (max-width: 1024px) {
        background-image: unset;
        background-color: #ffffff;
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
        background-image: url('../../assets/m-home-car-owner.jpg');
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
        background-image: url('../../assets/m-home-spot-owner.jpg');
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
