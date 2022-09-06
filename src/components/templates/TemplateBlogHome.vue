<template>
  <div>
    <HeaderBanner>
      <AtomHeading class="custom-title">Parking Blogs</AtomHeading>
      <b-breadcrumb align="is-centered" size="is-medium">
        <b-breadcrumb-item tag="router-link" to="/"> Home </b-breadcrumb-item>
        <b-breadcrumb-item tag="router-link" to="/blog" active>
          Blogs
        </b-breadcrumb-item>
      </b-breadcrumb>
    </HeaderBanner>

    <BodyWrapper>
      <div class="grid-container">
        <MoleculeBlogCard
          :key="blog.id"
          v-for="blog in blogs"
          :blog="blog"
          @click.native="onBlogClick(blog.id)"
          data-aos="zoom-in-up"
        ></MoleculeBlogCard>
      </div>
    </BodyWrapper>
  </div>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import AtomHeading from '../atoms/AtomHeading.vue';
import HeaderBanner from '../extras/HeaderBanner.vue';
import MoleculeBlogCard from '../molecules/MoleculeBlogCard.vue';
export default {
  name: 'TemplateBlogHome',
  components: {
    BodyWrapper,
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
      this.$emit('onBlogClick', data);
    },
  },
};
</script>

<style scoped>
.custom-title {
  margin-bottom: 1rem;
  text-align: center;
}

.grid-container {
  display: grid;
  gap: 2rem;
  grid-template-columns: auto auto;
}
</style>
