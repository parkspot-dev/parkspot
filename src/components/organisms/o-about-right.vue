<template>
  <div class="o_about_right">
    <atom-b-title class="ps_title" :text="title" />
    <atom-b-subtitle class="ps_subtitle has-text-justified" :text="para" />
    <br>
  <m-about-right-bottom/>
  </div>
</template>

<script>
import AtomBSubtitle from "@/components/atoms/atom-text/atom-b-subtitle.vue";
import atomBTitle from "@/components/atoms/atom-text/atom-b-title.vue";
import MAboutRightBottom from '../molecules/m-about-right-bottom.vue';
export default {
  components: { atomBTitle, AtomBSubtitle,MAboutRightBottom,  },
  name: "o-about-right",
  data() {
    return {
      title: "About ParkSpot",
      para:
        "We at ParkSpot strive to solve the trivial problem of finding/booking \
        available parking slots in vicinity which is faced by millions of people \
        on a daily basis. we vie for solutions which brings technology and life \
        closer and accessible. ParkSpot is part of this new initiative and \
        incorporates various features aimed at improving the parking experience \
        for residents and visitors. These will include removing the need for entry \
        barriers at car park entrances and exits for a seamless flow of traffic, as \
        vehicle plates will be registered via cameras.",
      
    };
  },
};
</script>

<style scoped>
.ps_title {
  font-size: 36px;
}

.ps_subtitle {
  font-size: 18px;
}
</style>