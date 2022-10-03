<template>
    <div class="custom-card">
        <AtomParagraph class="card-title" :type="'span'">
            <strong> {{ spot.Name }} </strong>
        </AtomParagraph>
        <div class="card-location">
            <span class="location-icon">
                <AtomIcon :icon="'map-marker-radius'"></AtomIcon>
            </span>
            <AtomParagraph
                class="location-text"
                :variation="'small'"
                :type="'span'"
            >
                {{ spot.Address }}
            </AtomParagraph>
        </div>
        <AtomRating class="card-rating" :rate="spot.Rating"></AtomRating>
        <div class="card-distance">
            <AtomParagraph class="distance-text" :type="'p'">
                <span class="text-color"> {{ spot.Distance }} KM </span>
            </AtomParagraph>
        </div>

        <AtomParagraph class="card-rate" :type="'span'">
            <span class="rate-icon">
                <AtomIcon :icon="'tag'"></AtomIcon>
            </span>
            <span> ₹ {{ spot.Rate }}/{{ spot.RentUnit }} </span>
        </AtomParagraph>
        <AtomParagraph class="card-spot" :type="'p'">
            <span
                v-if="getAvailability(spot.SlotsAvailable)"
                class="card-spot-green"
            >
                Available
            </span>
            <span v-else class="card-spot-red"> Rented Out </span>
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
        getAvailability(spot) {
            if (spot > 0) {
                return true;
            }
            return false;
        },
    },
};
</script>

<style scoped>
.custom-card {
    border-radius: var(--border-default);
    box-shadow: 0 0.5em 1em -0.125em rgb(10, 10, 10, 10%),
        0 0 0 1px rgb(10, 10, 10, 20%);
    column-gap: 0.25rem;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(5, auto);
    margin: 0.5rem;
    max-width: 500px;
    overflow: hidden;
    padding: 1rem;
    border: 2px solid transparent;
    transition: transform 0.3s ease;
}

.custom-card:hover {
    border: 2px solid var(--secondary-color);
    transform: scale(1.03);
}
.card-title {
    font-size: 1rem;
    grid-column: 1 / 5;
    grid-row: 1 / 1;
}

.card-location {
    align-items: center;
    display: flex;
    font-size: var(--sp-size-sm);
    gap: 10px;
    grid-column: 1 / 5;
    grid-row: 2 / 2;
    position: relative;
    line-height: 1.1;
    color: #6b6b6b;
}

.location-icon {
    font-size: 20px;
}

.location-text {
    -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
}

.card-rating {
    grid-column: 1 / 3;
    grid-row: 3 / 3;
    margin-top: 0.75rem;
}

.card-distance {
    background-color: rgb(214, 253, 255);
    width: 58px;
    text-align: center;
    padding: 0.75rem 0.75rem;
    border-radius: var(--border-default);
    grid-column: 5 / 7;
    grid-row: 1 / 3;
    align-self: end;
    justify-self: end;
}

.distance-text {
    line-height: var(--lh-small);
    font-weight: var(--bold-font);
    font-size: 16px;
}

.text-color {
    color: var(--secondary-color);
}

.card-rate {
    align-items: center;
    display: flex;
    font-weight: var(--bold-font);
    gap: 10px;
    grid-column: 1 / 4;
    grid-row: 4 / 5;
    margin-bottom: 0.75rem;
}

.rate-icon {
    color: green;
}

.card-spot {
    grid-column: 4 / 6;
    grid-row: 4 / 5;
}

.card-spot-red {
    color: red;
    font-weight: var(--bold-font);
}

.card-spot-green {
    color: green;
    font-weight: var(--bold-font);
}

.card-btn {
    grid-column: 1 / 7;
    grid-row: 5 / 6;
    font-weight: var(--bold-font);
}
</style>
