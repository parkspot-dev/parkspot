<template>
  <div class="o_portal_section section mb-0">
    <div class="container">
      <m-portal-buttons />
    </div>
  </div>
</template>

<script>
import MPortalButtons from "../molecules/m-portal-buttons.vue";
export default {
  components: { MPortalButtons },

  name: "o-portal-section",
};
</script>
<style scoped>
.o_portal_section {
  background-color: #ececec;
}
</style>

