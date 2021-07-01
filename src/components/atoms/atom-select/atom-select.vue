<template>
  <div>
    <select :name="name" :id="id">
      <option :key="i" v-for="(value, i) in values" :value="value">
        {{ value }}
      </option>
    </select>
  </div>
</template>
<script>
export default {
  props: {
    name: String,
    id: String,
    values: {
      type: Array,
      default() {
        return ["option to be selected"];
      },
    },
  },
  name: "atom_select",
};
</script>