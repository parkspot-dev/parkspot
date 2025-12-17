<template>
    <BodyWrapper>
        <MoleculePaymentCard
            v-if="!status"
            :booking-details="bookingDetails"
            :payment-mode="paymentMode"
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
    },
};
</script>