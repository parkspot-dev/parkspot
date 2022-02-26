<template>
  <div class="t_so_portal section">
    <div class="container">
      <div class="columns">
        <div class="column"></div>
        <div class="column is-6">
          <o-so-details @submit="onSubmit" :mapShow="mapShow" />
        </div>
        <div class="column"></div>
      </div>
    </div>
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
.t_so_portal {
  background-color: #ececec;
}
</style>