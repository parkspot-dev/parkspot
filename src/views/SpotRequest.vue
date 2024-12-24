<template>
  <div class="spot-review-root">
    <spotRequestList
      v-if="!requestId"
    />
    <reviewSpot
      v-else
      :requestId="requestId"
    />
  </div>
</template>

<script>
import spotRequestList from '../views/PageSpotRequest.vue';
import reviewSpot from '../views/ReviewSpot.vue';

export default {
  name: 'SpotRequest',
  components: {
    spotRequestList,
    reviewSpot,
  },
  computed: {
    requestId() {
      return this.$route.query.requestId;
    },
  },
};
</script>