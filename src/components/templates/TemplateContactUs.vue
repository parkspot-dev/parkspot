<template>
  <Wrapper class="custom-bg">
    <div class="columns">
      <OrganismContactUs class="column is-half"></OrganismContactUs>
      <div class="column is-half">
        <div class="card px-6 py-5">
          <OrganismContactForm
            :textArea="true"
            :formSubmitted="formSubmitted"
            @formValidate="contactFormValidate"
          ></OrganismContactForm>
          <AtomButtons @click.native="sendMsg">Send Message</AtomButtons>
        </div>
      </div>
    </div>
  </Wrapper>
</template>

<script>
import Wrapper from "../extras/Wrapper.vue";
import OrganismContactUs from "../organisms/OrganismContactUs.vue";
import OrganismContactForm from "../organisms/OrganismContactForm.vue";
import AtomButtons from "../atoms/AtomButtons.vue";
export default {
  name: "TemplateContactUs",
  components: {
    Wrapper,
    OrganismContactUs,
    OrganismContactForm,
    AtomButtons,
  },
  data() {
    return {
      formSubmitted: false,
    };
  },
  methods: {
    sendMsg() {
      this.formSubmitted = true;
    },
    contactFormValidate(flag) {
      if (flag) {
        console.log("heloo");
      }
      this.formSubmitted = false;
    },
  },
};
</script>
<style scoped>
.custom-bg {
  background-color: #9fddf0;
}
</style>
