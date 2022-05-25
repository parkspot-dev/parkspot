<template>
  <div class="m_testimonial_user card mb-4 px-4" :class="{ 'is-color': color }">
    <div class="columns is-mobile">
      <div class="column is-3"><atom-img class="image" :src="src" /></div>
      <div class="column">
        <atom-text :text="name" />
        <atom-text class="is-size-7 mt-2" :text="designation" />
      </div>
    </div>
  </div>
</template>

<script>
import atomImg from "../atoms/atom-img/atom-img.vue";
import AtomText from "../atoms/atom-text/atom-text.vue";
export default {
  name: "MTestimonialUser",
  components: { atomImg, AtomText },
  props: ["src", "name", "designation", "color"],
};
</script>
<style scoped>
.m_testimonial_user {
  cursor: pointer;
  border-radius: 20px;
  /* border: 2px solid #0085ad; */
  padding: 10px;
}
.image {
  border-radius: 80%;
  width: 50px;
}
.is-color {
  /* border-right-style: solid;
  border-color: #0085ad;
  border-left-style: solid; */
  border: 2px solid #0085ad;
}
</style>
