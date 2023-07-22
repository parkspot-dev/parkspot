<template>
    <div class="custom-card" @click="onDetails">
        <div class="card-primary">
            <div>
                <div class="card-title">
                    <p>
                        {{ spot.Name }}
                    </p>
                </div>
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
    </div>
</template>

<script>
import AtomIcon from '../atoms/AtomIcon.vue';
export default {
    name: 'MoleculeSRPCard',
    components: {
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
    position: relative;
    overflow: hidden;
    margin: 0.8rem;
    padding: 1rem;
    max-width: 500px;
    border-radius: var(--border-default);
    box-shadow: 0 0.5em 1em -0.125em rgb(10, 10, 10, 10%),
        0 0 0 1px rgb(10, 10, 10, 20%);
    transition: transform 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: scale(1.03);

        &::before {
            content: '';
            position: absolute;
            bottom: 25%;
            left: 0.25px;
            width: 2px;
            height: 50%;
            background: var(--secondary-color);
        }

        &::after {
            content: '';
            position: absolute;
            right: 0.25px;
            bottom: 25%;
            width: 2px;
            height: 50%;
            background: var(--secondary-color);
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
        display: -webkit-box;
        overflow: hidden;
        font-size: 15px;
        font-weight: 500;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
    }

    .card-location {
        position: relative;
        display: flex;
        align-items: center;
        margin-top: 10px;
        font-size: 12px;
        gap: 5px;
        line-height: 1.1;
        color: var(--parkspot-muted-black);

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
        padding: 0.75rem;
        width: 58px;
        border-radius: var(--border-default);
        text-align: center;
        background-color: rgb(214, 253, 255);
        grid-column: 5 / 7;
        grid-row: 1 / 3;
    }

    .distance-text {
        line-height: var(--lh-small);
        font-size: 14px;
        font-weight: var(--bold-font);
    }

    .text-color {
        color: var(--secondary-color);
    }

    .card-rate {
        display: flex;
        align-items: center;
        font-weight: var(--bold-font);
        gap: 10px;
    }

    .rate-icon {
        color: #85bb65;
    }

    .card-spot-red {
        font-weight: var(--bold-font);
        color: #cc3636;
    }

    .card-spot-green {
        font-weight: var(--bold-font);
        color: var(--parkspot-green);
    }

    .card-btn {
        font-weight: var(--bold-font);
    }
}
</style>
