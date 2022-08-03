<template>
  <div class="custom-banner">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.custom-banner {
  background: url("../../assets/discover-banner.svg");
  height: 35vh;
  padding-top: 3rem;
}
</style>
