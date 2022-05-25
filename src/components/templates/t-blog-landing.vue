<template>
  <div class="t_blog_landing section">
    <div class="container">
      <!-- breadcrumb -->
      <nav
        class="breadcrumb has-arrow-separator is-size-7"
        aria-label="breadcrumbs"
      >
        <ul>
          <li><atom-router-link :text="home" :link="hlink" /></li>
          <li class="is-active has-text-weight-semibold is-size-7">
            <a href="#" aria-current="page">Blogs</a>
          </li>
        </ul>
      </nav>
      <atom-b-title class="has-text-centered mb-5" :text="title" />
      <o-blog-box :no-of-blog="noOfBlog" />
    </div>
  </div>
</template>

<script>
import AtomRouterLink from "../atoms/atom-link/atom-router-link.vue";
import AtomBTitle from "../atoms/atom-text/atom-b-title.vue";
import oBlogBox from "../organisms/o-blog-box.vue";

export default {
  name: "TBlogLanding",
  components: { oBlogBox, AtomBTitle, AtomRouterLink },
  props: {
    noOfBlog: Array,
  },
  data() {
    return {
      home: "Home",
      hlink: "Home",
      title: "Blogs",
    };
  },
};
</script>

<style scoped>
.t_blog_landing {
  background-color: #ececec;
}
</style>
