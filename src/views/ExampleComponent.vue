<template>
    <div>
        <!-- Slider main container -->
        <div ref="swiper" class="swiper">
            <!-- Additional required wrapper -->
            <div class="swiper-wrapper">
                <!-- Slides -->
                <div
                    class="swiper-slide"
                    v-for="item in items"
                    :key="item.name"
                >
                    <div>
                        <MoleculeTestimonialCard :class="'sf'" :items="item">
                        </MoleculeTestimonialCard>
                    </div>
                </div>
            </div>
            <!-- If we need pagination -->
            <div class="swiper-pagination"></div>

            <!-- If we need navigation buttons -->
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>

            <!-- If we need scrollbar -->
            <!-- <div class="swiper-scrollbar"></div> -->
        </div>
    </div>
</template>

<script>
import Swiper, { Navigation, Pagination } from 'swiper';
import MoleculeTestimonialCard from '@/components/molecules/MoleculeTestimonialCard.vue';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

export default {
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
            loop: false,

            // If we need pagination
            pagination: {
                el: '.swiper-pagination',
                dynamicBullets: true,
            },

            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            // And if we need scrollbar
            scrollbar: {
                el: '.swiper-scrollbar',
            },

            slidesPerView: 3,
            spaceBetween: 50,
        });
    },
};
</script>

<style lang="scss" scoped>
.swiper-wrapper {
    height: 600px;
    justify-content: center;
}
.swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 500px;
    width: 450px;
    /* background-color: red; */
}

.swiper-slide-next {
    transform: scale(1.25);
    z-index: 999;
}
</style>
