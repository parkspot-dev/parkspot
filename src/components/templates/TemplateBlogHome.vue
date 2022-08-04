<template>
  <div>
    <HeaderBanner>
      <AtomHeadings class="custom-title">Parking Blogs</AtomHeadings>
      <b-breadcrumb align="is-centered" size="is-medium">
        <b-breadcrumb-item tag="router-link" to="/"> Home </b-breadcrumb-item>
        <b-breadcrumb-item tag="router-link" to="/blog" active>
          Blogs
        </b-breadcrumb-item>
      </b-breadcrumb>
    </HeaderBanner>

    <wrapper>
      <div class="grid-container">
        <MoleculeBlogCard
          :key="blog.id"
          v-for="blog in blogs"
          :blog="blog"
          @click.native="onBlogClick(blog.id)"
        ></MoleculeBlogCard>
      </div>
    </wrapper>
  </div>
</template>

<script>
import Wrapper from "../extras/Wrapper.vue";
import AtomHeadings from "../atoms/AtomHeadings.vue";
import HeaderBanner from "../extras/HeaderBanner.vue";
import MoleculeBlogCard from "../molecules/MoleculeBlogCard.vue";
export default {
  name: "TemplateBlogHome",
  components: {
    Wrapper,
    AtomHeadings,
    HeaderBanner,
    MoleculeBlogCard,
  },
  props: {
    blogs: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  methods: {
    onBlogClick(data) {
      this.$emit("onBlogClick", data);
    },
  },
};
</script>

<style scoped>
.custom-title {
  text-align: center;
  margin-bottom: 1rem;
}
.grid-container {
  display: grid;
  grid-template-columns: auto auto;
  gap: 2rem;
}
</style>
