<template>
  <div class="ps-container">
    <o-so-details @submit="onSubmit" :mapShow="mapShow" />
  </div>
</template>
<script>
import oSoDetails from "../organisms/o-so-details.vue";
export default {
  components: { oSoDetails },
  name: "t-so-portal",
  emits: ["submit"],
  props: {
    mapShow: Boolean,
  },
  methods: {
    onSubmit(registerData, logInData, kycData, contactData) {
      this.$emit("submit", registerData, logInData, kycData, contactData);
    },
  },
};
</script>
<style scoped>
.ps-container {
  max-width: 80rem;
  margin: 0 auto;
}
</style>
