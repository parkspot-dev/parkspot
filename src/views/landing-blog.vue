<template>
  <section>
    <t-blog-landing :noOfBlog="noOfBlog" />
  </section>
</template>

<script>
import TBlogLanding from "../components/templates/t-blog-landing.vue";
export default {
  components: { TBlogLanding },
  name: "landing-blog",

  computed: {
    noOfBlog() {
      return this.$store.state.blog.blogs;
    },
  },
};
</script>
