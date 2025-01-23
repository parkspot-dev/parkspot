<template>
  <div class="testimonial-swiper-container">
    <swiper
      ref="swiper"
      :slides-per-view="1"
      :space-between="50"
      direction="horizontal"
      :navigation="swiperNavigation"
      :pagination="swiperPagination"
      :loop="true"
      autoHeight
      centered-slides
      :breakpoints="breakpoints"
      class="testimonial-swiper"
    >
      <swiper-slide v-for="(item, index) in items" :key="index">
        <MoleculeTestimonialCard :items="item" />
      </swiper-slide>
    </swiper>
    <div class="swiper-nav-wrapper">
      <div class="swiper-button-prev"></div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-next"></div>
    </div>
  </div>
</template>

<script>
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import MoleculeTestimonialCard from '@/components/molecules/MoleculeTestimonialCard.vue';
import 'swiper/swiper-bundle.min.css';

SwiperCore.use([Navigation, Pagination]);

export default {
  name: 'TestimonialSwiper',
  components: {
    Swiper,
    SwiperSlide,
    MoleculeTestimonialCard,
  },
  data() {
    return {
      items: [
        {
            name: 'Hameemsha H',
            image: 'src/assets/testimony1.png',
            quote: `I was facing an issue for parking my car in the apartment where I am staying currently. The parking space is very small and hardly a small car can be parked. There comes the parkspot as a solution for my need. Preety from parkspot team helped me in finalizing the rental spot which was quite near to my apartment. She continuously supported and helped regarding the rental spot.
                    Thank you so much parkspot`,
            rate: 5,
            link: 'https://g.co/kgs/6yZXFeB',
        },
        {
            name: 'kiran kumar',
            image: 'src/assets/testimony2.png',
            quote: `I was very impressed with the customer support and the time in what they arranged me the parking slot. Very much satisfied. I was suggested about this app by one of my friends and I approach them and within a couple of days my problem was solved. Cars are safely parked and i am relaxed.
                    Thank you team PARK SPOT.`,
            rate: 5,
            link: 'https://g.co/kgs/pJKtix9',
        },
        {
            name: 'Abishek Suresh',
            image: 'src/assets/testimony3.png',
            quote: `Parkspot really helped me when I'm in desperate need for a parking spot in Bangalore. They just confirmed me a spot in 30 mins. I recommend them to anyone who is looking for a parking space.`,
            rate: 5,
            link: 'https://g.co/kgs/4zTimhw',
        },
      ],
      swiperNavigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      swiperPagination: {
        clickable: true,
        el: '.swiper-pagination',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.testimonial-swiper-container {
    position: relative;

    .swiper {
        padding: 2.5em 1.5em;
        height: 700px;

        .swiper-slide {
            margin: 0;
            height: auto;
            width: 100%;
            padding: 0;
            opacity: 0.2;
            background-color: rgba(255, 255, 255, 0.33);
            border-radius: 6px;
            transition: all 0.5s ease-in-out;

            &.swiper-slide-active {
                background-color: rgba(255, 255, 255, 1);
                opacity: 1;
                transform: scale(1.1);
            }
        }

        .swiper-nav-wrapper {
            position: absolute;
            bottom: -30px; 
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            justify-content: center;
            align-items: center;

            .swiper-button-next,
            .swiper-button-prev {
                width: 20px;
                height: 20px;
                background-size: contain; 
                background-repeat: no-repeat;

                &:after {
                    display: none; 
                }
            }
        }
    }

    .swiper-pagination {
        position: relative !important;
        display: flex; 
        justify-content: center; 

        .swiper-pagination-bullet {
            background-color: var(--parkspot-white) !important;
            transition: all 0.2s ease-in-out;

            &.swiper-pagination-bullet-active {
                background-color: var(--secondary-color);
                transform: scale(1.5); 
            }
        }
    }
}
</style>
