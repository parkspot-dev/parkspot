<template>
    <div class="custom-card">
        <AtomParagraph class="card-title" :type="'span'">
            {{ spot.Name }}
        </AtomParagraph>
        <div class="card-location">
            <span class="location-icon">
                <AtomIcon :icon="'map-marker-radius'"></AtomIcon>
            </span>
            <AtomParagraph class="location-text" :type="'span'">
                {{ spot.Address }}
            </AtomParagraph>
        </div>
        <AtomRating class="card-rating" :rate="spot.Rating"></AtomRating>
        <div class="card-distance">
            <AtomParagraph class="distance-text" :type="'p'">
                <strong class="text-color"> {{ spot.Distance }} KM </strong>
            </AtomParagraph>
        </div>

        <AtomParagraph class="card-rate" :type="'span'">
            <span class="rate-icon">
                <AtomIcon :icon="'tag'"></AtomIcon>
            </span>
            <AtomParagraph :type="'span'">
                <strong> ₹ {{ spot.Rate }} / {{ spot.RentUnit }} </strong>
            </AtomParagraph>
        </AtomParagraph>
        <AtomParagraph class="card-spot" :type="'span'">
            <strong
                v-if="getAvailability(spot.SlotsAvailable)"
                class="card-spot-green"
            >
                Available
            </strong>
            <strong v-else class="card-spot-red"> Rented Out </strong>
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
    filters: {
        available(slotAvailable) {
            if (slotAvailable === 0) {
                return 'Rented Out';
            } else {
                return 'Available';
            }
        },
    },
    methods: {
        onBook() {
            this.$emit('booked');
        },
        getAvailability(spot) {
            if (spot === 0) {
                return false;
            } else {
                return true;
            }
        },
    },
};
</script>

<style scoped>
.custom-card {
    border-radius: var(--border-default);
    box-shadow: 0 0.5em 1em -0.125em rgb(10, 10, 10, 10%),
        0 0 0 1px rgb(10, 10, 10, 20%);
    column-gap: 0.75rem;
    display: grid;
    grid-template-columns: repeat(6, auto);
    grid-template-rows: repeat(5, auto);
    margin: 0.5rem;
    max-width: 500px;
    overflow: hidden;
    padding: 2rem;
    row-gap: 0.25rem;
}

.card-title {
    font-size: 18px;
    font-weight: var(--bold-font);
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
}

.card-distance {
    background-color: rgb(214, 253, 255);
    width: 75px;
    text-align: center;
    padding: 1.25rem 1.25rem;
    border-radius: var(--border-default);
    grid-column: 5 / 7;
    grid-row: 1 / 3;
    align-self: end;
    justify-self: end;
}

.distance-text {
    line-height: var(--lh-small);
}

.text-color {
    color: var(--secondary-color);
}

.card-rate {
    grid-column: 1 / 3;
    grid-row: 4 / 5;
}

.rate-icon {
    color: green;
}

.card-spot {
    grid-column: 3 / 5;
    grid-row: 4 / 5;
}

.card-spot-red {
    color: red;
}

.card-spot-green {
    color: green;
}

.card-btn {
    grid-column: 1 / 7;
    grid-row: 5 / 6;
}
</style>
