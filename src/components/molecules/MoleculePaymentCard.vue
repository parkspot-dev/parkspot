<template>
      <div>
            <AtomParagraph>
                  <strong> Name: {{ bookingDetails.name }} </strong>
            </AtomParagraph>
            <AtomParagraph>
                  <strong> Due Date: {{ bookingDetails.dueDate }} </strong>
            </AtomParagraph>
            <AtomParagraph>
                  <strong> Amount: {{ bookingDetails.amount }} </strong>
            </AtomParagraph>
            <a :href="paymentMode.PaymentLink">
                  <AtomButton> Pay Now </AtomButton>
            </a>

            <AtomParagraph>
                  Bill description: Rent : {{ bookingDetails.baseAmount }} ,
                  Discount : {{ bookingDetails.discount }}, Convenience Fee :
                  {{ bookingDetails.convenienceFee }}
            </AtomParagraph>
      </div>
</template>

<script>
import AtomParagraph from "../atoms/AtomParagraph.vue";
import AtomButton from "../atoms/AtomButton.vue";
export default {
      name: "MoleculePaymentCard",
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

<style></style>
