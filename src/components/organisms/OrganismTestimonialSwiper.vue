<template>
    <div>
        <div ref="swiper" class="swiper">
            <!-- Additional required wrapper -->
            <div class="swiper-wrapper">
                <!-- Slides -->
                <div class="swiper-slide" v-for="(item, i) in items" :key="i">
                    <MoleculeTestimonialCard
                        :items="item"
                    ></MoleculeTestimonialCard>
                </div>
            </div>

            <!-- If we need pagination -->
            <!-- If we need navigation buttons -->
            <div class="swiper-nav-wrapper">
                <div class="swiper-button-prev"></div>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-next"></div>
            </div>
        </div>
    </div>
</template>

<script>
import Swiper, { Navigation, Pagination } from 'swiper';
import MoleculeTestimonialCard from '@/components/molecules/MoleculeTestimonialCard.vue';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

export default {
    name: 'TestimonialSwiper',
    components: {
        MoleculeTestimonialCard,
    },
    data() {
        return {
            items: [
                {
                    name: 'Hameemsha H',
                    image: require('@/assets/testimony1.png'),
                    quote: `I was facing an issue for parking my car in the apartment where I am staying currently. The parking space is very small and hardly a small car can be parked. There comes the parkspot as a solution for my need. Preety from parkspot team helped me in finalizing the rental spot which was quite near to my apartment. She continuously supported and helped regarding the rental spot.
                    Thank you so much parkspot`,
                    rate: 5,
                    link: 'https://g.co/kgs/6yZXFeB',
                },
                {
                    name: 'kiran kumar',
                    image: require('@/assets/testimony2.png'),
                    quote: `I was very impressed with the customer support and the time in what they arranged me the parking slot. Very much satisfied. I was suggested about this app by one of my friends and I approach them and within a couple of days my problem was solved. Cars are safely parked and i am relaxed.
                    Thank you team PARK SPOT.`,
                    rate: 5,
                    link: 'https://g.co/kgs/pJKtix9',
                },
                {
                    name: 'Abishek Suresh',
                    image: require('@/assets/testimony3.png'),
                    quote: `Parkspot really helped me when I'm in desperate need for a parking spot in Bangalore. They just confirmed me a spot in 30 mins. I recommend them to anyone who is looking for a parking space.`,
                    rate: 5,
                    link: 'https://g.co/kgs/4zTimhw',
                },
            ],
        };
    },

    mounted() {
        new Swiper(this.$refs.swiper, {
            // configure Swiper to use modules
            modules: [Navigation, Pagination],
            // Optional parameters
            direction: 'horizontal',
            loop: true,
            autoHeight: false,
            centeredSlides: true,
            slidesPerView: 1,
            // Responsive breakpoints
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

            // If we need pagination
            pagination: {
                el: '.swiper-pagination',
            },

            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    },
};
</script>

<style lang="scss" scoped>
$g-line-height: 1.5 !default;
$g-spacing: $g-line-height * 1em;
$black: var(--parkspot-black);
$white: var(--parkspot-white);
$g-background-color-dark: #18181b;

.swiper {
    padding: 2.5em 1.5em;
    height: 700px;

    .swiper-slide {
        margin: 0;
        height: auto;
        width: 100%;
        padding: 0;
        opacity: 0.2;
        background: rgba(255, 255, 255, 0.33);
        border-radius: 6px;
        transition: all 0.5s ease-in-out;

        &.swiper-slide-active {
            background: rgba(255, 255, 255, 1);
            opacity: 1;
            transform: scale(1.1);
        }
    }

    .swiper-nav-wrapper {
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        width: auto;

        .swiper-button-next,
        .swiper-button-prev {
            position: relative !important;
            top: auto;
            right: auto;
            left: auto;

            &:after {
                display: none;
            }
        }

        .swiper-button-next,
        .swiper-container-rtl .swiper-button-prev {
            background-image: url("data:image/svg+xml,%0A%3Csvg width='9px' height='16px' viewBox='0 0 9 16' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='chevron-right' fill='%23000000' fill-rule='nonzero'%3E%3Cpath d='M8.674805,7.066406 L1.924805,0.316406 C1.696288,0.105468 1.432619,0 1.133789,0 C0.834959,0 0.57129,0.105468 0.342773,0.316406 C0.114257,0.544923 0,0.808592 0,1.107422 C0,1.406251 0.114257,1.669921 0.342773,1.898438 L6.301758,7.857422 L0.342773,13.816406 C0.114257,14.044923 0,14.308592 0,14.607422 C0,14.906251 0.114257,15.169921 0.342773,15.398438 C0.465821,15.521485 0.584472,15.609375 0.69873,15.662109 C0.812989,15.714844 0.958007,15.741211 1.133789,15.741211 C1.309571,15.741211 1.454589,15.714844 1.568848,15.662109 C1.683106,15.609375 1.801757,15.521485 1.924805,15.398438 L8.674805,8.648438 C8.903321,8.419921 9.017578,8.156251 9.017578,7.857422 C9.017578,7.558592 8.903321,7.294923 8.674805,7.066406 Z' id='Path'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E") !important;
            width: 20px;
            height: 20px;
            background-size: 20px 20px;
            background-repeat: no-repeat;
            margin: 0;
            padding: 0;
        }

        .swiper-button-prev,
        .swiper-container-rtl .swiper-button-next {
            background-image: url("data:image/svg+xml,%0A%3Csvg width='9px' height='16px' viewBox='0 0 9 16' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='chevron-right' transform='translate(4.508789, 7.870605) rotate(-180.000000) translate(-4.508789, -7.870605) translate(-0.000000, -0.000000)' fill='%23000000' fill-rule='nonzero'%3E%3Cpath d='M8.674805,7.066406 L1.924805,0.316406 C1.696288,0.105468 1.432619,0 1.133789,0 C0.834959,0 0.57129,0.105468 0.342773,0.316406 C0.114257,0.544923 0,0.808592 0,1.107422 C0,1.406251 0.114257,1.669921 0.342773,1.898438 L6.301758,7.857422 L0.342773,13.816406 C0.114257,14.044923 0,14.308592 0,14.607422 C0,14.906251 0.114257,15.169921 0.342773,15.398438 C0.465821,15.521485 0.584472,15.609375 0.69873,15.662109 C0.812989,15.714844 0.958007,15.741211 1.133789,15.741211 C1.309571,15.741211 1.454589,15.714844 1.568848,15.662109 C1.683106,15.609375 1.801757,15.521485 1.924805,15.398438 L8.674805,8.648438 C8.903321,8.419921 9.017578,8.156251 9.017578,7.857422 C9.017578,7.558592 8.903321,7.294923 8.674805,7.066406 Z' id='Path'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E") !important;
            width: 20px;
            height: 20px;
            background-size: 20px 20px;
            background-repeat: no-repeat;
            margin: 0;
            padding: 0;
        }
    }
}

.swiper-pagination {
    position: relative !important;
    display: block;
    margin: 0;
    padding: 0;
    width: auto;

    .swiper-pagination-bullets {
        margin: 0;

        .swiper-pagination-bullet {
            margin: 0;
            background: var(--parkspot-white) !important;
        }
    }
}
.swiper-pagination-bullet {
    background: var(--parkspot-white) !important;
    transition: all 0.2s ease-in-out;
}

.swiper-pagination-bullets.swiper-pagination-horizontal {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    bottom: 0;
    top: 0;
    bottom: 0;
    width: auto;
    padding: 0 $g-spacing;
}
.swiper-pagination-bullet-active {
    transform: scale(1.5);
}
</style>

<style lang="scss">
.swiper-pagination-bullet-active {
    background: var(--secondary-color);
}
</style>
