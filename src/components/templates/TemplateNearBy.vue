<template>
    <div>
        <HeaderBanner class="custom-header">
            <h1 class="custom-title">Book Your Parking Spot</h1>
            <b-breadcrumb align="is-centered" size="is-small">
                <b-breadcrumb-item tag="router-link" to="/">
                    Home
                </b-breadcrumb-item>
                <b-breadcrumb-item tag="router-link" to="/blog" active>
                    {{ locationWithCaps }}
                </b-breadcrumb-item>
            </b-breadcrumb>
        </HeaderBanner>

        <BodyWrapper>
            <AtomHeading class="mb-4" :level="'h4'">
                Parking near {{ locationWithCaps }}
            </AtomHeading>
            <div class="columns mb-6">
                <MoleculeSRPCard
                    class="column"
                    :key="spot.ID"
                    v-for="spot in spots"
                    :spot="spot"
                    @on-details="details"
                ></MoleculeSRPCard>
            </div>
            <div class="nearbytext-container">
                <AtomHeading :level="'h3'">
                    Find and book parking spaces near
                    {{ locationWithCaps }}
                </AtomHeading>
                <AtomParagraph class="custom-nearby">{{
                    nearByText
                }}</AtomParagraph>
                <br />
                <AtomParagraph class="custom-nearby">
                    Want to earn extra money? Rent your vacant space at our
                    platform and start earning extra.
                </AtomParagraph>
            </div>
        </BodyWrapper>
    </div>
</template>

<script>
import HeaderBanner from '../extras/HeaderBanner.vue';
import AtomHeading from '../atoms/AtomHeading.vue';
import MoleculeSRPCard from '../molecules/MoleculeSRPCard.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
import BodyWrapper from '../extras/BodyWrapper.vue';
export default {
    name: 'TemplateNearBy',
    components: {
        HeaderBanner,
        AtomHeading,
        MoleculeSRPCard,
        AtomParagraph,
        BodyWrapper,
    },
    props: {
        nearByLocation: {
            type: String,
        },
        spots: {
            type: Array,
        },
    },
    data() {
        return {};
    },
    computed: {
        nearByText() {
            return `
       Searching parking space near ${this.nearByLocation}  ? Book the cheap and best space for yourself near  ${this.nearByLocation}  with ParkSpot.
       With us, you can leave the uncertainty of not finding parking space for your Car or Bike. 
       We do short term as well as long term parking as per your need with the minimum cost. 
       Choose the new way of parking near  ${this.nearByLocation}, choose the smart way of parking, CHOOSE ParkSpot .
       Think about the stress avoided, fuel & time saved.`;
        },
        locationWithCaps() {
            return (
                this.nearByLocation.charAt(0).toUpperCase() +
                this.nearByLocation.slice(1)
            );
        },
    },
    methods: {
        details(spotID) {
            this.$emit('details', spotID);
        },
    },
};
</script>

<style lang="scss" scoped>
.custom-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    height: 100px;
    flex-direction: column;
    align-content: space-between;
    text-align: center;
}

.custom-title {
    font-size: 2rem;
    font-weight: 500;
    letter-spacing: 0.8px;
}

.nearbytext-container {
    margin: auto;
    max-width: 960px;
}

.custom-nearby {
    margin-bottom: 1rem;
    color: var(--grey-shade);
}
</style>
