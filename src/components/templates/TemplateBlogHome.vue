<template>
      <div>
            <HeaderBanner>
                  <AtomHeading class="custom-title">Parking Blogs</AtomHeading>
                  <b-breadcrumb align="is-centered" size="is-medium">
                        <b-breadcrumb-item tag="router-link" to="/">
                              Home
                        </b-breadcrumb-item>
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
                              data-aos="zoom-in-up"
                        ></MoleculeBlogCard>
                  </div>
            </wrapper>
      </div>
</template>

<script>
import Wrapper from "../extras/Wrapper.vue";
import AtomHeading from "../atoms/AtomHeading.vue";
import HeaderBanner from "../extras/HeaderBanner.vue";
import MoleculeBlogCard from "../molecules/MoleculeBlogCard.vue";
export default {
      name: "TemplateBlogHome",
      components: {
            Wrapper,
            AtomHeading,
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
