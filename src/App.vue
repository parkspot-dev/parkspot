<template>
  <div id="app">
    <t-navbar />
    <router-view :key="$route.fullPath" />
    <!-- :key="$route.fullPath" temporary fix ...as its only problem with this method is that every path in that router will update in the case of a path change. You may not want all that needless re-rendering, but that’s a decision for you to make.  -->
    <t-footer />
  </div>
some changes


<script>
import TNavbar from "@/components/templates/t-navbar.vue";
import TFooter from "@/components/templates/t-footer.vue";
export default {
  components: { TNavbar, TFooter },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap");
#app {
  font-family: "Poppins", sans-serif;
}
</style>
