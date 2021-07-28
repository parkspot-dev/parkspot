<template>
  <div class="o_blog-box mx-6">
    <div class="columns">
      <m-blog-box-details class="column" />
      <m-blog-box-details class="column" />
      <m-blog-box-details class="column" />
      <m-blog-box-details class="column" />
    </div>
  </div>
</template>

<script>
import mBlogBoxDetails from "../molecules/m-blog-box-details.vue";
export default {
  components: { mBlogBoxDetails },
  name: "o-blog-box",
};
</script>