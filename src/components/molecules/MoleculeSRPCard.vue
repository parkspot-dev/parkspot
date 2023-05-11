<template>
    <div class="custom-card" @click="onDetails">
        <div class="card-primary">
            <div>
                <div class="card-title">
                    <p>
                        {{ spot.Name }}
                    </p>
                </div>

                <!-- <AtomRating
                    class="card-rating"
                    :rate="spot.Rating"
                ></AtomRating> -->
                <b-tag type="is-success">
                    {{ spot.Rating }} <span>★</span>
                </b-tag>

                <div class="card-location">
                    <span class="location-icon">
                        <AtomIcon :icon="'map-marker'"></AtomIcon>
                    </span>
                    <p class="location-text">
                        {{ spot.Address }}
                    </p>
                </div>
            </div>
            <div class="card-distance">
                <p class="distance-text">
                    <span class="text-color"> {{ spot.Distance }} KM </span>
                </p>
            </div>
        </div>

        <div class="card-secondary">
            <div class="card-rate">
                <p>
                    <span class="rate-icon">
                        <AtomIcon :icon="'tag'"></AtomIcon>
                    </span>
                    <span> ₹ {{ spot.Rate }}/{{ spot.RentUnit }} </span>
                </p>
            </div>

            <div class="card-spot">
                <p>
                    <span
                        v-if="getAvailability(spot.SlotsAvailable)"
                        class="card-spot-green"
                    >
                        Available
                    </span>
                    <span v-else class="card-spot-red"> Rented Out </span>
                </p>
            </div>
        </div>
        <!-- <AtomButton class="card-btn" @click.native="onDetails">
            Spot Details
        </AtomButton> -->
    </div>
</template>

<script>
// import AtomRating from '../atoms/AtomRating.vue';
// import AtomButton from '../atoms/AtomButton.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
export default {
    name: 'MoleculeSRPCard',
    components: {
        // AtomRating,
        // AtomButton,
        AtomIcon,
    },
    props: {
        spot: {
            type: Object,
        },
    },
    emits: ['on-details'],
    methods: {
        onDetails() {
            this.$emit('on-details', this.spot.ID);
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

<style lang="scss" scoped>
.custom-card {
    margin: 0.8rem;
    border-radius: var(--border-default);
    box-shadow: 0 0.5em 1em -0.125em rgb(10, 10, 10, 10%),
        0 0 0 1px rgb(10, 10, 10, 20%);
    overflow: hidden;
    max-width: 500px;
    padding: 1rem;
    position: relative;
    transition: transform 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: scale(1.03);

        &::before {
            content: '';
            position: absolute;
            background: var(--secondary-color);
            bottom: 25%;
            left: 0;
            width: 2px;
            height: 50%;
        }

        &::after {
            content: '';
            position: absolute;
            background: var(--secondary-color);
            right: 0;
            bottom: 25%;
            width: 2px;
            height: 50%;
        }
    }

    .card-primary {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        align-items: flex-start;
    }

    .card-secondary {
        display: flex;
        justify-content: space-between;
        margin-top: 14px;
    }

    .card-title {
        font-size: 15px;
        font-weight: 500;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        overflow: hidden;
    }

    .card-location {
        align-items: center;
        display: flex;
        font-size: 12px;
        gap: 5px;
        position: relative;
        line-height: 1.1;
        color: #6b6b6b;
        margin-top: 10px;

        .location-icon {
            font-size: 16px;
        }

        .location-text {
            -webkit-box-orient: vertical;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            overflow: hidden;
            font-size: 12px;
            word-wrap: break-word;
        }
    }

    .card-rating {
        margin-bottom: unset;
    }

    .card-distance {
        background-color: rgb(214, 253, 255);
        width: 58px;
        text-align: center;
        padding: 0.75rem 0.75rem;
        border-radius: var(--border-default);
        grid-column: 5 / 7;
        grid-row: 1 / 3;
    }

    .distance-text {
        line-height: var(--lh-small);
        font-weight: var(--bold-font);
        font-size: 14px;
    }

    .text-color {
        color: var(--secondary-color);
    }

    .card-rate {
        align-items: center;
        display: flex;
        font-weight: var(--bold-font);
        gap: 10px;
    }

    .rate-icon {
        color: green;
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
        // grid-column: 1 / 7;
        // grid-row: 5 / 6;
        font-weight: var(--bold-font);
    }
}
</style>
