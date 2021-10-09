<template>
  <div class="t_testimonials section" style="height: 80vh">
    <div class="container">
      <atom-b-title
        class="is-size-3-mobile is-size-2 mb-6 has-text-centered"
        :text="title"
      />
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
</style>