<template>
  <div class="o_team_card_front">
    <div class="card">
      <div class="card-image">
        <atom-img />
      </div>
      <div class="card-content">
          <atom-b-subtitle />
          <atom-text />
    </div>
  </div>
</template>

<script>
import atomImg from '@/components/atoms/atom-img/atom-img.vue';
import AtomText from '@/components /atoms/atom-text/atom-text.vue';
export default {
  components: { atomImg, AtomText },
  name: "o-team-card-front",
};
</script>