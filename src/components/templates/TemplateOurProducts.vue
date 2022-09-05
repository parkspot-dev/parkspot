<template>
  <BodyWrapper data-aos="fade-up">
    <AtomParagraph class="custom-subtitle">Types of Products</AtomParagraph>
    <AtomHeading class="custom-title" :level="'h2'">
      Our Parking Products
    </AtomHeading>
    <b-carousel-list v-model="test" :data="items" v-bind="al">
      <template #item="list">
        <MoleculeProductCard
          @arrowBtn="onArrowBtn"
          :items="list"
        ></MoleculeProductCard>
      </template>
    </b-carousel-list>
  </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import MoleculeProductCard from '../molecules/MoleculeProductCard.vue';
import AtomHeading from '../atoms/AtomHeading.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';

export default {
  name: 'TemplateOurProducts',
  components: {
    BodyWrapper,
    MoleculeProductCard,
    AtomHeading,
    AtomParagraph,
  },
  emits: ['arrowBtn'],
  data() {
    return {
      test: 0,
      items: [
        {
          title: 'ParkSpot for Owners',
          image: require('@/assets/Parkspot-owners.jpg'),
          desc: `Want to monetize your idle parking spots?`,
        },
        {
          title: 'ParkSpot for Societies',
          image: require('@/assets/Parkspot-societies.jpg'),
          desc: `Secure your society and enable seamless entry/exit for residents.`,
        },
        {
          title: 'ParkSpot for Corporates',
          image: require('@/assets/Parkspot-corporates.jpg'),
          desc: `Give your employees the gift of easy parking.`,
        },
        {
          title: 'ParkSpot for Malls',
          image: require('@/assets/Parkspot-malls.jpg'),
          desc: `Digitized parkspot for better monetization and seamless
                customer experience.`,
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
    onArrowBtn() {
      this.$emit('arrowBtn');
    },
  },
};
</script>

<style scoped>
.custom-title {
  margin-bottom: 4rem;
  text-align: center;
}

.custom-subtitle {
  color: var(--secondary-color);
  font-weight: var(--semi-bold-font);
  text-align: center;
}
</style>
