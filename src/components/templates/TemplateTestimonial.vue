<template>
  <Wrapper data-aos="fade-out">
    <AtomParagraph class="custom-subtitle">Testimonials</AtomParagraph>
    <AtomHeadings class="custom-title" :level="'h2'">
      What Our Customers Say
    </AtomHeadings>
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
          image: require("@/assets/testimony1.webp"),
          quote: `I am new to Bangalore and It was very difficult for me to find parking.
           A friend suggested me this app and it really helped me finding nearby parking with real
           time feeds like parking availability, rates, etc.`,
          rate: 4.9,
          date: "29 Jul 2020",
          datetime: "2020-7-29",
        },
        {
          name: "Nagarjun Prasad",
          image: require("@/assets/testimony2.webp"),
          quote: `A highly essential app for anyone in a metropolitan city, 
          everyone knows the pains of finding a parking spot for your vehicle and 
          this app makes it easy. The app allowed me to easily find any parking 
          spots near me. The prices for the spots considering the duration was also
           very affordable. Would definitely recommend this to anyone who wants a 
           painless experience to park their vehicles or to someone who has free 
           spots to rent out and make some cash.`,
          rate: 4.7,
          date: "15 Feb 2021",
          datetime: "2021-2-15",
        },
        {
          name: "Roshan Singh",
          image: require("@/assets/testimony3.webp"),
          quote: `Amazing app which solves all that hustle-bustle for 
          placement of your vehicle and ensures 100% security when you are not taking care of it.`,
          rate: 4.5,
          date: "7 jan 2022",
          datetime: "2022-1-7",
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
