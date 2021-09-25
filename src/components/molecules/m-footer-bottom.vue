<template>
  <!-- <div class="m_footer_bottom columns is-mobile">
    <div class="column is-size-7">
      <atom-text :text="text1" />
    </div>
    <div class="column has-text-centered-desktop">
      <atom-router-link :link="link" class="is-size-7" :text="text2" />
    </div>
  </div> -->
  <div class="m_footer_bottom">
    <div class="ps_flex">
      <atom-text class="is-size-7 ps_margin_right" :text="text1" />
      <atom-text class="is-size-7 ps_margin_LR" :text="seperator" />
      <atom-router-link
        :link="link"
        class="is-size-7 ps_margin_left"
        style="color: white"
        :text="text2"
      />
    </div>
  </div>
</template>

<script>
import AtomRouterLink from "@/components/atoms/atom-link/atom-router-link.vue";
import atomText from "@/components/atoms/atom-text/atom-text.vue";
export default {
  components: { atomText, AtomRouterLink },
  name: "m-footer-bottom",
  data() {
    return {
      text1: "© 2021 NeoSpot Pvt Ltd.- ALL RIGHTS RESERVED",
      text2: "Terms and Conditions",
      seperator: "|",
      link: "Terms",
    };
  },
};
</script>

<style scoped>
.ps_margin_LR {
  display: none;
}
@media only screen and (min-width: 1024px) {
  .ps_flex {
    display: flex;
    justify-content: center;
    margin-left: -8%;
  }
  .ps_margin_right {
    margin-right: 10px;
  }
  .ps_margin_left {
    margin-right: 10px;
  }
  .ps_margin_LR {
    display: block;
    margin-right: 10px;
    margin-left: 10px;
  }
}
</style>