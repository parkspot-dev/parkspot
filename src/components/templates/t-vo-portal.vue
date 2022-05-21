<template>
  <div class="t_vo_portal section">
    <div class="container">
      <div class="columns">
        <div class="column"></div>
        <div class="column is-6">
          <o-vo-details :map-show="mapShow" @submit="onSubmit" />
        </div>
        <div class="column"></div>
      </div>
    </div>
  </div>
</template>
<script>
import oVoDetails from "../organisms/o-vo-details.vue";
export default {
  name: "TVoPortal",
  components: { oVoDetails },
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
.t_vo_portal {
  background-color: #ececec;
}
</style>
