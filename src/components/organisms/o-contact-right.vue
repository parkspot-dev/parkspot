<template>
  <div class="o_contact_right">
    <form @submit.prevent="onSubmit">
      <atom-input
        v-model="userContact.name"
        class="input mb-2"
        :types="text"
        :placeholder="placeholder1"
        :required="required"
      />
      <atom-input
        v-model="userContact.email"
        class="input mb-2"
        :types="email"
        :placeholder="placeholder2"
        :required="required"
        :validation-check="validation.email.msg"
        @invalid="validationCheck"
      />
      <atom-input
        v-model="userContact.mno"
        class="input mb-2"
        :types="tel"
        :placeholder="placeholder3"
        :required="required"
        :pattern="pattern"
        :validation-check="validation.mobile.msg"
        @invalid="validationCheck"
      />
      <atom-textarea
        v-model="userContact.msg"
        class="textarea mb-2"
        :placeholder="placeholder4"
      />
      <atom-button
        class="button is-warning is-pulled-right"
        :class="{ 'is-loading': toggle }"
        :text="submit"
      />
    </form>
  </div>
</template>

<script>
import AtomButton from "@/components/atoms/atom-button/atom-button.vue";
import atomInput from "@/components/atoms/atom-input/atom-input.vue";
import AtomTextarea from "@/components/atoms/atom-input/atom-textarea.vue";
export default {
  name: "OContactRight",
  components: { atomInput, AtomTextarea, AtomButton },
  data() {
    return {
      // input details
      text: "text",
      email: "email",
      tel: "tel",
      placeholder1: "Name",
      placeholder2: "Email",
      placeholder3: "Mobile No.",
      placeholder4: "Your Questions...",
      submit: "Submit",
      required: true,

      toggle: false, // toggle used for showing loading animation of button
      //contact details object
      userContact: {
        name: "",
        email: "",
        mno: "",
        msg: "",
      },
      pattern: "[6789][0-9]{9}",
      validation: {
        mobile: {
          msg: "Please enter a valid mobile no.!!",
        },
        email: {
          msg: "An email address must contain a single @",
        },
      },
    };
  },
  methods: {
    async onSubmit() {
      this.toggle = !this.toggle;
      // const user = JSON.parse(JSON.stringify(this.userContact)); // getting proper object after stringify and parse
      const user = {
        User: {
          FullName: this.userContact.name,
          EmailID: this.userContact.email,
          Mobile: this.userContact.mno,
        },
        Comments: this.userContact.msg,
      };
      fetch("https://maya.parkspot.in/contact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      this.userContact.name = "";
      this.userContact.email = "";
      this.userContact.mno = "";
      this.userContact.msg = "";
      this.toggle = !this.toggle;
      this.errors.error = false; //removing error msg //TODO: check why not listening to errors.
      this.submit = "Thank You for Contacting Us!"; // changing the text of submit button after submitting the form
    },
    validationCheck(e, validation) {
      if (e.target.value) {
        e.target.setCustomValidity(validation);
      }
    },
  },
};
</script>
