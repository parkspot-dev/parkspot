<template>
  <div class="o_team_card_front">
    <div class="card ps_container">
      <div class="card-image">
        <atom-img class="image" :src="src" />
      </div>
      <div class="card-content">
        <atom-b-subtitle class="is-size-6 has-text-centered" :text="title" />
        <atom-text class="is-size-7 has-text-centered" :text="jobTitle" />
      </div>
    </div>
  </div>
</template>

<script>
import atomImg from "@/components/atoms/atom-img/atom-img.vue";
import AtomText from "@/components/atoms/atom-text/atom-text.vue";
import AtomBSubtitle from "@/components/atoms/atom-text/atom-b-subtitle.vue";
export default {
  name: "OTeamCardFront",
  components: { atomImg, AtomText, AtomBSubtitle },
  props: {
    src: String,
    title: String,
    jobTitle: String,
  },
};
</script>

<style scoped>
.ps_container:hover .image {
  opacity: 0.3;
}
</style>
