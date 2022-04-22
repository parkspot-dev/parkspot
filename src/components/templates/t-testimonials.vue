<template>
  <div class="t_testimonials section">
    <div class="container">
      <atom-b-title class="mb-6 has-text-centered" :text="title" />
      <o-testimonials />
    </div>
  </div>
</template>
<script>
import AtomBTitle from "../atoms/atom-text/atom-b-title.vue";
import oTestimonials from "../organisms/o-testimonials.vue";
export default {
  components: { oTestimonials, AtomBTitle },
  name: "t-testimonials",
  data() {
    return {
      title: "Our Testimonials",
    };
  },
};
</script>

<style scoped>
@media only screen and (min-width: 1024px) {
  .t_testimonials {
    height: 80vh;
  }
}
</style>
