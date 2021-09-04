<template>
  <div class="main_blog">
    <t-main-blog :currBlog="currBlog" :nextBlog="nextBlog" />
  </div>
</template>

<script>
import tMainBlog from "../components/templates/t-main-blog.vue";
export default {
  title() {
    if (this.$route.params.postTitle) {
      return `ParkSpot | Blogs - ${this.$route.params.postTitle} `;
    } else {
      return "Blogs";
    }
  },
  components: { tMainBlog },
  name: "main-blog",
  data() {
    return {};
  },
  computed: {
    currBlog() {
      return this.$route.params;
    },
    nextBlog() {
      let blogs = this.$route.params.data;
      return blogs;
    },
  },
  methods: {
    check() {
      console.log("coming data", this.$route.params.data);
      // this.currBlog = this.$route.params;
    },
  },
  created() {
    this.check();
  },
};
</script>