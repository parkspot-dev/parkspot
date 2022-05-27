<template>
  <div class="m-features-title">
    <h1 class="title--size">
      Why Parking With ParkSpot Is
      <span class="title__second">GOOD</span>
    </h1>
  </div>
</template>
<script>
export default {
  name: "MFeaturesTitle",
};
</script>
<style scoped>
.title--size {
  font-size: 2rem;
}
.title__second {
  font-size: 1.5em;
  color: var(--secondary-color);
  font-weight: 700;
}
@media only screen and (min-width: 1024px) {
  .title--size {
    font-size: 2.5rem;
  }
}
</style>
