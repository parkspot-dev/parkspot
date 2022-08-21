<template>
    <div class="payment-card">
        <div class="mb-6">
            <div class="mb-4">
                <AtomParagraph>
                    <span class="card-grp">
                        <span><strong> Name: </strong></span>
                        <span>
                            <strong>{{ bookingDetails.name }}</strong>
                        </span>
                    </span>
                </AtomParagraph>
                <AtomParagraph>
                    <span class="card-grp">
                        <span><strong> Due Date: </strong></span>
                        <span>
                            <strong>{{ bookingDetails.dueDate }}</strong>
                        </span>
                    </span>
                </AtomParagraph>
                <AtomParagraph>
                    <span class="card-grp">
                        <span><strong> Amount: </strong></span>
                        <span>
                            <strong class="card-amt">
                                {{ bookingDetails.amount }}/-
                            </strong>
                        </span>
                    </span>
                </AtomParagraph>
            </div>
            <div class="card-btn">
                <a :href="paymentMode.PaymentLink">
                    <AtomButton> Pay Now </AtomButton>
                </a>
            </div>
        </div>

        <AtomParagraph :variation="'small'">
            <strong>Note:</strong>
            Bill description: Rent : {{ bookingDetails.baseAmount }} , Discount
            : {{ bookingDetails.discount }}, Convenience Fee :
            {{ bookingDetails.convenienceFee }}
        </AtomParagraph>
    </div>
</template>

<script>
import AtomParagraph from '../atoms/AtomParagraph.vue';
import AtomButton from '../atoms/AtomButton.vue';
export default {
    name: 'MoleculePaymentCard',
    components: {
        AtomParagraph,
        AtomButton,
    },
    props: {
        bookingDetails: {
            type: Object,
        },
        paymentMode: {
            type: Object,
        },
    },
};
</script>

<style scoped>
.payment-card {
    border-radius: var(--border-default);
    box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%),
        0 0 0 1px rgb(10 10 10 / 2%);
    margin: auto;
    max-width: 500px;
    padding: 2rem;
}

.card-grp {
    align-items: center;
    display: flex;
    gap: 1rem;
}

.card-amt {
    color: #50c878;
    font-size: 2rem;
}

.card-btn {
    text-align: center;
}
</style>
