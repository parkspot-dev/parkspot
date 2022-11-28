<template>
    <BodyWrapper
        class="home-banner"
        :class="activeTab === 'car' ? 'image-car-owner' : 'image-spot-owner'"
    >
        <OrganismHomeCard
            class="home-cta"
            @changed="getActiveTab"
        ></OrganismHomeCard>
        <div
            :class="
                activeTab === 'car' ? 'm-image-car-owner' : 'm-image-spot-owner'
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
.image-spot-owner {
    // background-color: yellow;
    background-image: url('../../assets/home-spot-owner.jpg');
    // background-image: linear-gradient(
    //         to right bottom,
    //         rgba(35, 30, 20, 45%),
    //         rgba(35, 30, 20, 45%)
    //     ),
    //     url('../../assets/home-spot-owner.png');
    -webkit-transition: background-image 1s;

    @media only screen and (max-width: 620px) {
        background-image: unset;
        background: white;
    }
}
.image-car-owner {
    background-image: url('../../assets/home-car-owner.jpg');
    -webkit-transition: background-image 1s;

    @media only screen and (max-width: 620px) {
        background-image: unset;
        background: white;
    }
}
.home-banner {
    height: 629px;
    max-height: 1000px;

    position: relative;

    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    @media only screen and (max-width: 620px) {
        height: 790px;
        max-height: 1000px;
    }

    .home-cta {
        position: absolute;
        top: 0;
        left: 100px;

        @media only screen and (max-width: 620px) {
            position: relative;
            top: unset;
            left: unset;
            margin-bottom: 20px;
        }
    }

    .m-image-car-owner {
        display: none;
        background-image: url('../../assets/home-car-owner.jpg');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        height: 187px;
        transform: scale(1.25);
        -webkit-transition: background-image 1s;

        @media only screen and (max-width: 620px) {
            display: block;
        }
    }
    .m-image-spot-owner {
        display: none;
        background-image: url('../../assets/home-spot-owner.jpg');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        height: 187px;
        transform: scale(1.25);
        -webkit-transition: background-image 1s;

        @media only screen and (max-width: 620px) {
            display: block;
        }
    }
}
</style>
