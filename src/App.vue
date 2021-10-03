<template>
  <div id="app">
    <t-navbar class="is-fixed-top floatingNav" />
    <br />
    <router-view class="body-template" :key="$route.fullPath" />
    <!-- :key="$route.fullPath" temporary fix ...as its only problem with this method is that every path in that router will update in the case of a path change. You may not want all that needless re-rendering, but that’s a decision for you to make.  -->
    <t-footer />
  </div>
</template>


<script>
import TNavbar from "@/components/templates/t-navbar.vue";
import TFooter from "@/components/templates/t-footer.vue";
import MLoadingAnimation from "./components/molecules/m-loading-animation.vue";
export default {
  components: { TNavbar, TFooter, MLoadingAnimation },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap");
#app {
  font-family: "Poppins", sans-serif;
}
.body-template {
  margin-top: 1.5rem;
}
@media only screen and (min-width: 1024px) {
  .body-template {
    margin-top: 3rem;
  }
}
.floatingNav {
  border-radius: 2px;
  box-shadow: 0px 5px 10px #999;
}
</style>
