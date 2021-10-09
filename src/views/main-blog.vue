<template>
  <div class="main_blog">
    <t-main-blog :activeBlog="activeBlog" />
  </div>
</template>

<script>
import tMainBlog from "../components/templates/t-main-blog.vue";
export default {
  components: { tMainBlog },
  name: "main-blog",
  data() {
    return { now: false };
  },
  computed: {
    activeBlog() {
      let temp = parseInt(this.$route.params.id);
      this.$store.commit("blog/selectedBlog", { id: temp });
      return temp;
    },
  },
};
</script>