<template>
  <TemplateBlogPost :blog="blog"></TemplateBlogPost>
</template>

<script>
import { mapGetters } from "vuex";
import TemplateBlogPost from "../components/templates/TemplateBlogPost.vue";
export default {
  name: "PageBlogPost",
  components: {
    TemplateBlogPost,
  },
  computed: {
    ...mapGetters({
      getBlogById: "blog/getBlogById",
    }),
    blog() {
      return this.getBlogById(this.$route.params.id);
    },
  },
  methods: {},
};
</script>

<style></style>
