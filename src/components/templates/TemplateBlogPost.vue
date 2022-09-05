<template>
  <div>
    <HeaderBanner>
      <AtomHeading :level="'h2'" class="custom-title">
        Parking Blogs
      </AtomHeading>
      <b-breadcrumb align="is-centered" size="is-medium">
        <b-breadcrumb-item tag="router-link" to="/"> Home </b-breadcrumb-item>
        <b-breadcrumb-item tag="router-link" to="/blog">
          Blogs
        </b-breadcrumb-item>
        <b-breadcrumb-item tag="router-link" to="/blog" active>
          {{ blog.title }}
        </b-breadcrumb-item>
      </b-breadcrumb>
    </HeaderBanner>

    <BodyWrapper>
      <article class="article-wrapper" data-aos="fade-up">
        <header class="mb-6">
          <AtomHeading class="mb-2">
            {{ blog.title }}
          </AtomHeading>
          <div class="custom-author">
            <figure class="author-img image is-48x48">
              <img
                class="is-rounded"
                :src="blog.author_img"
                alt="Placeholder image"
              />
            </figure>
            <!-- <AtomParagraph :variation="'small'"> &nbsp; </AtomParagraph> -->
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
    </BodyWrapper>
  </div>
</template>

<script>
import HeaderBanner from '../extras/HeaderBanner.vue';
import AtomHeading from '../atoms/AtomHeading.vue';
import BodyWrapper from '../extras/BodyWrapper.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
import AtomImage from '../atoms/AtomImage.vue';
export default {
  name: 'TemplateBlogPost',
  components: {
    HeaderBanner,
    AtomHeading,
    AtomParagraph,
    AtomImage,
    BodyWrapper,
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
  margin-bottom: 2rem;
  text-align: center;
}

.article-wrapper {
  margin: auto;
  max-width: 960px;
}

.custom-author {
  column-gap: 2rem;
  display: inline-grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: 1fr 1fr;
}

.author-img {
  grid-row: 1 / 4;
  margin: auto;
}

.author-timestamp {
  color: var(--grey-shade);
  grid-row: 2 / 2;
}

.author-name {
  color: var(--grey-shade);
  grid-column: 2 / 4;
}
</style>
