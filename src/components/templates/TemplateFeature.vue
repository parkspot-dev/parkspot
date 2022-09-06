<template>
  <BodyWrapper>
    <MoleculeFeatureHeader></MoleculeFeatureHeader>
    <div class="feature-container">
      <MoleculeFeatureBody
        v-for="feature of featuresData"
        :key="feature.id"
        :features-title="feature.title"
      >
        <p class="mb-2">
          {{ feature.para }}
        </p>
        <p>
          {{ feature.para2 }}
        </p>
      </MoleculeFeatureBody>
    </div>
  </BodyWrapper>
</template>

<script>
import MoleculeFeatureBody from '../molecules/MoleculeFeatureBody.vue';
import MoleculeFeatureHeader from '../molecules/MoleculeFeatureHeader.vue';
import BodyWrapper from '../extras/BodyWrapper.vue';
export default {
  name: 'TemplateFeature',
  components: {
    MoleculeFeatureBody,
    MoleculeFeatureHeader,
    BodyWrapper,
  },
  data() {
    return {
      featuresData: [
        {
          id: 1,
          title: `Navigation`,
          para: `It is very difficult to go to an unknown place. 
                        People usually search on Google Maps to reach a particular\
                        location but sometimes it happens that people don’t get\
                        the exact address from the map.It is easy to find places\
                        like malls, hospitals, and much more popular sites, but \
                        when it comes to finding a specific location like a house, \
                        it’s really hard.`,
          para2: ` ParkSpot helps in this situation. \
                        ParkSpot stores the exact location of the parking location \
                        and gives a navigation feature that will direct the ParkSpot \
                        user to navigate to the desired parking space.This easy-finding \
                        feature helps let users experience a hassle-free parking experience.`,
        },
        {
          id: 2,
          title: `Booking`,
          para: `Who doesn’t want to reserve a spot? It is easy to park \
                        vehicles beside the roadside but everyone knows what might be \
                        the consequences.The usual consequences will be that the user’s \
                        vehicle might get towed away. Just like people going to Movie \
                        Theatres after booking a ticket so that they don’t need to worry \
                        about the availability of tickets after going to the Theatre, users \
                        can also book their car parking space by using our platform and \
                         will be assured that there will be a parking space reserved for \
                        their vehicles. `,
          para2: `ParkSpot helps in this situation. Our platform \
                        provides short term booking as well as long term rental booking. \
                        So if people want to go out of the station for a few days and people \
                        who do not have a parking area in their apartment and do not have \
                        a parking spot to keep their vehicle, they may not be able to \
                        afford airport parking rates and malls do not allow longtime booking. \
                        ParkSpot can be of help in this situation. ParkSpot helps users to book \
                        the best, cheap and secure parking space for the long term at a very reasonable price.`,
        },
        {
          id: 3,
          title: `Searching`,
          para: `People love their cars and hence they would want to keep their \
                        vehicles in a safe and secure parking area. They would want a parking \
                        area where there will be security guards, CCTV cameras, etc. ParkSpot \
                        provides a genuine and authentic parking space for its users so that \
                        no mishappening will be done to the user’s property. ParkSpot provides \
                        security to private property as well so that users don’t need to worry \
                        about the place where they are keeping their vehicles.`,
        },
        {
          id: 4,
          title: `Safety & Security`,
          para: `People go to places like shopping malls, hospitals, and many local \
                        areas with their cars, without thinking that there may not be available car \
                        parking spaces. Maps can help you search popular sites but ParkSpot along \
                        with search provides additional information like current availability, \
                        rates, distance, etc. ParkSpot also helps users to search apartment parking areas.`,
        },
      ],
    };
  },
};
</script>

<style scoped>
.feature-container {
  column-gap: 3rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 1rem;
}

@media only screen and (max-width: 800px) {
  .feature-container {
    grid-template-columns: 1fr;
  }
}
</style>
