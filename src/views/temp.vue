<template>
  <div class="section">
    <div class="container">
      <AtomHeadings level="h1">I am the heading h1</AtomHeadings>
      <AtomHeadings level="h2">I am the heading h2</AtomHeadings>
      <AtomHeadings level="h3">I am the heading h3</AtomHeadings>
      <AtomHeadings level="h4">I am the heading h4</AtomHeadings>
      <AtomHeadings level="h5">I am the heading h5</AtomHeadings>
      <AtomHeadings level="h6">I am the heading h6</AtomHeadings>
    </div>
  </div>
</template>
<script>
import AtomHeadings from "../components/atoms/AtomHeadings.vue";
export default {
  name: "Temp",
  components: { AtomHeadings },
  computed: {
    count() {
      return this.$store.getters["device/getFlavour"];
    },
  },
};
</script>
