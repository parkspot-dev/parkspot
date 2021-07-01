<template>
  <div>
    <div class="columns">
      <div class="column ps_right">
        <atom-button class="button is-large" :text="btntext1" />
      </div>

      <div class="column">
        <atom-button
          class="button is-large"
          :text="btntext2"
          :disabled="disabled"
        />
      </div>
    </div>
  </div>
</template>
<script>
import AtomButton from "../atoms/atom-button/atom-button.vue";
export default {
  components: { AtomButton },
  name: "m-portal-buttons",
  data() {
    return {
      btntext1: "Request your parking spot",
      btntext2: "List your space for parking",
      disabled: true,
    };
  },
};
</script>

<style scoped>
.ps_right {
  text-align: end;
}
</style>