<template>
  <input
    @input="search"
    @keyup.enter="onEnter"
    v-model="value"
    :type="types"
    :placeholder="placeholder"
  />
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
      value:""
    };
  },
  methods:{
    search(){
      this.$emit('search', this.value)
    },
    onEnter(){
      this.$emit('flytosrp')
    }
  }
};
</script>