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
            <a href="#" aria-current="page">{{ currBlog.postTitle }}</a>
          </li>
        </ul>
      </nav>
      <div class="columns">
        <div class="column is-9">
          <article>
            <BlogOne v-if="currBlog.id == 1" />
            <blog-2 v-if="currBlog.id == 2" />
            <!-- <div v-if="currBlog.id == 2">Blog 2</div> -->
          </article>
        </div>
        <o-recent class="column" :blogDetails="nextBlog" :check="currBlog.id" />
      </div>
      <div class="columns">
        <div class="column is-3"></div>
        <o-comment class="column" />
        <div class="column is-3"></div>
      </div>
    </div>
  </div>
</template>

<script>
import AtomRouterLink from "../atoms/atom-link/atom-router-link.vue";
import OComment from "../organisms/o-comment.vue";
import ORecent from "../organisms/o-recent.vue";
import BlogOne from "@/pages/blogs/components/Blog1.vue";
import OBlogBox from "../organisms/o-blog-box.vue";
import Blog2 from "../../pages/blogs/components/blog2.vue";

export default {
  name: "t-main-blog",
  components: { AtomRouterLink, ORecent, OComment, BlogOne, OBlogBox, Blog2 },
  props: ["currBlog", "nextBlog"],
  data() {
    return {
      home: "Home",
      hlink: "Home",
      blogs: "Blogs",
      blink: "blog",
    };
  },
};
</script>