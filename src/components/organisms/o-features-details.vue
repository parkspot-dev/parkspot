<template>
  <div class="o_features_details">
    <atom-img class="ps_img" :src="src" />
    <atom-b-subtitle class="is-size-4 has-text-weight-semibold	" :text="subtitle" />
    <atom-text class="is-size-6" :text="text" />
  </div>
</template>

<script>
import AtomBSubtitle from "@/components/atoms/atom-text/atom-b-subtitle.vue";
import atomText from "@/components/atoms/atom-text/atom-text.vue";
import AtomImg from "../atoms/atom-img/atom-img.vue";
export default {
  components: { atomText, AtomBSubtitle,AtomImg },
  name: "o-features-details.vue",
  data() {
    return {};
  },
  props: {
    subtitle: String,
    text: String,
    src: String,
  },
};
</script>

<style scoped>
@media only screen and (min-width: 1024px) {
  .ps_img {
    max-width: 400px;
    height: 400px;
  }
}
</style>