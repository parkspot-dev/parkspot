<template>
  <b-select placeholder="Select a name">
    <option v-for="option in data" :value="option.id" :key="option.id">
      {{ option.name }}
    </option>
  </b-select>
</template>

<script>
export default {
  name: "AtomSelectInput",
  props: {
    /**
     * The placeholder is for user
     * what type of data is in list
     */
    placeholder: {
      type: String,
      default: "Select anything from list",
    },
    /**
     * The data is list of data
     * @values Object expecting
     * e.g. {id:1, name:'list1'}
     */
    data: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style></style>
