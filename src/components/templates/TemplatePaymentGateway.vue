<template>
      <Wrapper>
            <MoleculePaymentCard
                  v-if="!this.status"
                  :bookingDetails="bookingDetails"
                  :paymentMode="paymentMode"
            >
            </MoleculePaymentCard>
            <MoleculePaymentStatusCard
                  v-if="this.status"
                  :error="error"
                  :success="success"
                  :pending="pending"
                  :displayMsg="displayMsg"
                  :displayMsgContent="displayMsgContent"
            ></MoleculePaymentStatusCard>
      </Wrapper>
</template>

<script>
import Wrapper from "../extras/Wrapper.vue";
import MoleculePaymentCard from "../molecules/MoleculePaymentCard.vue";
import MoleculePaymentStatusCard from "../molecules/MoleculePaymentStatusCard.vue";
export default {
      name: "TemplatePaymentGateway",
      components: {
            Wrapper,
            MoleculePaymentCard,
            MoleculePaymentStatusCard,
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
