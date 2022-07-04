<template>
  <section class="section">
    <div class="container">
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
            :type="contactFormStep ? 'is-success' : 'is-warning'"
          >
            <h1 class="title has-text-centered">Contact Details</h1>
            <OrganismContactForm
              :formSubmitted="contactForm"
              @formValidate="contactFormValidate"
            ></OrganismContactForm>
          </b-step-item>

          <b-step-item
            step="2"
            label="Step 2"
            :clickable="isStepsClickable"
            :type="KYCFormStep ? 'is-success' : 'is-warning'"
          >
            <h1 class="title has-text-centered">KYC Details</h1>
            <OrganismKycForm
              :formSubmitted="kycForm"
              @formValidate="kycFormValidate"
            ></OrganismKycForm>
          </b-step-item>

          <b-step-item
            :step="3"
            label="Finish"
            :clickable="isStepsClickable"
            disabled
            :type="AddInfoFormStep ? 'is-success' : 'is-warning'"
          >
            <h1 class="title has-text-centered">Finish</h1>
            <OrganismAdditionalInfo
              :formSubmitted="AddInfoForm"
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
                @click.prevent="previous.action"
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
                Next
              </b-button>
            </div>
          </template>
        </b-steps>
      </div>
    </div>
  </section>
</template>

<script>
import OrganismContactForm from "../organisms/OrganismContactForm.vue";
import OrganismKycForm from "../organisms/OrganismKycForm.vue";
import OrganismAdditionalInfo from "../organisms/OrganismAdditionalInfo.vue";
export default {
  name: "TemplateSOPortal",
  components: {
    OrganismContactForm,
    OrganismKycForm,
    OrganismAdditionalInfo,
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

      contactForm: false,
      kycForm: false,
      AddInfoForm: false,
      nextEnable: null,
    };
  },
  methods: {
    btnNext(next) {
      if (this.contactForm && this.kycForm && this.AddInfoForm) {
        this.$emit("finalSubmit");
      }
      if (!this.contactForm) {
        console.log(1);
        this.contactFormValidate(this.contactForm);
        this.contactForm = true; // this is to trigger validation in the form
      } else if (!this.kycForm) {
        console.log(2);
        this.kycFormValidate(this.kycForm);
        this.kycForm = true;
      } else if (!this.AddInfoForm) {
        console.log(3);
        this.AddInfoFormValidate(this.AddInfoForm);
        this.AddInfoForm = true;
      } else {
        this.nextEnable.action(); // this is for when previous is clicked and want to click next
      }
      this.nextEnable = next;
    },
    contactFormValidate(val) {
      this.contactForm = val;
      if (this.contactForm) {
        this.nextEnable.action();
      }
    },
    kycFormValidate(val) {
      this.kycForm = val;
      if (this.kycForm) {
        this.nextEnable.action();
      }
    },
    AddInfoFormValidate(val) {
      this.AddInfoForm = val;
      if (this.AddInfoForm) {
        this.nextEnable.action();
      }
    },
  },
};
</script>

<style scoped>
.cmargin {
  margin: 0 10rem;
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