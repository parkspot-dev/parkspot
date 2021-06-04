<template>
  <div class="field">
    <p class="ps_search control has-icons-right">
      <atom-input class="input has-text-weight-semibold" :placeholder="placeholder"/>
      <span class="icon is-small is-right">
       <atom-boxicon :name="name" :color="color" :size="size" :animation="animation"/>
      </span>
    </p>
  </div>
</template>

<script>
import AtomInput from "@/components/atoms/atom-input/atom-input.vue";
import AtomBoxicon from '../atoms/atom-boxicons/atom-boxicon.vue';

export default {
  name: "m-search-box",
  components: {
    AtomInput,
    AtomBoxicon,
  },
  data(){
      return{
          name:"search",
          color:"black",
          size:"sm",
          animation:"tada",
          placeholder:"Search your spot..."
      }
  }
};
</script>
<style scoped>
</style>