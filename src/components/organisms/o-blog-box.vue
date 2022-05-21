<template>
  <div class="o_blog-box mx-6">
    <div class="columns is-centered">
      <m-blog-box-details
        v-for="blog in noOfBlog"
        :key="blog.id"
        :blog-details="blog"
        class="column is-4"
        @click.native="getBlog(blog)"
      />
    </div>
  </div>
</template>

<script>
import mBlogBoxDetails from "../molecules/m-blog-box-details.vue";
export default {
  name: "OBlogBox",
  components: { mBlogBoxDetails },
  props: {
    noOfBlog: Array,
  },
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
