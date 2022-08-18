<template>
    <Wrapper>
        <MoleculePaymentCard
            v-if="!this.status"
            :bookingDetails="bookingDetails"
            :paymentMode="paymentMode"
        >
        </MoleculePaymentCard>
    </Wrapper>
</template>

<script>
import Wrapper from '../extras/Wrapper.vue';
import MoleculePaymentCard from '../molecules/MoleculePaymentCard.vue';
export default {
    name: 'TemplatePaymentGateway',
    components: {
        Wrapper,
        MoleculePaymentCard,
    },
    props: {
        bookingDetails: {
            type: Object,
        },
        paymentMode: {
            type: Object,
        },
        status: Boolean,
        error: Boolean,
        success: Boolean,
        pending: Boolean,
        displayMsg: Boolean,
        displayMsgContent: String,
    },
};
</script>

<style></style>
