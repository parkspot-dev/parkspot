<template>
  <ValidationObserver ref="observer" v-slot="{}">
    <MoleculeNameInput
      :rules="validation.fname"
      :fieldName="CONTACT_FORM.FIRSTNAME"
      v-model="model.fname"
      :placeholder="CONTACT_FORM.FIRSTNAME"
      :label="CONTACT_FORM.FIRSTNAME"
    >
    </MoleculeNameInput>
    <MoleculeNameInput
      :rules="validation.lname"
      :fieldName="CONTACT_FORM.LASTNAME"
      v-model="model.lname"
      :placeholder="CONTACT_FORM.LASTNAME"
      :label="CONTACT_FORM.LASTNAME"
    >
    </MoleculeNameInput>
    <MoleculeNameInput
      :rules="validation.email"
      :fieldName="CONTACT_FORM.EMAIL"
      v-model="model.email"
      :placeholder="CONTACT_FORM.EMAIL"
      :inputType="'email'"
      :label="CONTACT_FORM.EMAIL"
    >
    </MoleculeNameInput>
    <MoleculeNameInput
      :rules="validation.cno"
      :fieldName="CONTACT_FORM.CONTACT_NO"
      v-model="model.cno"
      :placeholder="CONTACT_FORM.CONTACT_NO"
      :label="CONTACT_FORM.CONTACT_NO"
    >
    </MoleculeNameInput>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from "vee-validate";
import { FORM } from "../../constant/constant";
import { mapMutations } from "vuex";
import MoleculeNameInput from "../molecules/MoleculeNameInput.vue";

export default {
  name: "OrganismContactForm",
  components: {
    ValidationObserver,
    MoleculeNameInput,
  },
  props: {
    formSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["formValidate"],
  data() {
    return {
      model: {
        fname: "",
        lname: "",
        email: "",
        cno: "",
      },
      validation: {
        fname: "required",
        lname: "required",
        email: "required|email",
        cno: "required|integer|phone",
      },
      CONTACT_FORM: FORM,
    };
  },
  watch: {
    formSubmitted(newVal) {
      if (newVal) {
        this.$refs.observer
          .validate()
          .then((el) => {
            if (el) {
              this.$emit("formValidate", el);
              this.submit();
            } else {
              this.$emit("formValidate", el);
            }
          })
          .catch((er) => {
            console.log(er);
          });
      }
    },
  },
  methods: {
    ...mapMutations({
      updateContact: "soportal/update-contact",
    }),
    submit() {
      this.updateContact(this.model);
    },
    resetForm() {
      this.model.fname = "";
      this.model.lname = "";
      this.model.email = "";
      this.model.cno = "";
      requestAnimationFrame(() => {
        this.$refs.observer.reset();
      });
    },
  },
};
</script>

<style></style>
