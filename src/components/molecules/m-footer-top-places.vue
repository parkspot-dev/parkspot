<template>
  <div class="m_footer_top_places">
    <atom-text class="ps_top is-size-6" :text="title" />
    <div class="columns ps_places">
      <div class="column">
        <div class="columns is-flex-direction-column">
          <div class="column ps-padding">
            <router-link
              class="is-size-7"
              style="color: white"
              :to="{ path: '/bangalore/parking-near-jp-nagar' }"
              >Parking Spot in JP-Nagar</router-link
            >
          </div>
          <div class="column ps-padding">
            <router-link
              class="is-size-7"
              style="color: white"
              :to="{ path: '/bangalore/parking-near-btm' }"
              >Parking Spot in BTM</router-link
            >
          </div>
        </div>
      </div>
      <div class="column">
        <div class="columns is-flex-direction-column">
          <div class="column ps-padding">
            <router-link
              class="is-size-7"
              style="color: white"
              :to="{ path: '/bangalore/parking-near-bommanahalli' }"
              >Parking Spot in Bommanahalli</router-link
            >
          </div>
          <div class="column ps-padding">
            <router-link
              class="is-size-7"
              style="color: white"
              :to="{ path: '/bangalore/parking-near-rajajinagar' }"
              >Parking Spot in Rajajinagar</router-link
            >
          </div>
        </div>
      </div>
      <div class="column">
        <div class="columns is-flex-direction-column">
          <div class="column ps-padding">
            <router-link
              class="is-size-7"
              style="color: white"
              :to="{ path: '/bangalore/parking-near-banashankari' }"
            >
              Parking Spot in Banashankari</router-link
            >
          </div>
          <div class="column ps-padding">
            <router-link
              class="is-size-7"
              style="color: white"
              :to="{ path: '/bangalore/parking-near-marathahalli' }"
            >
              Parking Spot in marathahalli</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import atomText from "../atoms/atom-text/atom-text.vue";
export default {
  name: "MFooterTopPlaces",
  components: { atomText },
  data() {
    return {
      title: "Top Searched Places",
    };
  },
};
</script>

<style scoped>
.ps_top {
  border-bottom: 1px solid #8e8e8e;
  padding-bottom: 15px;
}
.ps_places {
  padding: 30px 0px 30px 0px;
}
.ps-padding {
  padding-top: 0;
  padding-bottom: 0;
}
@media only screen and (min-width: 1024px) {
  .ps_places {
    padding: 30px 0px 30px 50px;
  }
}
</style>
