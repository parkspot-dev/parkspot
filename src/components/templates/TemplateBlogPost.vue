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
      <article class="article-wrapper">
        <header class="mb-6">
          <AtomHeadings :level="'h2'"> {{ blog.title }} </AtomHeadings>
          <div class="custom-author">
            <figure class="author-img image is-48x48">
              <img
                class="is-rounded"
                :src="blog.author_img"
                alt="Placeholder image"
              />
            </figure>
            <AtomParagraph :variation="'small'"> by </AtomParagraph>
            <AtomParagraph class="author-name" :variation="'small'">
              {{ blog.author }}
            </AtomParagraph>
            <AtomParagraph class="author-timestamp" :variation="'small'">
              {{ blog.time }}
            </AtomParagraph>
          </div>
        </header>
        <AtomImage
          :alt="blog.title"
          :src="blog.img"
          :ratio="'16by9'"
          class="mb-4"
        ></AtomImage>
        <section v-html="content"></section>
      </article>
    </Wrapper>
  </div>
</template>

<script>
import HeaderBanner from "../extras/HeaderBanner.vue";
import AtomHeadings from "../atoms/AtomHeadings.vue";
import Wrapper from "../extras/Wrapper.vue";
import AtomParagraph from "../atoms/AtomParagraph.vue";
import AtomImage from "../atoms/AtomImage.vue";
export default {
  name: "TemplateBlogPost",
  components: {
    HeaderBanner,
    AtomHeadings,
    AtomParagraph,
    AtomImage,
    Wrapper,
  },
  props: {
    blog: {
      type: Object,
    },
    content: {
      type: String,
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

.article-wrapper {
  max-width: 960px;
  margin: auto;
}
.custom-author {
  display: inline-grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: 1fr 1fr 1fr;
  column-gap: 1rem;
}
.author-img {
  grid-row: 1 / 4;
  margin: auto;
}
.author-name {
  grid-row: 2 / 2;
  color: var(--grey-shade);
}
.author-timestamp {
  grid-column: 2 / 4;
  color: var(--grey-shade);
}
</style>
