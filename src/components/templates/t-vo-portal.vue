<template>
  <div class="t_vo_portal section">
    <div class="columns">
      <div class="column"></div>
      <div class="column is-6">
        <o-vo-details @submit="onSubmit" />
      </div>
      <div class="column"></div>
    </div>
  </div>
</template>
<script>
import oVoDetails from "../organisms/o-vo-details.vue";
export default {
  components: { oVoDetails },
  name: "t-vo-portal",

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