<template>
    <BodyWrapper data-aos="fade-up">
        <AtomParagraph class="custom-subtitle"> Testimonials </AtomParagraph>
        <AtomHeading class="custom-title" :level="'h2'">
            What Our Customers Say
        </AtomHeading>
        <OrganismTestimonialSwiper></OrganismTestimonialSwiper>
    </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import AtomHeading from '../atoms/AtomHeading.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
import OrganismTestimonialSwiper from '../organisms/OrganismTestimonialSwiper.vue';

export default {
    name: 'TemplateOurProducts',
    components: {
        BodyWrapper,
        AtomHeading,
        AtomParagraph,
        OrganismTestimonialSwiper,
    },
    data() {
        return {
            test: 0,
            items: [
                {
                    name: 'Bhumi Mehra',
                    image: 'assets/testimony1.webp',
                    quote: `I am new to Bangalore and It was very difficult for me to find parking.
                        A friend suggested me this app and it really helped me finding nearby parking with real
                        time feeds like parking availability, rates, etc.`,
                    rate: 4.9,
                    date: '29 Jul 2020',
                    datetime: '2020-7-29',
                },
                {
                    name: 'Nagarjun Prasad',
                    image: 'assets/testimony2.webp',
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
                    image: 'assets/testimony3.webp',
                    quote: `Amazing app which solves all that hustle-bustle for 
                        placement of your vehicle and ensures 100% security when you are not taking care of it.`,
                    rate: 4.5,
                    date: '7 jan 2022',
                    datetime: '2022-1-7',
                },
            ],
        };
    },
};
</script>

<style lang="scss" scoped>
.custom-title {
    margin-bottom: 4rem;
    text-align: center;
}

.custom-subtitle {
    font-weight: var(--semi-bold-font);
    text-align: center;
    color: var(--secondary-color);
}
</style>
