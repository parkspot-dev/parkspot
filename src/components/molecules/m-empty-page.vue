<template>
  <div class="m_empty_page">
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content" style="width: auto">
        <!-- Any other Bulma elements you want -->
        <article class="message is-warning">
          <div class="message-header">
            <p>Notice</p>
            <button
              v-on:click="onCancel"
              class="delete"
              aria-label="delete"
            ></button>
          </div>
          <div class="message-body">
            <p>{{ error }}</p>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "m-empty-page",
  props: {
    error: String,
  },
  methods: {
    onCancel() {
      this.$router.push("/");
    },
  },
};
</script>