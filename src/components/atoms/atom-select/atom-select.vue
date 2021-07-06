<template>
  <div class="ps_width">
    <select v-model="currentValue" class="ps_width">
      <option :key="i" v-for="(value, i) in values" :value="value">
        {{ value }}
      </option>
    </select>
  </div>
</template>
<script>
export default {
  props: {
    value: String, //this is coming from parent v-model
    values: {
      type: Array,
      default() {
        return ["option to be selected"];
      },
    },
  },
  name: "atom_select",
  computed: {
    currentValue: {
      get() {
        return this.value;
      },
      set(currentValue) {
        this.$emit("input", currentValue);
      },
    },
  },
};
</script>

<style scoped>
.ps_width {
  width: 100%;
}
</style>