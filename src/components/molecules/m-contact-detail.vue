<template>
  <div @input="handleInput">
    <label class="mb-4 ml-3"> Contact Details </label>
    <div class="columns">
      <div class="column">
        <atom-input
          :placeholder="`First Name`"
          v-model="firstName"
        ></atom-input>
      </div>
      <div class="column">
        <atom-input :placeholder="`Last Name`" v-model="lastName"></atom-input>
      </div>
    </div>
    <atom-input
      class="mb-5"
      :placeholder="`Email Id: Example@gmail.com`"
      :types="`email`"
      v-model="email"
    ></atom-input>
    <atom-input
      :placeholder="`Contact No.`"
      :types="`tel`"
      v-model="contactNo"
    ></atom-input>
  </div>
</template>

<script>
import atomInput from "../atoms/atom-input/atom-input.vue";
export default {
  components: { atomInput },
  props: ["personalInfo"],
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      contactNo: null,
    };
  },
  methods: {
    handleInput(e) {
      let userPersonalInfo = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        contactNo: this.contactNo,
      };
      this.$emit("input", userPersonalInfo);
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