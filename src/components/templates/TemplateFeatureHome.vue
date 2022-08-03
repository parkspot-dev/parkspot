<template>
  <Wrapper>
    <div class="featureContainer">
      <MoleculeFeatureCard :featureHeading="'Save Money'">
        Save up to 20% on our site compared to the cost of other parking
        platform.
      </MoleculeFeatureCard>
      <MoleculeFeatureCard :featureHeading="'Save Time'">
        It's easy to compare parking spot. Booking a reservation is quick and
        simple.
      </MoleculeFeatureCard>
      <MoleculeFeatureCard :featureHeading="'Save Stress'">
        Guarantee your parking spot by booking in advance. Can't make it?
        Cancellations are free.
      </MoleculeFeatureCard>
      <MoleculeFeatureCard :featureHeading="'Safety & Security'">
        Don't worry, we got you covered. Choose the safety features like CCTV,
        Securtiy guard etc.
      </MoleculeFeatureCard>
    </div>
  </Wrapper>
</template>

<script>
import Wrapper from "../extras/Wrapper.vue";
import MoleculeFeatureCard from "../molecules/MoleculeFeatureCard.vue";
export default {
  name: "TemplateFeatureHome",
  components: {
    Wrapper,
    MoleculeFeatureCard,
  },
};
</script>

<style scoped>
.featureContainer {
  display: flex;
  gap: 1.5rem;
  padding: 5rem;
}

@media only screen and (max-width: 1200px) {
  .featureContainer {
    padding: 5rem 0;
  }
}
@media only screen and (max-width: 800px) {
  .featureContainer {
    flex-direction: column;
    padding: 5rem 2.5rem;
  }
}
</style>