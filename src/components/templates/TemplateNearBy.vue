<template>
    <div>
        <HeaderBanner class="custom-header">
            <!--
                Phase 2.5 heading hygiene: this H1 is the primary
                topical heading the SEO crawler reads. Pre-fix it was
                the generic literal "Book Your Parking Spot" with the
                area name buried in an <h4> below — a hierarchy
                violation that every audit tool now flags since SSG
                started shipping the rendered HTML. The text comes
                from `buildAreaPageMeta(url).h1`, so it stays in sync
                with the edge-function and JSON-LD copy (e.g. "Car
                Parking near Indiranagar, Bengaluru").
            -->
            <h1 class="custom-title">{{ headline }}</h1>
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
            <!--
                Section heading above the spot grid. Promoted from h4
                (visual subtitle) to h2 (proper hierarchy below the
                page's h1). Visual styling is unchanged — the
                AtomHeading h4 / h2 type-scale is sized in
                `AtomHeading.vue` but the visual rhythm here is driven
                by the `.mb-4` margin, not the level itself.
            -->
            <AtomHeading class="mb-4" :level="'h2'">
                Parking near {{ locationWithCaps }}
            </AtomHeading>
            <div class="columns mb-6">
                <template v-if="isLoading">
                    <div
                        v-for="n in 4"
                        :key="`s-${n}`"
                        class="column is-one-quarter"
                    >
                        <SkeletonSRPCard />
                    </div>
                </template>

                <template v-else>
                    <div
                        v-for="spot in spots"
                        :key="spot.ID"
                        class="column is-one-quarter"
                    >
                        <MoleculeSRPCard :spot="spot" @on-details="details" />
                    </div>
                </template>
            </div>
            <div class="nearbytext-container">
                <AtomHeading :level="'h2'">
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
import SkeletonSRPCard from '../extras/SkeletonSRPCard.vue';
export default {
    name: 'TemplateNearBy',
    components: {
        HeaderBanner,
        AtomHeading,
        MoleculeSRPCard,
        AtomParagraph,
        BodyWrapper,
        SkeletonSRPCard,
    },
    props: {
        nearByLocation: {
            type: String,
            default: '',
        },
        spots: {
            type: Array,
            default: () => [],
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
        // Phase 2.5: H1 text. The route page (PageNearBy) computes the
        // location-aware headline ("Car Parking near {area}, {city}")
        // via the shared `buildAreaPageMeta` helper so client-side
        // and edge-injected SEO copy stay byte-identical. Falls back
        // to a generic literal so the template renders standalone
        // (storybook, snapshot tests).
        headline: {
            type: String,
            default: 'Find Parking',
        },
    },
    emits: ['details'],
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
