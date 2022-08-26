<template>
  <div class="card">
    <div class="card-image custom-image">
      <AtomImage :alt="'image'" :src="blog.img" :ratio="'5by4'"></AtomImage>
    </div>
    <div class="card-content">
      <div class="blog-header">
        <AtomParagraph :variation="'large'">{{ blog.title }}</AtomParagraph>
        <AtomParagraph>by {{ blog.author }}</AtomParagraph>
      </div>

      <div class="blog-content">
        <p>{{ blog.desc }}</p>
        <br />
        <br />
        <time :datetime="blog.dateTime">{{ blog.time }}</time>
      </div>
    </div>
  </div>
</template>

<script>
import AtomImage from "../atoms/AtomImage.vue";
import AtomParagraph from "../atoms/AtomParagraph.vue";
export default {
  name: "MoleculeBlogCard",
  props: {
    blog: {
      type: Object,
    },
  },
  components: {
    AtomImage,
    AtomParagraph,
  },
};
</script>

<style scoped>
.custom-image {
  cursor: pointer;
  opacity: 1;
  -webkit-transition: 0.3s ease-in-out;
  transition: 0.3s ease-in-out;
}
.custom-image:hover {
  opacity: 0.5;
}
.blog-header {
  margin-bottom: 2rem;
  cursor: pointer;
}
.blog-header:hover {
  color: var(--secondary-color) !important;
}
.blog-content {
  color: var(--grey-shade);
}
</style>
