<template>
  <div class="m_srpcard card">
    <div class="card-content">
      <div class="columns is-mobile">
        <div class="column">
          <div class="columns">
            <atom-b-title
              class="column is-size-6 has-text-weight-semibold"
              :text="title"
            />
          </div>

          <!-- rating created using boxicons-->
          <div class="columns">
            <div class="column">
              <atom-boxicon
                :key="i"
                v-for="i in 5"
                :types="boxicon.solid"
                :name="boxicon.star"
                :color="boxicon.black"
                :size="boxicon.xsmall"
              />
            </div>

            <atom-text class="column is-size-7" :text="reviews" />
          </div>
          <!-- atom for private parking optional ...need to discuss with team -->
          <div class="columns is-mobile">
            <div class="column">
              <atom-text class="is-size-7" :text="rate" />
            </div>
            <div class="column">
              <atom-text class="is-size-7" :text="distance" />
            </div>
          </div>
          <div class="columns">
            <atom-text class="column is-size-7" :text="location" />
          </div>

          <div class="columns is-mobile">
            <div class="column">
              <atom-text class="is-size-7" :text="vehicle" />
            </div>
            <div class="column">
              <atom-text class="is-size-7" :text="slots" />
            </div>
          </div>
        </div>
        <div class="column is-3">
          <atom-img class="image" :src="img" />

          <atom-button
            class="button is-small is-rounded is-warning"
            :text="button"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AtomButton from "@/components/atoms/atom-button/atom-button.vue";
import AtomImg from "@/components/atoms/atom-img/atom-img.vue";
import atomBTitle from "@/components/atoms/atom-text/atom-b-title.vue";
import AtomText from "@/components/atoms/atom-text/atom-text.vue";
import AtomBoxicon from "../atoms/atom-boxicons/atom-boxicon.vue";
export default {
  components: { atomBTitle, AtomText, AtomImg, AtomButton, AtomBoxicon },
  name: "m-srpcard",
  props: {
    title: String,
    rate: String,
    distance: String,
    location: String,
    vehicle: String,
    slots: String,
    img: String,
    reviews: String,
  },
  data() {
    return {
      button: "Book",
      boxicon: {
        star: "star",
        solid: "solid",
        black: "black",
        xsmall: "xs",
      },
    };
  },
};
</script>

<style scoped>
.columns {
  margin-top: 0;
  margin-bottom: 0;
}
.button {
  margin: auto;
}
.image {
  width: 100px;
  height: 100px;
}
</style>