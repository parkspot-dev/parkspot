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
                    name: 'Hameemsha H',
                    image: require('@/assets/testimony1.webp'),
                    quote: `I was facing an issue for parking my car in the apartment where I am staying currently. The parking space is very small and hardly a small car can be parked. There comes the parkspot as a solution for my need. Preety from parkspot team helped me in finalizing the rental spot which was quite near to my apartment. She continuously supported and helped regarding the rental spot.
                    Thank you so much parkspot`,
                    rate: 5,
                    date: '1 Nov 2024',
                    datetime: '2024-11-1',
                    link: 'https://g.co/kgs/6yZXFeB',
                },
                {
                    name: 'kiran kumar',
                    image: require('@/assets/testimony2.webp'),
                    quote: `I was very impressed with the customer support and the time in what they arranged me the parking slot. Very much satisfied. I was suggested about this app by one of my friends and I approach them and within a couple of days my problem was solved. Cars are safely parked and i am relaxed.
                    Thank you team PARK SPOT.`,
                    rate: 5,
                    date: '30 Jan 2023',
                    datetime: '2023-1-30',
                    link: 'https://g.co/kgs/pJKtix9',
                },
                {
                    name: 'Abishek Suresh',
                    image: require('@/assets/testimony3.webp'),
                    quote: `Parkspot really helped me when I'm in desperate need for a parking spot in Bangalore. They just confirmed me a spot in 30 mins. I recommend them to anyone who is looking for a parking space.`,
                    rate: 5,
                    date: '7 april 2024',
                    datetime: '2022-4-7',
                    link: 'https://g.co/kgs/4zTimhw',
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
