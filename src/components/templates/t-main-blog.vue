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
            <a href="#" aria-current="page">Blogs 1</a>
          </li>
        </ul>
      </nav>
      <div class="columns">
        <div class="column">
          <article></article>
          <o-comment />
        </div>
        <o-recent class="column" />
      </div>
    </div>
  </div>
</template>

<script>
import AtomRouterLink from "../atoms/atom-link/atom-router-link.vue";
import OComment from "../organisms/o-comment.vue";
import ORecent from "../organisms/o-recent.vue";
export default {
  name: "t-main-blog",
  components: { AtomRouterLink, ORecent, OComment },
  data() {
    return {
      home: "Home",
      hlink: "Home",
      blogs: "Blogs",
      blink: "landingBlog",
    };
  },
};
</script>