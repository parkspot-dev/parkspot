<template>
  <div class="select select_rounded">
    <select v-model="currentValue" class="select_rounded select_padding">
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
.select_rounded {
  width: 100%;
  border-radius: 15px;
  font-weight: 600;
  letter-spacing: 0.01em;
  font-size: 14px;
  height: 3.5em;
}
.select_padding {
  padding-bottom: calc(1em - 1px);
  padding-left: calc(1.15em - 1px);
  padding-right: calc(0.75em - 1px);
  padding-top: calc(1em - 1px);
}
.select:not(.is-multiple):not(.is-loading)::after {
  margin-top: -0.425em;
}
</style>
