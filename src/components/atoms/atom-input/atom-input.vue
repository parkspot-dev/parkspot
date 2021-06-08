<template>
  <input
    v-on="inputListeners"
    v-model="value"
    :type="types"
    :placeholder="placeholder"
  />

  <!-- // @input="search"
    // @keyup.enter="onEnter" -->
</template>

<script>
export default {
  name: "atom-input",
  props: {
    // value: {
    //   type: String,
    //   default() {
    //     return "";
    //   },
    // },
    types: {
      type: String,
      default() {
        return "text";
      },
    },
    placeholder: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      value: "",
    };
  },
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` merges objects together to form a new object
      return Object.assign({},
        // We add all the listeners from the parent
        this.$listeners,
        // Then we can add custom listeners or override the
        // behavior of some listeners.
        {
          // This ensures that the component works with v-model
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    },
  },
  methods: {
    // search(){
    //   this.$emit('search', this.value)
    // },
    // onEnter(){
    //   this.$emit('flytosrp')
    // }
  },
}
</script>