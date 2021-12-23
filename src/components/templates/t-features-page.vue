<template>
  <div class="container">
    <m-features-main-heading></m-features-main-heading>
    <div class="columns is-flex-wrap-wrap is-3">
      <div
        :key="data.id"
        class="features-card column"
        v-for="data of featuresData"
      >
        <transition name="expand">
          <m-features-details
            :class="data.textLimit ? 'feature-card__details' : ''"
            :featuresTitle="data.title"
            :featuresText="data.text"
          ></m-features-details>
        </transition>
        <p
          v-if="data.textLimit"
          v-on:click="expand(data.id)"
          class="feature-card__extra"
        >
          show more
        </p>
        <p
          v-if="!data.textLimit"
          v-on:click="expand(data.id)"
          class="feature-card__extra"
        >
          hide
        </p>
        <!-- <div>{{ data.text.length }}</div> -->
      </div>
    </div>
  </div>
</template>

<script>
import MFeaturesDetails from "../molecules/m-features-details.vue";
import MFeaturesMainHeading from "../molecules/m-features-main-heading.vue";
export default {
  components: {
    MFeaturesDetails,
    MFeaturesMainHeading,
  },
  name: "t-features-page",
  data() {
    return {
      featuresData: [
        {
          id: 1,
          title: `Navigation`,
          text: `It is very difficult to go to an unknown place. 
          People usually search on Google Maps to reach a particular\
          location but sometimes it happens that people don’t get\
          the exact address from the map.It is easy to find places\
          like malls, hospitals, and much more popular sites, but \
          when it comes to finding a specific location like a house, \
          it’s really hard.<br> <br> ParkSpot helps in this situation. \
          ParkSpot stores the exact location of the parking location \
          and gives a navigation feature that will direct the ParkSpot \
          user to navigate to the desired parking space.This easy-finding \
          feature helps let users experience a hassle-free parking experience.`,
          textLimit: true,
        },
        {
          id: 2,
          title: `Booking`,
          text: "Who doesn’t want to reserve a spot? It is easy to park \
          vehicles beside the roadside but everyone knows what might be \
          the consequences.The usual consequences will be that the user’s \
          vehicle might get towed away. Just like people going to Movie \
          Theatres after booking a ticket so that they don’t need to worry \
          about the availability of tickets after going to the Theatre, users \
          can also book their car parking space by using our platform and \
          will be assured that there will be a parking space reserved for \
          their vehicles. <br> <br> ParkSpot helps in this situation. Our platform \
          provides short term booking as well as long term rental booking. \
          So if people want to go out of the station for a few days and people \
          who do not have a parking area in their apartment and do not have \
          a parking spot to keep their vehicle, they may not be able to \
          afford airport parking rates and malls do not allow longtime booking. \
          ParkSpot can be of help in this situation. ParkSpot helps users to book \
          the best, cheap and secure parking space for the long term at a very reasonable price.",
          textLimit: true,
        },
        {
          id: 3,
          title: `Searching`,
          text: "People love their cars and hence they would want to keep their \
          vehicles in a safe and secure parking area. They would want a parking \
          area where there will be security guards, CCTV cameras, etc. ParkSpot \
          provides a genuine and authentic parking space for its users so that \
          no mishappening will be done to the user’s property. ParkSpot provides \
          security to private property as well so that users don’t need to worry \
          about the place where they are keeping their vehicles.",
          textLimit: true,
        },
        {
          id: 4,
          title: `Safety & Security`,
          text: "People go to places like shopping malls, hospitals, and many local \
          areas with their cars, without thinking that there may not be available car \
          parking spaces. Maps can help you search popular sites but ParkSpot along \
          with search provides additional information like current availability, \
          rates, distance, etc. ParkSpot also helps users to search apartment parking areas.",
          textLimit: true,
        },
      ],
    };
  },
  methods: {
    expand(id) {
      let updFeaturesData = [];
      for (let data of this.featuresData) {
        if (data.id === id) {
          data = { ...data, textLimit: !data.textLimit };
          updFeaturesData.push(data);
        } else {
          updFeaturesData.push(data);
        }
      }
      this.featuresData = updFeaturesData;
    },
  },
};
</script>

<style scoped>
.features-card {
  margin-bottom: 1rem;
  border: solid 1px #eeeeee;
}
.feature-card__details {
  height: 350px;
  overflow: hidden;
}
.feature-card__extra {
  text-align: center;
  cursor: pointer;
  color: #0085ad;
  background-color: #9e9d9d;
  box-shadow: 0px -8px 13px 2px #9e9d9d;
}
/* TRANSITION */
/* always present */
.expand-transition {
  transition: all 1.5s ease;
}
/* .expand-enter defines the starting state for entering */
/* .expand-leave defines the ending state for leaving */
.expand-enter,
.expand-leave {
  height: 0;
  opacity: 0;
}
</style>