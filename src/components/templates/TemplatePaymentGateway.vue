<template>
    <BodyWrapper>
        <MoleculePaymentCard
            v-if="!this.status"
            :bookingDetails="bookingDetails"
            :paymentMode="paymentMode"
        >
        </MoleculePaymentCard>
    </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import MoleculePaymentCard from '../molecules/MoleculePaymentCard.vue';
export default {
    name: 'TemplatePaymentGateway',
    components: {
        BodyWrapper,
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