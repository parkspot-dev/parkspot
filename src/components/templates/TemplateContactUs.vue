<template>
      <Wrapper>
            <div class="columns">
                  <OrganismContactUs class="column is-half"></OrganismContactUs>
                  <div class="column is-half" data-aos="slide-up">
                        <div class="card px-6 py-5">
                              <OrganismContactForm
                                    :textArea="true"
                                    :formSubmitted="formSubmitted"
                                    @formValidate="contactFormValidate"
                              ></OrganismContactForm>
                              <AtomButton @click.native="sendMsg"
                                    >Send Message</AtomButton
                              >
                        </div>
                  </div>
            </div>
      </Wrapper>
</template>

<script>
import Wrapper from "../extras/Wrapper.vue";
import OrganismContactUs from "../organisms/OrganismContactUs.vue";
import OrganismContactForm from "../organisms/OrganismContactForm.vue";
import AtomButton from "../atoms/AtomButton.vue";
export default {
      name: "TemplateContactUs",
      components: {
            Wrapper,
            OrganismContactUs,
            OrganismContactForm,
            AtomButton,
      },
      emits: ["contactUs"],
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
                        console.log("template contact us");
                        this.$emit("contactUs");
                  }
                  this.formSubmitted = false;
            },
      },
};
</script>
<style scoped></style>
