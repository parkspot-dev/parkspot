<template>
  <div class="section">
    <div class="container">
      <atom-button> </atom-button>
    </div>
  </div>
</template>
<script>
import AtomButton from "../components/atoms/atom-button/atom-button.vue";
export default {
  name: "Temp",
  components: { AtomButton },
  computed: {
    count() {
      return this.$store.getters["device/getFlavour"];
    },
  },
};
</script>
