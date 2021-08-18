<template>
  <div class="o_recent">
    <atom-b-subtitle class="is-size-3 mb-2" :text="recent" />
    <hr />
    <m-blog-box-details
      @click.native="getBlog(blog)"
      :key="blog.id"
      v-for="blog in blogDetail"
      :blogDetails="blog"
    />
  </div>
</template>

<script>
import AtomBSubtitle from "../atoms/atom-text/atom-b-subtitle.vue";
import MBlogBoxDetails from "../molecules/m-blog-box-details.vue";
export default {
  components: { AtomBSubtitle, MBlogBoxDetails },
  props: ["blogDetails", "check"],
  name: "o-recent",
  data() {
    return {
      recent: "Recent Posts",
    };
  },
  computed: {
    blogDetail() {
      return this.blogDetails.filter((blog) => {
        if (blog.id != this.check) {
          return blog;
        }
      });
    },
  },
  methods: {
    getBlog(blog) {
      let blogs = JSON.parse(JSON.stringify(this.blogDetails));
      this.$router.push({
        name: "mainBlog",
        params: {
          id: `${blog.id}`,
          data: blogs,
          postImage: blog.postImage,
          postSummary: blog.postSummary,
          postTitle: blog.postTitle,
        },
      });
    },
  },
};
</script>
    