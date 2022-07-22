<template>
  <div>
    <HeaderBanner>
      <AtomHeadings class="custom-title">Parking Blogs</AtomHeadings>
      <b-breadcrumb align="is-centered" size="is-small">
        <b-breadcrumb-item tag="router-link" to="/"> Home </b-breadcrumb-item>
        <b-breadcrumb-item tag="router-link" to="/blog">
          Blogs
        </b-breadcrumb-item>
        <b-breadcrumb-item tag="router-link" to="/blog" active>
          {{ blog.title }}
        </b-breadcrumb-item>
      </b-breadcrumb>
    </HeaderBanner>

    <Wrapper>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam sit
        reiciendis eius fugit repudiandae, inventore ad laborum magni, rerum
        commodi repellat sapiente porro perferendis velit voluptatibus ea
        expedita! Alias, expedita?
      </p>
    </Wrapper>
  </div>
</template>

<script>
import HeaderBanner from "../extras/HeaderBanner.vue";
import AtomHeadings from "../atoms/AtomHeadings.vue";
import Wrapper from "../extras/Wrapper.vue";
export default {
  name: "TemplateBlogPost",
  components: {
    HeaderBanner,
    AtomHeadings,
    Wrapper,
  },
  props: {
    blog: {
      type: Object,
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped>
.custom-title {
  text-align: center;
  margin-bottom: 1rem;
}
</style>
