<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content" style="width: auto">
      <!-- Any other Bulma elements you want -->
      <article v-if="resMsg.IsSuccess" class="message is-success">
        <div class="message-header">
          <p>Success</p>
          <button class="delete" aria-label="delete" @click="onCancel"></button>
        </div>
        <div class="message-body">
          <p>Thank You for Choosing Us!!</p>
          <p>Our Team will soon get back to you!!</p>
        </div>
      </article>
      <article v-if="!resMsg.IsSuccess" class="message is-warning">
        <div class="message-header">
          <p>Warning</p>
          <button class="delete" aria-label="delete" @click="onCancel"></button>
        </div>
        <div class="message-body">
          <p>{{ resMsg.DisplayMsg }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookMsg",
  props: {
    resMsg: Object,
  },
  methods: {
    onCancel() {
      this.$emit("on-cancel");
    },
  },
};
</script>

<style scoped></style>
