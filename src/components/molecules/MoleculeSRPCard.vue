<template>
    <div class="custom-card">
        <figure class="card-img image is-96x96">
            <img :alt="'Parking spot image'" :src="spot.IconURL" />
        </figure>
        <AtomRating class="card-rating" :rate="spot.Rating"></AtomRating>
        <AtomParagraph class="card-title" :type="'span'">
            {{ spot.Name }}
        </AtomParagraph>
        <div class="card-location">
            <span><AtomIcon :icon="'map-marker-radius'"></AtomIcon></span>
            <AtomParagraph :type="'span'">
                {{ spot.Address }}
            </AtomParagraph>
        </div>
        <AtomParagraph class="card-distance" :type="'span'">
            <strong>Distance : </strong> {{ spot.Distance }} KM
        </AtomParagraph>
        <AtomParagraph class="card-type" :type="'span'">
            <strong>Type : </strong> {{ spot.VehicleType }}
        </AtomParagraph>
        <AtomParagraph class="card-rate" :type="'span'">
            <strong>Rate : </strong> ₹ {{ spot.Rate }} /
            {{ spot.RentUnit }}
        </AtomParagraph>
        <AtomParagraph class="card-spot" :type="'span'">
            <strong>Available Spot : </strong> {{ spot.SlotsAvailable }}
        </AtomParagraph>
        <AtomButton class="card-btn" @click.native="onBook">
            Book Spot
        </AtomButton>
    </div>
</template>

<script>
import AtomRating from '../atoms/AtomRating.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
import AtomButton from '../atoms/AtomButton.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
export default {
    name: 'MoleculeSRPCard',
    components: {
        AtomRating,
        AtomParagraph,
        AtomButton,
        AtomIcon,
    },
    props: {
        spot: {
            type: Object,
        },
    },
    emits: ['booked'],
    methods: {
        onBook() {
            this.$emit('booked');
        },
    },
};
</script>

<style scoped>
.custom-card {
    border-radius: var(--border-default);
    box-shadow: 0 0.5em 1em -0.125em rgb(10, 10, 10 / 10%),
        0 0 0 1px rgb(10, 10, 10 / 2%);
    column-gap: 0.75rem;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(6, auto);
    margin: 0.5rem;
    max-width: 100%;
    overflow: hidden;
    padding: 2rem;
    row-gap: 0.25rem;
}

.card-img {
    grid-column: 1 / 1;
    grid-row: 1 / 5;
}

.card-title {
    font-weight: var(--bold-font);
    grid-column: 2 / 6;
    grid-row: 1 / 1;
}

.card-btn {
    grid-column: 2 / 6;
}

.card-location {
    font-size: var(--sp-size-sm);
    grid-column: 2 / 6;
    grid-row: 2 / 2;
    max-height: calc(1.2rem * 2);
    overflow: hidden;
    position: relative;
}

.card-location::before {
    bottom: -5px;
    content: '...';
    position: absolute;
    right: 0;
}

.card-location::after {
    background: #fff;
    content: '';
    height: 1rem;
    position: absolute;
    right: 0; /* note: not using bottom */
    width: 1rem;
}

.card-rating {
    grid-row: 5 / 5;
    margin: auto;
}

.card-distance,
.card-rate {
    grid-column: 2 / 4;
}

.card-type,
.card-spot {
    grid-column: 4 / 6;
}

.card-distance,
.card-type,
.card-rate,
.card-spot {
    font-size: var(--sp-size-sm);
}
</style>
