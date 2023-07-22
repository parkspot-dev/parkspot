<template>
    <BodyWrapper>
        <div class="custom-wrapper">
            <AtomHeading class="custom-title">
                Frequently Asked Questions!
            </AtomHeading>

            <b-collapse
                class="card"
                animation="slide"
                v-for="(faq, index) of faqLists"
                :key="index"
                :open="isOpen == index"
                @open="isOpen = index"
                :aria-id="'contentIdForA11y5-' + index"
            >
                <template #trigger="props">
                    <div
                        class="card-header"
                        role="button"
                        :aria-controls="'contentIdForA11y5-' + index"
                        :aria-expanded="props.open"
                        :class="isOpen == index ? 'custom-header' : ''"
                    >
                        <p
                            class="card-header-title"
                            :class="
                                isOpen == index ? 'custom-header-title' : ''
                            "
                        >
                            {{ faq.question }}
                        </p>
                        <a class="card-header-icon">
                            <b-icon
                                :class="props.open ? 'arrow-white' : ''"
                                :icon="props.open ? 'menu-down' : 'menu-up'"
                            >
                            </b-icon>
                        </a>
                    </div>
                </template>
                <div class="card-content">
                    <div class="content" v-html="faq.answer"></div>
                </div>
            </b-collapse>
        </div>
    </BodyWrapper>
</template>

<script>
import AtomHeading from '../atoms/AtomHeading.vue';
import BodyWrapper from '../extras/BodyWrapper.vue';
export default {
    name: 'TemplateFaq',
    components: {
        AtomHeading,
        BodyWrapper,
    },
    data() {
        return {
            isOpen: 0,
            faqLists: [
                {
                    question: 'What is ParkSpot ?',
                    answer: `We at ParkSpot strive to solve the crucial problem of finding or \
                    booking available parking slots in vicinity which is faced by millions of \
                    people on a daily basis. Building solution to use technology for comport, \
                    security, and also generate side income.`,
                },

                {
                    question: `Why do I need to add my vehicle number at the time of booking? Is it \
                        safe `,
                    answer: `We require your vehicle number just to make the post booking process \
                        more convenient. You dont need to wait for a parking operator to \
                        just to register your vehicle numbers manually. The systems will \
                        detect your car when it enter the parking site and from then you'll \
                        get a video stream to monitor your car We dont share your personal \
                        details no matter what. We'll keep that our secret.`,
                },

                {
                    question: `How can your platform help me? How safe is your platform ?`,
                    answer: ` The problem that people in urban areas face is, where do they find a \
                        parking space? We list the safest parking sites and show you the \
                        parking places you can visit. We desire to be the goto place for \
                        parking sites. We've used state of the art technologies to solve all \
                        your problems regarding the parking site question. We have built the \
                        entire platform while pushing security and transparency to the \
                        limit. You can monitor your vehicle at realtime for the peace of \
                        your mind.`,
                },

                {
                    question: `Does ParkSpot support cashless and no contact bookings ?`,
                    answer: `Yes ParkSpot supports cashless modes of payments and you can book a \
                        parking site and park your vehicle at your allocated spot without \
                        having to contact a person in person or any other mode.`,
                },
                {
                    question: `How can I rent my empty parking space?`,
                    answer: `<p>Follow below simple steps:-</p> \
                        <p> \
                            1) Contact us directly via phone (+91 80929 96057). We will take \
                            some details from you and your empty space is get listed on our \
                            platform.\
                        </p>\
                        <p>\
                            2) Email us at\
                            <a href="mailto: connect@parkspot.in">\
                            connect@parkspot.in</a>\
                            with the request. We will contact you and process the request.\
                        </p>`,
                },
                {
                    question: `What would be the minimum duration to book a parking spot?`,
                    answer: `Depending upon the spot, the minimum duration for car and bike \
                        parking space may vary from hourly to monthly basis.`,
                },
                {
                    question: `How to make the payment for booking a parking spot?`,
                    answer: `To make the payment you can download our \
                        <a href=https://play.google.com/store/apps/details?id=com.parkspot.maya_nagri> app ParkSpot </a>\
                         and search nearby parking spots or any location then choose the best parking\
                          spot based on your requirement and make the payment to confirm the booking. \
                        You can opt for any payment method, UPI, card, or net banking. If somehow you \
                        are not able to complete the payment then you can call our\
                         <a "href=https://www.parkspot.in/contact/ "target="_blank">support team, </a>\
                        they will send you a payment link using which you can make the payment.`,
                },
                {
                    question: `How to reach the booked spot location?`,
                    answer: `You can go to the My Booking option and can see your booked parking\
                         space. There will be a navigation button. You can tap on that button, \
                         this will open the Google Maps with the location added on the Map. If \
                         the offline booking has been made, then our support team will send the \
                         parking location`,
                },
            ],
        };
    },
};
</script>

<style scoped>
.custom-wrapper {
    margin: 0 auto;
    max-width: 960px;
    padding: 60px 0px 100px 0px;
}

.custom-title {
    margin-bottom: 4rem;
    text-align: center;
}

.custom-header {
    background: var(--secondary-color);
}

.custom-header-title {
    color: var(--parkspot-white);
}

.arrow-white {
    color: var(--parkspot-white);
}
</style>
