<template>
  <div class="block">
    <b-checkbox
      :key="value"
      v-for="value in values"
      v-model="checkboxGroup"
      :native-value="value"
    >
      {{ value }}
    </b-checkbox>
  </div>
</template>

<script>
export default {
  name: "AtomCheckboxs",
  props: {
    /**
     * list of checkbox items
     * @values Array expecting
     */
    values: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      checkboxGroup: [],
    };
  },
};
</script>

<style></style>
