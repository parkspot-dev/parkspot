<template>
  <div class="card">
    <div class="card-content">
      <div class="testimony">
        <div class="testimony-left">
          <figure class="image is-48x48">
            <img
              class="is-rounded"
              :src="items.image"
              alt="Placeholder image"
            />
          </figure>
        </div>
        <div class="testimony-right">
          <AtomParagraph class="testimony-name">{{ items.name }}</AtomParagraph>
        </div>
      </div>

      <div class="quote">
        <AtomImage :alt="'quote'" :src="img" :ratio="'1by1'"></AtomImage>
      </div>

      <div class="content">
        {{ items.quote }}
        <br />
        <time datetime="2020-29-7">11:09 PM - 29 Jul 2020</time>
      </div>
    </div>
  </div>
</template>

<script>
import AtomImage from "../atoms/AtomImage.vue";
import AtomParagraph from "../atoms/AtomParagraph.vue";
export default {
  name: "MoleculeTestimonialCard",
  components: {
    AtomImage,
    AtomParagraph,
  },
  props: {
    items: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      img: require("@/assets/quote.png"),
    };
  },
};
</script>

<style scoped>
.quote {
  width: 64px;
}
.testimony {
  display: flex;
  gap: 1rem;
}
.testimony-right {
  align-self: center;
}
.testimony-name {
  font-weight: var(--semi-bold-font);
}
</style>
