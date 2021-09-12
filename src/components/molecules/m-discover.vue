<template>
  <div class="m_discover">
    <atom-text
      class="is-size-4 is-size-5-mobile has-text-weight-semibold mb-2"
      :text-left="discover_text"
      :text="searched_text"
    />
    <atom-text
      class="is-size-6 is-size-7-mobile mb-2 ps_line"
      :text="discover_para"
    />
    <atom-text
      class="is-size-6 is-size-7-mobile ps_line"
      :text="discover_para2"
    />
  </div>
</template>

<script>
import AtomText from "../atoms/atom-text/atom-text.vue";
export default {
  components: { AtomText },
  props: {
    searched_text: String,
  },
  name: "m-discover",
  data() {
    return {
      discover_text: "Find and book parking spaces near LOCATION",
      discover_para: `
      Searching parking space near LOCATION ? Book the cheap and best space for yourself near LOCATION with ParkSpot.
      With us, you can leave the uncertainty of not finding parking space for your Car or Bike. 
      We do short term as well as long term parking as per your need with the minimum cost. 
      Choose the new way of parking near LOCATION , choose the smart way of parking, CHOOSE ParkSpot .
      Think about the stress avoided, fuel & time saved.
      
      `,
      discover_para2: `
    Want to earn extra money? Rent your vacant space at our platform and start earning extra.
      
      `,
    };
  },
};
</script>

<style scoped>
.m_discover {
  margin: 0% 5% 0% 5%;
}
.ps_line {
  line-height: 26px;
  letter-spacing: 0.5px;
  color: #787879;
}
</style>