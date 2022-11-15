<template>
    <div class="rate-card">
        <div class="rate-container">
            <p class="rate">₹9,000</p>
            <p class="discount-rate">₹5,000</p>
        </div>
        <div class="star-rating">
            <AtomRating></AtomRating>
        </div>
        <hr />
        <div class="amount-breakage">
            <div>
                <p>₹9,000 x 1 month</p>
                <p>₹9,000</p>
            </div>
            <div>
                <p>Discount</p>
                <p>₹4,000</p>
            </div>
            <div>
                <p>Convenience fee</p>
                <p>₹500</p>
            </div>
            <hr />
            <div>
                <p>Total before taxes</p>
                <p>₹9000</p>
            </div>
        </div>

        <AtomButton class="top-margin" :expanded="true"> Book </AtomButton>
    </div>
</template>

<script>
import AtomRating from '../atoms/AtomRating.vue';
import AtomButton from '../atoms/AtomButton.vue';
export default {
    name: 'OrganismSpotRateCard',
    components: {
        AtomRating,
        AtomButton,
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

    hr {
        background-color: #d7d7d7;
        height: 2px;
    }

    .rate-container {
        display: flex;
        gap: 10px;
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