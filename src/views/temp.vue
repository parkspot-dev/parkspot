<template>
  <div class="section">
    <div class="container">
      <div class="div">{{ count }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "temp",
  computed: {
    count() {
      return this.$store.state.count;
    },
  },
};
</script>