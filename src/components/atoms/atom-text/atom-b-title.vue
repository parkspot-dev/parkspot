<template>
  <h1 class="is-size-2 is-size-3-mobile">
    {{ text }}
  </h1>
</template>

<script>
export default {
  name: "AtomBTitle",
  props: {
    text: {
      type: String,
      default() {
        return "Title";
      },
    },
  },
};
</script>
<style scoped>
/* .title-font {
  font-size: 2rem;
} */
</style>
