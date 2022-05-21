<template>
  <div class="m_product_back">
    <atom-b-subtitle
      class="is-size-7 mb-2 has-text-weight-bold"
      :text="title"
    />
    <atom-text class="is-size-7 mb-2 mx-2" :text="text" />
    <atom-button
      class="button is-warning is-small is-rounded"
      :text="button"
      @click.native="onClick()"
    />
  </div>
</template>

<script>
import atomBSubtitle from "@/components/atoms/atom-text/atom-b-subtitle.vue";
import AtomText from "@/components/atoms/atom-text/atom-text.vue";
import AtomButton from "@/components/atoms/atom-button/atom-button.vue";
export default {
  name: "MProductBack",
  components: { atomBSubtitle, AtomText, AtomButton },
  props: {
    title: String,
    text: String,
  },
  data() {
    return {
      button: "Get in touch",
    };
  },
  methods: {
    onClick() {
      this.$router.push({ name: "t-contact" });
    },
  },
};
</script>

<style scoped></style>
