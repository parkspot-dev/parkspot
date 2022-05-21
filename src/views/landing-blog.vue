<template>
  <section>
    <t-blog-landing :no-of-blog="noOfBlog" />
  </section>
</template>

<script>
import TBlogLanding from "../components/templates/t-blog-landing.vue";
export default {
  name: "LandingBlog",
  components: { TBlogLanding },

  computed: {
    noOfBlog() {
      return this.$store.state.blog.blogs;
    },
  },
};
</script>
