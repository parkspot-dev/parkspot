<template>
  <Wrapper>
    <b-carousel-list v-model="test" :data="items" :items-to-show="2">
      <template #item="list">
        <div class="card">
          <div class="card-image">
            <AtomImage
              :alt="'image'"
              :src="list.image"
              :ratio="'5by4'"
            ></AtomImage>
            <b-tag type="is-danger" rounded style="position: absolute; top: 0">
              <b>50% OFF</b>
            </b-tag>
          </div>

          <div class="card-content custom-content-wrapper">
            <div class="content">
              <div class="content-text">
                <p class="content-text-title">{{ list.title }}</p>
                <p class="content-text-desc">
                  {{ list.desc }}
                </p>
              </div>
              <div class="content-btn">
                <AtomIcon :icon="'arrow-right'" :size="'is-medium'"></AtomIcon>
              </div>
            </div>
          </div>
        </div>
      </template>
    </b-carousel-list>
  </Wrapper>
</template>

<script>
import Wrapper from "../extras/Wrapper.vue";
import AtomImage from "../atoms/AtomImage.vue";
import AtomIcon from "../atoms/AtomIcon.vue";
export default {
  name: "TemplateOurProducts",
  components: {
    Wrapper,
    AtomImage,
    AtomIcon,
  },
  data() {
    return {
      test: 0,
      items: [
        {
          title: "ParkSpot for Malls/ Hotels",
          image: require("@/assets/Parkspot-malls.jpg"),
          desc: `Digitized park spot for better monetization and seamless
                customer experience`,
        },
        {
          title: "ParkSpot for Corporates",
          image: require("@/assets/Parkspot-corporates.jpg"),
          desc: `Give your employees the gift of easy parking`,
        },
        {
          title: "ParkSpot for Societies",
          image: require("@/assets/Parkspot-societies.jpg"),
          desc: `Secure your society and enable seamless entry/exit for residents.`,
        },
        {
          title: "ParkSpot for Parking Owners",
          image: require("@/assets/Parkspot-owners.jpg"),
          desc: `Want to monetize your idle parking spots?`,
        },
      ],
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
.custom-content-wrapper {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  background: white;
  width: 300px;
}
.content-text {
  margin-bottom: 0.25rem;
}
.content-btn {
  text-align: end;
}

.content-text-title {
  font-weight: var(--bold-font);
}
.content-text-desc {
  font-size: 0.75rem;
}
</style>
