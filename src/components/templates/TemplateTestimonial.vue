<template>
  <Wrapper>
    <AtomParagraph class="custom-subtitle">Testimonials</AtomParagraph>
    <AtomHeadings class="custom-title" :level="'h2'"
      >Our Parking Testimonials</AtomHeadings
    >
    <b-carousel-list v-model="test" :data="items" v-bind="al">
      <template #item="list">
        <MoleculeTestimonialCard :items="list"></MoleculeTestimonialCard>
      </template>
    </b-carousel-list>
  </Wrapper>
</template>

<script>
import Wrapper from "../extras/Wrapper.vue";
import MoleculeTestimonialCard from "../molecules/MoleculeTestimonialCard.vue";
import AtomHeadings from "../atoms/AtomHeadings.vue";
import AtomParagraph from "../atoms/AtomParagraph.vue";

export default {
  name: "TemplateOurProducts",
  components: {
    Wrapper,
    MoleculeTestimonialCard,
    AtomHeadings,
    AtomParagraph,
  },
  data() {
    return {
      test: 0,
      items: [
        {
          name: "Bhumi Mehra",
          image: require("@/assets/img/testimony1.webp"),
          quote: `I am new to Bangalore and It was very difficult for me to find parking.
           A friend suggested me this app and it really helped me finding nearby parking with real
           time feeds like parking availability, rates, etc`,
        },
        {
          name: "Nagarjun Prasad",
          image: require("@/assets/img/testimony2.webp"),
          quote: `A highly essential app for anyone in a metropolitan city, 
          everyone knows the pains of finding a parking spot for your vehicle and 
          this app makes it easy. The app allowed me to easily find any parking 
          spots near me. The prices for the spots considering the duration was also
           very affordable. Would definitely recommend this to anyone who wants a 
           painless experience to park their vehicles or to someone who has free 
           spots to rent out and make some cash.`,
        },
        {
          name: "Roshan Singh",
          image: require("@/assets/img/testimony3.webp"),
          quote: `Amazing app which solves all that hustle-bustle for 
          placement of your vehicle and ensures 100% security when you are not taking care of it`,
        },
      ],
      al: {
        itemsToShow: 1,
        breakpoints: {
          768: {
            itemsToShow: 2,
          },
          960: {
            itemsToShow: 3,
          },
        },
      },
    };
  },
  methods: {
    info(value) {
      this.test = value;
    },
  },
};
</script>

<style scoped>
.custom-title {
  text-align: center;
  margin-bottom: 4rem;
}
.custom-subtitle {
  text-align: center;
  font-weight: var(--semi-bold-font);
  color: var(--secondary-color);
}
</style>
