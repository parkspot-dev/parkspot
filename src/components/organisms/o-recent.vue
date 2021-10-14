<template>
  <div class="o_recent">
    <atom-b-subtitle class="is-size-3 mb-2" :text="recent" />
    <hr />
    <div :key="blog.id" v-for="blog in blogDetails">
      <m-blog-box-details
        @click.native="getBlog(blog)"
        v-if="!blog.flag"
        :blogDetails="blog"
      />
    </div>
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
    