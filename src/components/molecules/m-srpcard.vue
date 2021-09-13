<template>
  <div class="m_srpcard">
    <div class="card">
      <div class="card-content">
        <div class="columns is-mobile">
          <div class="column">
            <!-- title -->
            <div class="columns">
              <atom-b-title
                class="column is-size-6 has-text-weight-semibold"
                :text="title"
                v-on:click.native="logging"
              />
            </div>
            <!-- location -->
            <div class="columns">
              <atom-text
                class="column is-size-7"
                :text-left="card.location"
                :text="location"
              />
            </div>

            <!-- atom for private parking optional ...need to discuss with team -->

            <!-- price and distance -->
            <div class="columns is-mobile">
              <div class="column">
                <atom-text
                  class="is-size-7"
                  :text-left="card.rate"
                  :text="rate"
                />
              </div>
              <div class="column">
                <atom-text
                  class="is-size-7"
                  :text-left="card.distance"
                  :text="distance"
                  :text-right="card.distanceUnit"
                />
              </div>
            </div>

            <div class="columns is-mobile">
              <div class="column">
                <atom-text
                  class="is-size-7"
                  :text-left="card.type"
                  :text="vehicle"
                />
              </div>
              <div class="column">
                <atom-text
                  class="is-size-7"
                  :text-left="card.slot"
                  :text="slots"
                />
              </div>
            </div>
            <!-- rating  and review-->
            <div class="columns is-mobile">
              <!-- <div class="column is-6"></div> -->
              <atom-text
                class="column is-size-7"
                :text-left="card.starRating"
                :text="rating"
                :text-right="card.trating"
              />
              <!-- <atom-text class="column is-size-7" :text="reviews" /> -->
            </div>
          </div>
          <div class="column is-3 is-align-content-center ps_center">
            <atom-img class="image mb-3" :src="img" />

            <atom-button
              class="button is-small is-rounded is-warning"
              :text="button"
              :disabled="disabled"
              v-on:click.native="onBook()"
            />
          </div>
        </div>
      </div>
    </div>
    <br />
  </div>
</template>
<script>
import AtomButton from "@/components/atoms/atom-button/atom-button.vue";
import AtomImg from "@/components/atoms/atom-img/atom-img.vue";
import atomBTitle from "@/components/atoms/atom-text/atom-b-title.vue";
import AtomText from "@/components/atoms/atom-text/atom-text.vue";
import AtomBoxicon from "../atoms/atom-boxicons/atom-boxicon.vue";
export default {
  components: {
    atomBTitle,
    AtomText,
    AtomImg,
    AtomButton,
    AtomBoxicon,
  },
  name: "m-srpcard",
  props: {
    log: Object,
    title: String,
    rate: String,
    distance: String,
    location: String,
    vehicle: String,
    slots: String,
    img: String,
    // reviews: String,
    rating: String,
    siteId: String,
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      button: "Book",
      // boxicon: {
      //   star: "star",
      //   solid: "solid",
      //   black: "black",
      //   xsmall: "xs",
      // },
      card: {
        starRating: "Rating: ",
        trating: "/5 ★",
        rate: "Rate: ₹",
        distance: "Distance: ",
        distanceUnit: "Km",
        type: "Type: ",
        slot: "Spot Available: ",
        location: "📍 ",
      },
    };
  },
  methods: {
    onBook() {
      // console.log("clicked    ", this.siteId);
      this.$emit("on-book", this.siteId);
    },
    logging() {
      console.log(this.log);
    },
  },
};
</script>

<style scoped>
.columns {
  margin-top: 0;
  margin-bottom: 0;
}
.column {
  padding-top: 2px;
  padding-bottom: 2px;
}
.ps_center {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.card {
  border-bottom: 2px solid rgb(240, 224, 107);
}
.image {
  width: 80px;
  height: 80px;
}
@media (max-width: 767px) {
}
</style>