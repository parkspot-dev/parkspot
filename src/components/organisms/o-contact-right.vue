<template>
  <div class="o_contact_right">
    <form v-on:submit.prevent="onSubmit">
      <atom-input
        class="input mb-2"
        v-model="userContact.name"
        :types="text"
        :placeholder="placeholder1"
        :required="required"
      />
      <atom-input
        class="input mb-2"
        v-model="userContact.email"
        :types="email"
        :placeholder="placeholder2"
        :required="required"
      />
      <atom-input
        v-model="userContact.mno"
        class="input mb-2"
        :types="tel"
        :placeholder="placeholder3"
        :required="required"
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
  components: { atomInput, AtomTextarea, AtomButton },
  name: "o-contact-right",
  data() {
    return {
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
      userContact: {
        name: "",
        email: "",
        mno: "",
        msg: "",
      },
    };
  },
  methods: {
    async onSubmit() {
      this.toggle = !this.toggle;
      const user = JSON.parse(JSON.stringify(this.userContact)); // getting proper object after stringify and parse
      const res = await fetch("https://maya.parkspot.in/contact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          User: {
            FullName: user.name,
            EmailID: user.email,
            Mobile: user.mno,
          },
          Comments: user.msg,
        }),
      });
      const data = await res.json();
      this.userContact.name = "";
      this.userContact.email = "";
      this.userContact.mno = "";
      this.userContact.msg = "";
      this.toggle = !this.toggle;
      this.submit = "Thank You for Contacting Us!"; // changing the text of submit button after submitting the form
    },
  },
};
</script>

