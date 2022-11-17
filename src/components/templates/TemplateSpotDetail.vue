<template>
    <BodyWrapper>
        <div>
            <!-- temporary later replace with collage for image gallery Organism-->
            <div class="spot-image-container">
                <!-- <img src="../../assets/Home-Banner.jpg" alt="spot image" /> -->
                <ImageGallery></ImageGallery>
            </div>

            <!-- Rate Card Organism -->
            <div class="rate-card-container">
                <SpotRateCard class="card-position"></SpotRateCard>
            </div>
            <div class="spot-detail-main-description">
                <h1>{{ spotDetails.Name }}</h1>
                <div>
                    <p>Address:</p>
                    <p>
                        {{ spotDetails.Address }}
                    </p>
                    <p>
                        {{ spotDetails.Area }}
                    </p>
                    <p>
                        {{ spotDetails.City }}
                    </p>
                </div>
            </div>
            <hr />

            <div class="spot-detail-amenities">
                <h2>What this place offers</h2>
                <ul>
                    <li>Covered</li>
                    <li>Gated</li>
                    <li>Security Gaurd</li>
                </ul>
            </div>
            <hr />

            <div class="spot-detail-map">
                <h2>How to get here?</h2>
                <MapContainer class="sdp-map"></MapContainer>
            </div>

            <div class="spot-detail-things">
                <!-- Organism to show the graphical layout -->
            </div>

            <!-- only to admin -->
            <div class="spot-detail-owner"></div>

            <div class="rate-card-container-mobile"></div>
        </div>
    </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import SpotRateCard from '@/components/organisms/OrganismSpotRateCard.vue';
import MapContainer from '@/components/extras/MapContainer.vue';
import ImageGallery from '../organisms/OrganismImageGallery.vue';
import { mapState } from 'vuex';

export default {
    name: 'TemplateSpotDetail',
    components: {
        BodyWrapper,
        SpotRateCard,
        MapContainer,
        ImageGallery,
    },
    computed: {
        ...mapState('srp', {
            spotDetails: (state) => state.spotDetails,
        }),
    },
};
</script>

<style lang="scss" scoped>
hr {
    width: 600px;
}
.spot-image-container {
    width: 100%;
    height: 400px;
    margin-bottom: 48px;
    margin-left: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    // background-color: #00000061;
    border-radius: var(--border-default);
    overflow: hidden;

    @media only screen and (max-width: 1024px) {
        margin-left: 0px;
    }

    img {
        height: 60vh;
    }
}

.rate-card-container {
    position: relative;

    @media only screen and (max-width: 1024px) {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
    }
    .card-position {
        position: absolute;
        top: 0;
        right: 0;
        @media only screen and (max-width: 1024px) {
            position: relative;
        }
    }
}

.rate-card-container-mobile {
    @media only screen and (max-width: 1024px) {
        min-height: 50vh;
    }
}

.spot-detail-main-description {
    width: 600px;
    margin-left: 20px;

    @media only screen and (max-width: 1024px) {
        margin-left: 0px;
    }

    h1 {
        font-size: 32px;
        font-weight: 500;
        margin-bottom: 13px;
    }

    p {
        font-size: 20px;
        font-weight: 500;
    }
}

.spot-detail-amenities {
    width: 600px;
    min-height: 158px;
    margin-left: 20px;

    @media only screen and (max-width: 1024px) {
        margin-left: 0px;
    }

    h2 {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 26px;
    }

    ul {
        list-style: none;
    }

    ul li:before {
        content: '✓ ';
        color: green;
        font-weight: bold;
        font-size: 20px;
    }
}

.spot-detail-map {
    margin-left: 20px;

    @media only screen and (max-width: 1024px) {
        margin-left: 0px;
    }

    h2 {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 26px;
    }

    .sdp-map {
        border: 1px solid black;
    }
}
</style>