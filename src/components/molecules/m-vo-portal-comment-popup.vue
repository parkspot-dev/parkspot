<template>
  <div class="modal" :class="isPreview ? 'is-active' : ''">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Comments</p>
        <button class="delete" aria-label="close" v-on:click="onClose"></button>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
        <slot></slot>
        <br />
        <atom-textarea v-model="newComment"></atom-textarea>
      </section>
      <footer class="modal-card-foot">
        <atom-button
          :text="`Update comments`"
          v-on:click.native="updateComments"
        ></atom-button>
        <atom-button
          class="is-danger"
          v-on:click.native="onClose"
          :text="`Cancel`"
        ></atom-button>
      </footer>
    </div>
  </div>
</template>

<script>
import atomButton from "../atoms/atom-button/atom-button.vue";
import AtomTextarea from "../atoms/atom-input/atom-textarea.vue";

export default {
  components: { atomButton, AtomTextarea },
  name: "m-vo-portal-comment-popup",
  props: {
    isPreview: Boolean,
  },
  data() {
    return {
      newComment: "",
    };
  },
  methods: {
    onClose() {
      this.isPreview = !this.isPreview;
      this.$emit("close-preview", this.isPreview);
    },
    updateComments() {
      this.onClose();
      this.$emit("update-comments", this.newComment);
    },
  },
};
</script>