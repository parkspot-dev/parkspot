<template>
  <div class="m_product_back">
    <atom-b-subtitle
      class="is-size-7 mb-2 has-text-weight-bold"
      :text="title"
    />
    <atom-text class="is-size-7 mb-2 mx-2" :text="text" />
    <atom-button
      @click.native="onClick()"
      class="button is-warning is-small is-rounded"
      :text="button"
    />
  </div>
</template>

<script>
import atomBSubtitle from "@/components/atoms/atom-text/atom-b-subtitle.vue";
import AtomText from "@/components/atoms/atom-text/atom-text.vue";
import AtomButton from "@/components/atoms/atom-button/atom-button.vue";
export default {
  components: { atomBSubtitle, AtomText, AtomButton },
  name: "m-product-back",
  data() {
    return {
      button: "Get in touch",
    };
  },
  props: {
    title: String,
    text: String,
  },
  methods: {
    onClick() {
      this.$router.push({ name: "t-contact" });
    },
  },
};
</script>

<style scoped></style>
