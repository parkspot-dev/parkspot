<template>
  <Wrapper>
    <AtomHeadings class="mb-5 has-text-centered">
      Fill the form to Register your Parking Spot
    </AtomHeadings>
    <div class="card p-6 cmargin">
      <b-steps
        v-model="activeStep"
        :has-navigation="hasNavigation"
        :icon-prev="prevIcon"
        :icon-next="nextIcon"
        :label-position="labelPosition"
        :mobile-mode="mobileMode"
      >
        <b-step-item
          step="1"
          label="Step 1"
          :clickable="isStepsClickable"
          :type="btnStack[0] ? 'is-success' : 'is-warning'"
        >
          <AtomHeadings :level="headingLevel" class="mb-5 has-text-centered">
            Contact Details
          </AtomHeadings>
          <OrganismContactForm
            :formSubmitted="btnStack[0]"
            @formValidate="contactFormValidate"
          ></OrganismContactForm>
        </b-step-item>

        <b-step-item
          step="2"
          label="Step 2"
          :clickable="isStepsClickable"
          :type="btnStack[1] ? 'is-success' : 'is-warning'"
        >
          <AtomHeadings :level="headingLevel" class="mb-5 has-text-centered">
            KYC Details
          </AtomHeadings>
          <OrganismKycForm
            :formSubmitted="btnStack[1]"
            @formValidate="kycFormValidate"
          ></OrganismKycForm>
        </b-step-item>

        <b-step-item
          step="3"
          label="Step 3"
          :clickable="isStepsClickable"
          :type="btnStack[2] ? 'is-success' : 'is-warning'"
        >
          <AtomHeadings :level="headingLevel" class="mb-5 has-text-centered">
            Location Details
          </AtomHeadings>
          <OrganismAddressForm
            :formSubmitted="btnStack[2]"
            @formValidate="addressFormValidate"
            :reRender="reRender"
          ></OrganismAddressForm>
        </b-step-item>

        <b-step-item
          :step="4"
          label="Step 4"
          :clickable="isStepsClickable"
          disabled
          :type="btnStack[3] ? 'is-success' : 'is-warning'"
          ><AtomHeadings :level="headingLevel" class="mb-5 has-text-centered">
            Additional Details
          </AtomHeadings>
          <OrganismAdditionalInfo
            :formSubmitted="btnStack[3]"
            @formValidate="AddInfoFormValidate"
          ></OrganismAdditionalInfo>
        </b-step-item>

        <template v-if="customNavigation" #navigation="{ previous, next }">
          <div class="footer-buttons">
            <b-button
              outlined
              type="is-danger"
              icon-pack="mdi"
              :icon-left="prevIcon"
              :disabled="previous.disabled"
              @click.prevent="btnPrev(previous)"
              class="mr-4"
            >
              Prev
            </b-button>
            <b-button
              outlined
              type="is-success"
              icon-pack="mdi"
              :icon-right="nextIcon"
              :disabled="false"
              @click.prevent="btnNext(next)"
            >
              {{ nextText }}
            </b-button>
          </div>
        </template>
      </b-steps>
    </div>
  </Wrapper>
</template>

<script>
import OrganismContactForm from "../organisms/OrganismContactForm.vue";
import OrganismKycForm from "../organisms/OrganismKycForm.vue";
import OrganismAdditionalInfo from "../organisms/OrganismAdditionalInfo.vue";
import OrganismAddressForm from "../organisms/OrganismAddressForm.vue";
import Wrapper from "../extras/Wrapper.vue";
import AtomHeadings from "../atoms/AtomHeadings.vue";
export default {
  name: "TemplateSOPortal",
  components: {
    OrganismContactForm,
    OrganismKycForm,
    OrganismAdditionalInfo,
    OrganismAddressForm,
    AtomHeadings,
    Wrapper,
  },
  emits: ["finalSubmit"],
  data() {
    return {
      activeStep: 0,

      hasNavigation: false,
      customNavigation: true,
      isProfileSuccess: false,
      contactFormStep: false,
      KYCFormStep: false,
      AddInfoFormStep: false,

      prevIcon: "chevron-left",
      nextIcon: "chevron-right",
      labelPosition: "bottom",
      mobileMode: "minimalist",

      isStepsClickable: false,

      headingLevel: "h3",

      nextEnable: null,
      nextText: "Next",
      btnStack: [false, false, false, false],
      top: 0,

      reRender: 0,
    };
  },
  methods: {
    btnNext(next) {
      setTimeout(() => {
        this.reRender++;
      }, 10);
      // this.btnStack[this.top] = true; // this is not updating the array in vue
      this.btnStack.splice(this.top, 1, true); // this is to trigger validation in the form
      this.nextEnable = next;
    },
    btnPrev(previous) {
      this.top--;
      this.btnStack.splice(this.top, 1, false);
      this.nextText = "Next";
      previous.action();
    },
    contactFormValidate(val) {
      this.btnStack.splice(this.top, 1, val);
      if (this.btnStack[this.top]) {
        this.nextEnable.action();
        this.top++;
      }
    },
    kycFormValidate(val) {
      this.btnStack.splice(this.top, 1, val);
      if (this.btnStack[this.top]) {
        this.nextEnable.action();
        this.top++;
      }
    },
    addressFormValidate(val) {
      this.btnStack.splice(this.top, 1, val);
      if (this.btnStack[this.top]) {
        this.nextEnable.action();
        this.nextText = "Finish";
        this.top++;
      }
    },
    AddInfoFormValidate(val) {
      this.btnStack.splice(this.top, 1, val);
      if (this.btnStack[this.top]) {
        this.nextEnable.action();
        this.$emit("finalSubmit");
      }
    },
  },
};
</script>

<style scoped>
.cmargin {
  margin: 0 15rem;
}
.footer-buttons {
  display: flex;
  justify-content: space-between;
}
@media only screen and (max-width: 800px) {
  .cmargin {
    margin: 0 5rem;
  }
}
@media only screen and (max-width: 600px) {
  .cmargin {
    margin: 0;
  }
}
</style>
