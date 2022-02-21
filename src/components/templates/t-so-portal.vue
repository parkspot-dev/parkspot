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
  props: {
    mapShow: Boolean,
  },
  methods: {
    onSubmit(data) {
      this.$emit("submit", data);
    },
  },
};
</script>
<style scoped>
.t_so_portal {
  background-color: #ececec;
}
</style>