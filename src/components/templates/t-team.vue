<template>
  <section class="t_team  section mt-2">
    <div class="container">
      <atom-b-title
        class="is-size-3-mobile is-size-2 ps_mb has-text-centered"
        :text="title"
      />
      <carousel
        :perPageCustom="[
          [360, 1],
          [480, 1],
          [1024, 4],
        ]"
        :navigate-to="someLocalProperty"
        :mouse-drag="false"
      >
        <slide class="mx-2" :key="team.id" v-for="team in teams">
          <div class="ps_container">
            <o-team-card-front :title="team.title"  :jobTitle="team.jobTitle" :src="team.src"/>
            <div class="ps_middle">
              <o-team-card-back />
            </div>
          </div>
        </slide>
      </carousel>
    </div>
  </section>
</template>

<script>
import { Carousel, Slide } from "vue-carousel";
import AtomBTitle from "@/components/atoms/atom-text/atom-b-title.vue";
import OTeamCardFront from "../organisms/o-team-card-front.vue";
import OTeamCardBack from "../organisms/o-team-card-back.vue";
export default {
  name: "t-team",
  components: {
    Carousel,
    Slide,
    AtomBTitle,
    OTeamCardFront,
    OTeamCardBack,
  },
  data() {
    return {
      title: "Our Team",
      teams: [
        {
          id: 1,
          src: require("@/assets/img/sud.svg"),
          title: "Sudhanshu Kr. Ambastha",
          jobTitle: "CEO",
        },
        {
          id: 2,
          src: require("@/assets/img/sud.svg"),
          title: "Sudhanshu Kr. Ambastha",
          jobTitle: "CEO",
        },
        {
          id: 3,
          src: require("@/assets/img/sud.svg"),
          title: "Sudhanshu Kr. Ambastha",
          jobTitle: "CEO",
        },
        {
          id: 4,
          src: require("@/assets/img/sud.svg"),
          title: "Sudhanshu Kr. Ambastha",
          jobTitle: "CEO",
        },
      ],
    };
  },
};
</script>

<style scoped>
.ps_container {
  position: relative;
  width: 100%;
}
.ps_middle {
  transition: 0.5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}
.ps_container:hover .ps_middle {
  opacity: 1;
}
.ps_mb{
  margin-bottom: 50px;
}

@media only screen and (min-width: 1024px) {
 .ps_container {
  width: 80%;
}
.ps_mb{
  margin-bottom: 150px;
}
}

</style>