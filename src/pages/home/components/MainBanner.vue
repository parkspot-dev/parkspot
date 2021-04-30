<template lang="pug">
  .banner
    b-carousel(:indicator=false)
      b-carousel-item(v-for="(carousel, i) in carousels" :key="i")
        section(:class="`hero is-fullheight is-${carousel.color}`")
          .hero-body.has-centered-text
          .eightypercent
            .columns.is-vcentered
              .column.is-half(v-if="carousel.istextb")
                p.title.has-text-black
                  | {{carousel.title}}
                br
                p.subtitle.has-text-black(style="white-space: pre-line")
                  | {{carousel.subtitle}}
              .column.is-half(v-else)
                p.title
                  | {{carousel.title}}
                br
                p.subtitle(style="white-space: pre-line")
                  | {{carousel.subtitle}}
              .column.is-half(v-lazyload)
                img(:data-url="carousel.path")
</template>

<script>
export default {
  name: 'MainBanner',
  data () {
    return {
      carousels: [
        { title: "Park Smart with ParkSpot!", 
          subtitle: 'In case you are fed up of drifting through the traffic to find a parking lot on a hit and trial basis, we are here to help you out.\n\nParkSpot is a completely automated parking spot booking platform for the new generation.\n\We aims to provide you a secured parking reservation in your desired locality, with real time surveillance, anytime anywhere at the cost of the parking bill for the available spots.', 
          path: require("@/assets/banners/1b.png"), 
          color: 'black', 
          istextb: false
        },
        { title: "ParkSpot safeguard the vehicles!", 
          subtitle: 'Everyone wants the vehicle to be safeguarded, and ParkSpot space provide just that.\nWith enhanced security systems in place and equipment like cameras and sensors regularly monitoring the parking spaces,\nthese parking lots are ideal destinations for leaving the vehicles even for more extended periods.',
          path: require("@/assets/banners/2b.png"), 
          color: 'warning', 
          istextb: true
        },
        { title: "Long term parking required ?", 
          subtitle: "No worries you can choose the timing duration and location", 
          path: require('@/assets/banners/3b.png'), 
          color: 'black', 
          istextb: false
        },
        { title: "Want to rent out your private space for extra pennies?", 
          subtitle: "ParkSpot allows you to list your private areas in our platform. It'll help you reach new customers", 
          path: require('@/assets/banners/4b.png'), 
          color: 'warning', 
          istextb: true
        },
      ]
    }
  },
};
</script>
<style scoped>
  .eightypercent{
		  margin: auto;
		  width: 90%;
  }
  pre{
    background-color : transparent;
    white-space: pre-line;
    text-align: justify;
    font-family:'Ubuntu';
  }
</style>
