<template>
  <div class="t_main_blog section">
    <div class="container">
      <!-- breadcrumb -->
      <nav
        class="breadcrumb has-arrow-separator is-size-7"
        aria-label="breadcrumbs"
      >
        <ul>
          <li><atom-router-link :text="home" :link="hlink" /></li>
          <li><atom-router-link :text="blogs" :link="blink" /></li>
          <li class="is-active has-text-weight-semibold is-size-7">
            <a href="#" aria-current="page">{{
              getBlog[activeBlog - 1].postTitle
            }}</a>
          </li>
        </ul>
      </nav>
      <div class="columns">
        <div class="column is-9">
          <article>
            <BlogOne v-if="getBlog[0].flag" />
            <blog-2 v-if="getBlog[1].flag" />
            <blog-3 v-if="getBlog[2].flag" />
          </article>
          <o-comment style="margin: 0 10% 0 10%" />
        </div>
        <o-recent class="column" :blogDetails="getBlog" />
      </div>
    </div>
  </div>
</template>

<script>
import AtomRouterLink from "../atoms/atom-link/atom-router-link.vue";
import OComment from "../organisms/o-comment.vue";
import ORecent from "../organisms/o-recent.vue";
import BlogOne from "@/pages/blogs/components/Blog1.vue";
import Blog2 from "../../pages/blogs/components/blog2.vue";
import Blog3 from "../../pages/blogs/components/blog3.vue";

export default {
  name: "t-main-blog",
  components: {
    AtomRouterLink,
    ORecent,
    OComment,
    BlogOne,
    Blog2,
    Blog3,
  },
  props: ["activeBlog"],
  data() {
    return {
      home: "Home",
      hlink: "Home",
      blogs: "Blogs",
      blink: "blog",
    };
  },
  computed: {
    getBlog() {
      return this.$store.state.blog.blogs;
    },
  },
};
</script>
