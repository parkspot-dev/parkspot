<template>
  <div class="main_blog">
    <t-main-blog :active-blog="activeBlog" />
  </div>
</template>

<script>
import tMainBlog from "../components/templates/t-main-blog.vue";
export default {
  name: "MainBlog",
  components: { tMainBlog },
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
