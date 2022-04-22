<template>
  <div class="ps-contact-form" @input="handleInput">
    <p class="contact-title">Contact Details</p>

    <atom-input
      :placeholder="`First Name`"
      v-model="userPersonalInfo.firstName"
      :required="true"
    ></atom-input>

    <atom-input
      :placeholder="`Last Name`"
      v-model="userPersonalInfo.lastName"
    ></atom-input>

    <atom-input
      :placeholder="`Email Id: Example@gmail.com`"
      :types="`email`"
      v-model="userPersonalInfo.email"
    ></atom-input>

    <atom-input
      :placeholder="`Contact No.`"
      :types="`tel`"
      v-model="userPersonalInfo.contactNo"
    ></atom-input>

    <atom-input
      :placeholder="`State`"
      v-model="userPersonalInfo.state"
    ></atom-input>

    <atom-input
      :placeholder="`City`"
      v-model="userPersonalInfo.city"
    ></atom-input>
  </div>
</template>

<script>
import atomInput from "../atoms/atom-input/atom-input.vue";

export default {
  components: { atomInput },
  emits: ["input"],
  props: ["personalInfo"],
  data() {
    return {
      userPersonalInfo: this.personalInfo,
    };
  },
  methods: {
    handleInput() {
      this.$emit("input", this.userPersonalInfo);
    },
  },
};
</script>

<style scoped>
.contact-title {
  font-size: 1.25rem;
  font-weight: 500;
  text-transform: uppercase;
  align-self: end;
}

.ps-contact-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 1.5rem;
}
.contact-title {
  grid-column: 1 / -1;
}
</style>
