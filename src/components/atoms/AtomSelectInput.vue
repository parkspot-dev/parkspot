<template>
  <b-field :label="label" :type="errorType" :message="errorMessage">
    <b-select
      :placeholder="placeholder"
      @input.native="onInput($event.target.value)"
      expanded
    >
      <option v-for="option in list" :value="option.id" :key="option.id">
        {{ option.name }}
      </option>
    </b-select>
  </b-field>
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
     * @values Array of Object expecting
     * e.g. [{id:1, name:'list1'},{id:2, name:'list2'}]
     */
    list: {
      type: Array,
      default: null,
    },
    errorMessage: {
      type: Array,
      default: null,
    },
    errorType: {
      type: Object,
      default: null,
    },
    label: {
      type: String,
    },
  },
  emits: ["input"],
  methods: {
    onInput(value) {
      // value - 1 because of one extra list generated for placeholder
      this.$emit("input", this.list[value - 1]);
    },
  },
};
</script>

<style></style>
