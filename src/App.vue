<template>
  <div id="app">
    <t-navbar class="is-fixed-top floatingNav" />
    <br />
    <!-- <transition name="component-fade" mode="out-in"> -->
    <router-view class="ps_margin" :key="$route.fullPath" />
    <!-- :key="$route.fullPath" temporary fix ...as its only problem with this method is that every path in that router will update in the case of a path change. You may not want all that needless re-rendering, but that’s a decision for you to make.  -->
    <!-- </transition> -->
    <t-footer />
  </div>
</template>


<script>
import TNavbar from "@/components/templates/t-navbar.vue";
import TFooter from "@/components/templates/t-footer.vue";
import MLoadingAnimation from "./components/molecules/m-loading-animation.vue";
export default {
  components: { TNavbar, TFooter, MLoadingAnimation },
  // mounted() {
  //   window.onscroll = function () {
  //     myFunction();
  //   };

  //   var navbar = document.getElementById("nav");
  //   var sticky = navbar.offsetTop + 0.00001;

  //   function myFunction() {
  //     if (window.pageYOffset >= sticky) {
  //       navbar.classList.add("is-fixed-top");
  //     } else {
  //       navbar.classList.remove("is-fixed-top");
  //     }
  //   }
  // },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap");
#app {
  font-family: "Poppins", sans-serif;
}
.ps_margin {
  margin-top: 1.5rem;
}
@media only screen and (min-width: 1024px) {
  .ps_margin {
    margin-top: 3rem;
  }
}

.floatingNav {
  border-radius: 2px;
  box-shadow: 0px 5px 10px #999;
}
/* transition for every router */
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
