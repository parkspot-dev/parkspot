<template>
  <div class="o_blog-box mx-6">
    <div class="columns">
      <m-blog-box-details
        v-on:click.native="getBlog(blog)"
        :key="blog.id"
        v-for="blog in noOfBlog"
        :blogDetails="blog"
        class="column is-4"
      />
    </div>
  </div>
</template>

<script>
import mBlogBoxDetails from "../molecules/m-blog-box-details.vue";
export default {
  components: { mBlogBoxDetails },
  props: {
    noOfBlog: Array,
  },
  name: "o-blog-box",
  methods: {
    getBlog(blog) {
      this.$router.push({
        name: "mainBlog",
        params: {
          id: `${blog.id}`,
          data: this.noOfBlog,
          postImage: blog.postImage,
          postSummary: blog.postSummary,
          postTitle: blog.postTitle,
        },
      });
    },
  },
};
</script>