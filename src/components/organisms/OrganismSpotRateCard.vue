<template>
    <div class="rate-card">
        <div class="rate-container">
            <p class="rate">₹{{ spotDetails.Rate + discountAmount }}</p>
            <p class="discount-rate">₹{{ spotDetails.Rate }}</p>
            <p class="discount-label">{{ discountPercent }}% OFF</p>
        </div>
        <div class="star-rating">
            <AtomRating :rate="spotDetails.Rating"></AtomRating>
        </div>
        <hr />
        <div class="amount-breakage">
            <div>
                <p>₹{{ spotDetails.Rate + discountAmount }} x 1 month</p>
                <p>₹{{ spotDetails.Rate + discountAmount }}</p>
            </div>
            <div>
                <p>Discount</p>
                <p>- ₹{{ discountAmount }}</p>
            </div>
            <hr />
            <div>
                <p>Total</p>
                <p>₹{{ spotDetails.Rate }}</p>
            </div>
            <div>
                <div class="negative-margin">
                    <p style="margin-right: 5px">Conv. fee ( <span class="bold-text"> One time </span> ) </p>
                    <AtomTooltip :label="tooltipMsg">
                        <AtomIcon
                            :icon="ICON.INFO"
                            :size="'is-small'"
                        ></AtomIcon>
                    </AtomTooltip>
                </div>
                <p>+ ₹500</p>
            </div>
        </div>

        <ul>
            <li v-if="isAvailable" class="status-green">Available</li>
            <li v-else class="status-red">Rented Out</li>
        </ul>
        <AtomButton
            v-if="isAvailable"
            @click.native="onContact"
            class="top-margin"
            :expanded="true"
        >
            Book
        </AtomButton>
        <AtomButton
            v-else
            class="top-margin"
            @click.native="onContact"
            :expanded="true"
        >
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
            tooltipMsg:
                'This helps us run our platform and offer services. One time charge only. ',
        };
    },
    computed: {
        ...mapState('sdp', {
            spotDetails: (state) => state.spotDetails,
            isAvailable: (state) => state.isAvailable,
        }),

        discountAmount() {
            let amount = 0.15 * this.spotDetails.Rate;
            amount = Math.ceil(amount / 100) * 100;
            return amount;
        },

        discountPercent() {
            const fakePrice = this.spotDetails.Rate + this.discountAmount;
            return Math.ceil((this.discountAmount / fakePrice) * 100);
        },
    },
    methods: {
        onContact() {
            this.$router.push({ name: 'contactUs' });
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

        .bold-text {
            font-weight: 700;
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