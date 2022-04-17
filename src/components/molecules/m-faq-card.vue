<template>
  <article class="message">
    <div class="message-header">
      <atom-text
        class="is-size-5 is-size-6-mobile has-text-weight-semibold mb-2"
        :text="question"
      />
    </div>
    <div class="message-body" v-html="answer"></div>
  </article>
</template>

<script>
import AtomText from "@/components/atoms/atom-text/atom-text.vue";

export default {
  name: "m-faq-card",
  components: { AtomText },
  props: { question: String, answer: String },
};
</script>

<style scoped>
.message-header {
  background-color: #0085ad;
  color: white;
  border-bottom: 2px solid #0085ad;
}
.message-body {
  background-color: white;
}
.message {
  box-shadow: 0 2px 15px #999;
}
</style>
