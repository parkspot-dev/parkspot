<template>
  <div class="o_testimonials">
    <div class="columns">
      <div class="column is-4">
        <m-testimonial-user
          :key="i"
          v-for="(temp, i) in user"
          :src="temp.img"
          :name="temp.name"
          :designation="temp.designation"
          v-on:click.native="onClick(i)"
          :color="temp.color"
        />
      </div>
      <div class="column is-1"></div>
      <div class="column is-7">
        <div class="container">
          <m-testimony
            :key="i"
            v-for="(temp, i) in testimonies"
            :show="temp.show"
            :testimony="temp.testimony"
            :star="temp.star"
          />
          <!-- <m-testimony
            v-if="show2"
            :testimony="testimonies[1].testimony"
            :star="testimonies[1].star"
          />
          <m-testimony
            v-if="show3"
            :testimony="testimonies[2].testimony"
            :star="testimonies[2].star"
          /> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MTestimonialUser from "../molecules/m-testimonial-user.vue";
import mTestimony from "../molecules/m-testimony.vue";
export default {
  components: { mTestimony, MTestimonialUser },
  name: "o-testimonials",
  data() {
    return {
      te: "sdfasdf",
      user: [
        {
          name: "Bhumi Mehra",
          designation: "ParkSpot Customer",
          img: require("@/assets/img/testimony1.webp"),
          color: true,
        },
        {
          name: "Nagarjun Prasad",
          designation: "ParkSpot Customer",
          img: require("@/assets/img/testimony2.webp"),
          color: false,
        },
        {
          name: "Roshan Singh",
          designation: "ParkSpot Customer",
          img: require("@/assets/img/testimony3.webp"),
          color: false,
        },
      ],
      testimonies: [
        {
          testimony:
            "I am new to Bangalore and It was very difficult for me to find parking. A friend suggested me this app and it really helped me finding nearby parking with real time feeds like parking availability, rates, etc",
          star: 5,
          show: true,
        },
        {
          testimony:
            "A highly essential app for anyone in a metropolitan city, everyone knows the pains of finding a parking spot for your vehicle and this app makes it easy. The app allowed me to easily find any parking spots near me. The prices for the spots considering the duration was also very affordable. Would definitely recommend this to anyone who wants a painless experience to park their vehicles or to someone who has free spots to rent out and make some cash.",
          star: 5,
          show: false,
        },
        {
          testimony:
            "Amazing app which solves all that hustle-bustle for placement of your vehicle and ensures 100% security when you are not taking care of it.",
          star: 5,
          show: false,
        },
      ],
    };
  },

  methods: {
    onClick(index) {
      for (let i = 0; i < 3; i++) {
        const tempUser = { ...this.user[i] };
        const tempTest = { ...this.testimonies[i] };
        if (i == index) {
          this.$set(this.user, i, {
            ...tempUser,
            color: true,
          });
          this.$set(this.testimonies, i, {
            ...tempTest,
            show: true,
          });
        } else {
          this.$set(this.user, i, {
            ...tempUser,
            color: false,
          });
          this.$set(this.testimonies, i, {
            ...tempTest,
            show: false,
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>