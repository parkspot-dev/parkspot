<template lang="pug">
  .banner
    b-carousel(:indicator=false)
      b-carousel-item(v-for="(carousel, i) in carousels" :key="i")
        section(:class="`hero is-fullheight is-${carousel.color}`")
          .hero-body.has-centered-text
            .columns.is-vcentered.is-centered
              .column.is-half(v-if="carousel.istextb")
                p.title.has-text-black(style="white-space: pre;")
                  | {{carousel.title}}
                br
                p.subtitle.has-text-black(style="white-space: pre;")
                  | {{carousel.subtitle}}
              .column.is-half(v-else)
                p.title
                  | {{carousel.title}}
                br
                p.subtitle
                  | {{carousel.subtitle}}
              .column.is-half
                img(:src="`${carousel.path}`")
</template>

<script>
export default {
  name: 'MainBanner',
  data () {
    return {
      carousels: [
        { title: "ParkSpot... the parking app", 
          subtitle: "No more drifting through traffic use \n the ParkSpot app to reserve a parking spot !", 
          path: require("../assets/banners/1b.png"), 
          color: 'warning', 
          istextb: true
        },
        { title: "Worried about security ?", 
          subtitle: "We'll make sure no harm occurs to your property. To ensure this you can monitor your property in real time", 
          path: require("../assets/banners/2b.png"), 
          color: 'black', 
          istextb: false
        },
        { title: "Long term parking required ?", 
          subtitle: "No worries you can choose the timing duration and location", 
          path: require('../assets/banners/3b.png'), 
          color: 'warning', 
          istextb: true
        },
        { title: "Want to rent out your private space for extra pennies?", 
          subtitle: "ParkSpot allows you to list your private areas in our platform. It'll help you reach new customers", 
          path: require('../assets/banners/4b.png'), 
          color: 'black', 
          istextb: false
        },
      ]
    }
  },
};
</script>
<style scoped>
  .banner{
  }
</style>
