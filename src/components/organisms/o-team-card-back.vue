<template>
  <div class="o_team_card_back">
    <atom-boxicon :types="boxicons.twitter.type" :name="boxicons.twitter.icon"/>
    <atom-boxicon :types="boxicons.insta.type" :name="boxicons.insta.icon" />
    <atom-boxicon :types="boxicons.linkd.type" :name="boxicons.linkd.icon" />
  </div>
</template>

<script>
import atomBoxicon from "../atoms/atom-boxicons/atom-boxicon.vue";
export default {
  components: { atomBoxicon },
  name: "o-team-card-back",
  data() {
    return {
      boxicons: {
        twitter: {
          type: "logo",
          icon: "twitter",
          color: "black",
        },
        insta: {
          type: "logo",
          icon: "instagram",
          color: "black",
        },
        linkd: {
          type: "logo",
          icon: "linkedin",
          color: "black",
        },
      },
    };
  },
};
</script>

<style scoped>

</style>