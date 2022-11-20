<template>
    <div class="rate-card">
        <div class="rate-container">
            <p class="rate">₹{{ spotDetails.Rate + discount }}</p>
            <p class="discount-rate">₹{{ spotDetails.Rate }}</p>
            <p class="discount-label">{{ actualDiscount }}% OFF</p>
        </div>
        <div class="star-rating">
            <AtomRating :rate="spotDetails.Rating"></AtomRating>
        </div>
        <hr />
        <div class="amount-breakage">
            <div>
                <p>₹{{ spotDetails.Rate + discount }} x 1 month</p>
                <p>₹{{ spotDetails.Rate + discount }}</p>
            </div>
            <div>
                <p>Discount</p>
                <p>- ₹{{ discount }}</p>
            </div>
            <div>
                <div class="negative-margin">
                    <p>Convenience fee</p>
                    <AtomTooltip :label="tooltipMsg">
                        <AtomIcon
                            :icon="ICON.INFO"
                            :size="'is-small'"
                        ></AtomIcon>
                    </AtomTooltip>
                </div>
                <!-- <p>+ ₹{{ spotDetails.Commission }}</p> -->
                <p>+ ₹500</p>
            </div>
            <hr />
            <div>
                <p>Total</p>
                <!-- <p>₹{{ spotDetails.Rate + spotDetails.Commission }}</p> -->
                <p>₹{{ spotDetails.Rate + 500 }}</p>
            </div>
        </div>

        <ul>
            <li v-if="isAvailable" class="status-green">Available</li>
            <li v-else class="status-red">Rented Out</li>
        </ul>
        <AtomButton v-if="isAvailable" class="top-margin" :expanded="true">
            Book
        </AtomButton>
        <AtomButton v-else class="top-margin" :expanded="true">
            Notify me
        </AtomButton>
    </div>
</template>

<script>
import AtomRating from '../atoms/AtomRating.vue';
import AtomButton from '../atoms/AtomButton.vue';
import AtomTooltip from '../atoms/AtomTooltip.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
import { ICON } from '@/constant/constant';
import { mapState } from 'vuex';
export default {
    name: 'OrganismSpotRateCard',
    components: {
        AtomRating,
        AtomButton,
        AtomTooltip,
        AtomIcon,
    },
    data() {
        return {
            ICON,
            tooltipMsg: 'This helps us run our platform and offer services.',
        };
    },
    computed: {
        ...mapState('srp', {
            spotDetails: (state) => state.spotDetails,
            isAvailable: (state) => state.isAvailable,
        }),

        discount() {
            let discount = 0.15 * this.spotDetails.Rate;
            while (discount % 100 != 0) {
                discount = discount + (100 - (discount % 100));
            }
            return discount;
        },

        actualDiscount() {
            const fakePrice = this.spotDetails.Rate + this.discount;
            return Math.ceil((this.discount / fakePrice) * 100);
        },
    },
};
</script>

<style lang="scss" scoped>
.rate-card {
    width: 328px;
    height: 400px;
    border: 1px solid #000000;
    border-radius: var(--border-default);
    padding: 16px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    overflow: hidden;

    hr {
        background-color: #d7d7d7;
        height: 2px;
    }

    .rate-container {
        display: flex;
        gap: 10px;
        align-items: flex-start;

        .rate {
            font-weight: 600;
            font-size: 20px;
            text-decoration: line-through;
            color: #474747;
        }

        .discount-rate {
            font-weight: 600;
            font-size: 24px;
            color: #000;
        }

        .discount-label {
            font-size: 15px;
            font-weight: bold;
            background: hsl(141deg, 53%, 53%);
            padding: 2px 28px;
            position: absolute;
            top: 13px;
            right: -24px;
            transform: rotate(40deg);
        }
    }

    .star-rating {
        font-size: 24px;
        // margin-bottom: 10px;
    }

    .amount-breakage {
        div {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
        }

        .negative-margin {
            margin-bottom: -5px;
        }
    }

    ul {
        position: relative;
        font-size: 16px;
        margin-left: 20px;

        li:before {
            content: '. ';
            font-weight: bold;
            font-size: 50px;
            position: absolute;
            top: -38.5px;
            left: -18px;
        }
        .status-green {
            color: hsl(141, 53%, 53%);
            text-shadow: 0px 0px 10px #39ff14;

            &:before {
                color: hsl(141, 53%, 53%);
                text-shadow: 0px 0px 10px #39ff14;
            }
        }

        .status-red {
            color: hsl(348, 100%, 61%);
            text-shadow: 0px 0px 10px #ff3131;

            &:before {
                color: hsl(348, 100%, 61%);
                text-shadow: 0px 0px 10px #ff3131;
            }
        }
    }

    .top-margin {
        margin-top: 5px;
    }
}
</style>