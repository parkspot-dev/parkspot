<template>
  <section class="t_team section">
    <div class="container">
      <atom-b-title class="ps_mb has-text-centered" :text="title" />
      <carousel
        :perPageCustom="[
          [360, 1],
          [480, 1],
          [1024, 4],
        ]"
        :mouse-drag="false"
      >
        <!-- :navigate-to="someLocalProperty" -->
        <slide class="mx-2" :key="team.id" v-for="team in teams">
          <div class="ps_container">
            <o-team-card-front
              :title="team.title"
              :jobTitle="team.jobTitle"
              :src="team.src"
            />
            <div class="ps_middle">
              <o-team-card-back
                :git="team.git"
                :linkd="team.linkedin"
                :twitter="team.twitter"
              />
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
          git: "https://www.github.com/arrogant-ant",
          linkedin: "https://www.linkedin.com/in/sudhanshu-ambastha/",
          twitter: "https://twitter.com/sud_ambastha",
        },
        {
          id: 2,
          src: require("@/assets/img/ish.svg"),
          title: "Ishwar Kumar",
          jobTitle: "App Developer",
          git: "https://www.github.com/nextishwar",
          linkedin: "https://www.linkedin.com/in/ishwar-kumar-50403a130/",
          twitter: "https://twitter.com/nextishwar",
        },
        {
          id: 3,
          src: require("@/assets/img/Rashmi.svg"),
          title: "Rashmi Kumari",
          jobTitle: "HR & Business Analyst",
          git: "#",
          linkedin: "https://www.linkedin.com/in/rashmi-kumari-2ab18b13a",
          twitter: "#",
        },
        {
          id: 4,
          src: require("@/assets/img/sujeet.svg"),
          title: "Sujeet Kr. Manjhi",
          jobTitle: "Web Developer",
          git: "https://www.github.com/alias01",
          linkedin: "https://www.linkedin.com/in/sujeet-manjhi-345ba6176/",
          twitter: "https://twitter.com/Sujeet_xd",
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
.ps_mb {
  margin-bottom: 50px;
}

@media only screen and (min-width: 1024px) {
  .ps_container {
    width: 80%;
  }
  .ps_mb {
    margin-bottom: 60px;
  }
}
</style>
