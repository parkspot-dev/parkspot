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
                    name: 'Bhumi Mehra',
                    image: require('@/assets/testimony1.webp'),
                    quote: `I am new to Bangalore and It was very difficult for me to find parking.
                        A friend suggested me this app and it really helped me finding nearby parking with real
                        time feeds like parking availability, rates, etc.`,
                    rate: 4.9,
                    date: '29 Jul 2020',
                    datetime: '2020-7-29',
                },
                {
                    name: 'Nagarjun Prasad',
                    image: require('@/assets/testimony2.webp'),
                    quote: `A highly essential app for anyone in a metropolitan city, 
                        everyone knows the pains of finding a parking spot for your vehicle and 
                        this app makes it easy. The app allowed me to easily find any parking 
                        spots near me. The prices for the spots considering the duration was also
                        very affordable. Would definitely recommend this to anyone who wants a 
                        painless experience to park their vehicles or to someone who has free 
                        spots to rent out and make some cash.`,
                    rate: 4.7,
                    date: '15 Feb 2021',
                    datetime: '2021-2-15',
                },
                {
                    name: 'Roshan Singh',
                    image: require('@/assets/testimony3.webp'),
                    quote: `Amazing app which solves all that hustle-bustle for 
                        placement of your vehicle and ensures 100% security when you are not taking care of it.`,
                    rate: 4.5,
                    date: '7 jan 2022',
                    datetime: '2022-1-7',
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
$black: #000;
$white: #fff;
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
            top: 0;
            top: auto;
            left: auto;
            right: auto;
            position: relative !important;
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
    margin: 0;
    padding: 0;
    width: auto;
    position: relative !important;
    display: block;
    width: auto;
    .swiper-pagination-bullets {
        margin: 0;

        .swiper-pagination-bullet {
            margin: 0;
            background: #fff !important;
        }
    }
}
.swiper-pagination-bullet {
    background: #fff !important;
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
