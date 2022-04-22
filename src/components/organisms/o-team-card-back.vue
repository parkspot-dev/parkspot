<template>
  <div class="o_team_card_back columns is-mobile">
    <a :href="twitter" class="column" target="_blank">
      <atom-boxicon
        :types="boxicons.twitter.type"
        :name="boxicons.twitter.icon"
        :color="boxicons.twitter.color"
      />
    </a>
    <a :href="git" class="column" target="_blank">
      <atom-boxicon
        :types="boxicons.git.type"
        :name="boxicons.git.icon"
        :color="boxicons.git.color"
      />
    </a>
    <a :href="linkd" class="column" target="_blank">
      <atom-boxicon
        :types="boxicons.linkd.type"
        :name="boxicons.linkd.icon"
        :color="boxicons.linkd.color"
      />
    </a>
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
          color: "#ffdd57",
        },
        git: {
          type: "logo",
          icon: "git",
          color: "#ffdd57",
        },
        linkd: {
          type: "logo",
          icon: "linkedin",
          color: "#ffdd57",
        },
      },
    };
  },
  props: {
    linkd: String,
    twitter: String,
    git: String,
  },
};
</script>

<style scoped></style>
