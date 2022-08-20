<template>
    <div>
        <HeaderBanner>
            <AtomHeading class="custom-title">
                Book Your Parking Spot
            </AtomHeading>
            <b-breadcrumb align="is-centered" size="is-medium">
                <b-breadcrumb-item tag="router-link" to="/">
                    Home
                </b-breadcrumb-item>
                <b-breadcrumb-item tag="router-link" to="/blog" active>
                    {{ locationWithCaps }}
                </b-breadcrumb-item>
            </b-breadcrumb>
            <!-- <div>
        <SearchInput></SearchInput>
      </div> -->
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
                    @booked="onBook"
                ></MoleculeSRPCard>
            </div>
            <div class="nearbyText-container">
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
// import SearchInput from "../extras/SearchInput.vue";
import AtomHeading from '../atoms/AtomHeading.vue';
import MoleculeSRPCard from '../molecules/MoleculeSRPCard.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
import BodyWrapper from '../extras/BodyWrapper.vue';
export default {
    name: 'TemplateNearBy',
    components: {
        HeaderBanner,
        // SearchInput,
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
        onBook() {
            this.$router.push({ name: 'contactUs' });
        },
    },
};
</script>

<style scoped>
.custom-title {
    text-align: center;
    margin-bottom: 1rem;
}

/* @media only screen and (max-width: 1024px) {
  .custom-title {
    font-size: 2rem;
  }
} */
.nearbyText-container {
    max-width: 960px;
    margin: auto;
}
.custom-nearby {
    color: var(--grey-shade);
    margin-bottom: 1rem;
}
</style>
