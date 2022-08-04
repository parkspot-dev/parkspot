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
  max-height: 300px;
  padding: 6rem;
}
</style>
