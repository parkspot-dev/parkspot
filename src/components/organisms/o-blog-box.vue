<template>
  <div class="o_blog-box mx-6">
    <div class="columns is-centered">
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
      const regex = / /gi;
      let title = blog.postTitle.replace(regex, "-");
      title.indexOf("!") >= 0
        ? (title = title.substring(0, title.length - 1))
        : title;
      this.$router.push({
        name: "mainBlog",
        params: {
          id: `${blog.id}`,
          postTitle: title,
        },
      });
    },
  },
};
</script>
