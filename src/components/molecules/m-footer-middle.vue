<template>
  <div class="m_footer_middle">
    <div class="columns is-vcentered">
      <div class="column">
        <atom-text class="is-size-6" :text="text1" />
      </div>
      <div class="coulmn">
        <atom-img class="has-text-centered" :src="src" />
      </div>
      <div class="column is-3"></div>
    </div>

    <div class="columns is-vcentered">
      <div class="column is-3">
        <atom-text class="is-size-6 mb-2" :text="text2" />
      </div>
      <div class="column">
        <atom-boxicon
          class="mx-2"
          :types="boxicons.twitter.type"
          :name="boxicons.twitter.icon"
        />
        <atom-boxicon
          class="mx-2"
          :types="boxicons.insta.type"
          :name="boxicons.insta.icon"
        />
        <atom-boxicon
          class="mx-2"
          :types="boxicons.fb.type"
          :name="boxicons.fb.icon"
        />
        <atom-boxicon
          class="mx-2"
          :types="boxicons.linkd.type"
          :name="boxicons.linkd.icon"
        />
      </div>
      <!-- <div class="column"></div> -->
    </div>
  </div>
</template>

<script>
import atomText from "@/components/atoms/atom-text/atom-text.vue";
import AtomImg from "@/components/atoms/atom-img/atom-img.vue";
import AtomBoxicon from "../atoms/atom-boxicons/atom-boxicon.vue";
export default {
  components: { atomText, AtomImg, AtomBoxicon },
  name: "m-footer-middle",
  data() {
    return {
      text1: "Now Available on",
      text2: "Follow us",
      src: require("@/assets/img/google-play-badge.png"),
      boxicons: {
        twitter: {
          type: "logo",
          icon: "twitter",
        },
        insta: {
          type: "logo",
          icon: "instagram",
        },
        fb: {
          type: "logo",
          icon: "facebook",
        },
        linkd: {
          type: "logo",
          icon: "linkedin",
        },
      },
    };
  },
};
</script>