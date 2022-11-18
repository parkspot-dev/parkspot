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
                <p>Convenience fee</p>
                <p>+ ₹{{ spotDetails.Commission }}</p>
            </div>
            <hr />
            <div>
                <p>Total</p>
                <p>₹{{ spotDetails.Rate + spotDetails.Commission }}</p>
            </div>
        </div>

        <AtomButton class="top-margin" :expanded="true"> Book </AtomButton>
    </div>
</template>

<script>
import AtomRating from '../atoms/AtomRating.vue';
import AtomButton from '../atoms/AtomButton.vue';
import { mapState } from 'vuex';
export default {
    name: 'OrganismSpotRateCard',
    components: {
        AtomRating,
        AtomButton,
    },
    data() {
        return {};
    },
    computed: {
        ...mapState('srp', {
            spotDetails: (state) => state.spotDetails,
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
    }

    .top-margin {
        margin-top: 45px;
    }
}
</style>