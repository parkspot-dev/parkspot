<template>
  <div class="m_blog_title">
    <atom-b-title />
    <div class="author_details">
      <atom-img />
      <atom-b-subtitle />
      <atom-text />
      <atom-text />
    </div>
  </div>
</template>

<script>
import AtomImg from "../atoms/atom-img/atom-img.vue";
import atomBTitle from "../atoms/atom-text/atom-b-title.vue";
import AtomText from "../atoms/atom-text/atom-text.vue";
export default {
  components: { atomBTitle, AtomImg, AtomText },
  name: "m-blog-title",
};
</script>