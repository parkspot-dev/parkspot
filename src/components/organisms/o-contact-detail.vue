<template>
  <div @input="handleInput">
    <label class="mb-4 ml-3"> Contact Details </label>
    <div class="columns">
      <div class="column">
        <atom-input
          v-model="firstName"
          :placeholder="`First Name`"
          validation-check="invalid name"
        ></atom-input>
      </div>
      <div class="column">
        <atom-input v-model="lastName" :placeholder="`Last Name`"></atom-input>
      </div>
    </div>
    <atom-input
      v-model="email"
      class="mb-5"
      :placeholder="`Email Id: Example@gmail.com`"
      :types="`email`"
    ></atom-input>
    <atom-input
      v-model="contactNo"
      :placeholder="`Contact No.`"
      :types="`tel`"
      validation-check="l"
    ></atom-input>
  </div>
</template>

<script>
import atomInput from "../atoms/atom-input/atom-input.vue";
export default {
  components: { atomInput },
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      contactNo: null,
    };
  },
  methods: {
    handleInput() {
      let userPersonalInfo = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        contactNo: this.contactNo,
      };
      this.$emit("update:personal-info", userPersonalInfo);
    },
  },
};
</script>

<style scoped>
label {
  display: inline-block;
  font-size: 20px;
  font-weight: 400;
}
</style>
