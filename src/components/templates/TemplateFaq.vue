<template>
    <BodyWrapper>
        <div class="custom-wrapper">
            <AtomHeading class="custom-title">
                Frequently Asked Questions!
            </AtomHeading>

            <b-collapse
                v-for="(faq, index) in faqLists"
                :key="index"
                class="card"
                animation="slide"
                v-model="openStates[index]"
                @open="handleOpen(index)"
                @close="handleClose(index)"
                :aria-id="'contentIdForA11y5-' + index"
            >
                <template #trigger="{ open }">
                    <div
                        class="card-header"
                        role="button"
                        :aria-controls="'contentIdForA11y5-' + index"
                        :aria-expanded="open"
                        :class="{ 'custom-header': openStates[index] }"
                    >
                        <p
                            class="card-header-title"
                            :class="{
                                'custom-header-title': openStates[index],
                            }"
                        >
                            {{ faq.question }}
                        </p>
                        <a class="card-header-icon">
                            <b-icon
                                :class="{ 'arrow-white': open }"
                                :icon="open ? 'menu-up' : 'menu-down'"
                            />
                        </a>
                    </div>
                </template>
                <div class="card-content">
                    <div class="content" v-html="faq.answer"></div>
                </div>
            </b-collapse>

            <AtomParagraph class="mt-5 is-size-5 has-text-weight-semibold">
                In case you have more queries, please feel free to
                <a href="/contact">contact us.</a>
            </AtomParagraph>
        </div>
    </BodyWrapper>
</template>

<script>
import { ref, onMounted } from 'vue';
import AtomHeading from '../atoms/AtomHeading.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
import BodyWrapper from '../extras/BodyWrapper.vue';

export default {
    name: 'TemplateFaq',
    components: {
        AtomHeading,
        AtomParagraph,
        BodyWrapper,
    },
    setup() {
        const faqLists = ref([
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

            {
                question: `What is the response time for all requests?`,
                answer: `Our dedicated sales agents respond within 12 hours to all your queries\
                        about parking solutions in Bangalore and Hyderabad.`,
            },

            {
                question: `Who takes responsibility for car safety?`,
                answer: `Car safety is our top priority. Our parking facilities come with trained\
                        personnel, and we deploy advanced security measures, including guards and cameras, \
                        to ensure a secure environment.`,
            },

            {
                question: `How reliable is the authentication of vehicle owners?`,
                answer: `Rest assured, we prioritize authenticity. Our stringent KYC process for\
                        individuals and thorough verification of car documents during the booking process\ 
                        guarantee the reliability of vehicle owners..`,
            },

            {
                question: `Are spot owners charged to list their spot on the site in Parkspot?`,
                answer: `Absolutely not! Listing your parking spot on Parkspot is free of charge,\
                        providing a hassle-free way to earn money by utilizing vacant spaces`,
            },

            {
                question: `What is the booking process for Parkspot?`,
                answer: `<ul>
                                <li>Find a listing you like on ParkSpot or by contacting us.</li>\
                                <li>Complete your registration on the portal or with the assistance 
                                    of our sales person, we locate nearby spots.</li>\
                                <li>Visit the parking lot and verify the facts.</li>\
                                <li>If you like the parking, process the rent and security deposit.</li>\
                                <li>Start parking your vehicle.</li>\
                                <li>We will mark the parking as unavailable on ParkSpot.</li>
                            </ul>`,
            },

            {
                question: `Tell us about Parkspot's smart parking solution.`,
                answer: `Exciting news! Our smart parking solution, which offers daily bookings, will soon be available in BTM,\
                             Bangalore. Stay tuned for an enhanced parking experience.`,
            },

            {
                question: `Where does Parkspot currently operate?`,
                answer: `Parkspot is currently revolutionizing parking solutions in Bangalore and\
                             Hyderabad, providing paid parking options and an opportunity for individuals\
                             to earn money by using their vacant spaces.`,
            },

            {
                question: `What types of parking do you offer?`,
                answer: `We primarily offer monthly parking solutions, catering to long-term parking needs.\
                             However, in some cases where spot owners allow, we also provide daily parking options.\
                             Hourly parking is not yet available but may be introduced in the future.`,
            },

            {
                question: `Do you require a security deposit for parking bookings?`,
                answer: `Yes, as part of our standard procedure, we collect a one-month rent deposit\
                             for security purposes. This deposit is fully refundable and is utilized in\
                             the final month of parking. It serves as a precautionary measure to ensure\
                             notice periods are adhered to, allowing us time to find another booking if needed.\
                             Additionally, in cases of delayed rent payments, the deposit is utilized to compensate the owner.`,
            },
        ]);
        const openStates = ref(faqLists.value.map(() => false));

        onMounted(() => {
            // Open the first FAQ (index 0) if faqList is not empty
            if (faqLists.value.length > 0) {
                openStates.value[0] = true;
            }
        });

        const handleOpen = (index) => {
            openStates.value = openStates.value.map((_, i) => i === index);
        };

        const handleClose = (index) => {
            openStates.value[index] = false;
        };

        return { faqLists, openStates, handleOpen, handleClose };
    },
};
</script>

<style scoped>
.custom-wrapper {
    margin: 0 auto;
    padding: 60px 0px 100px 0px;
    max-width: 960px;
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
