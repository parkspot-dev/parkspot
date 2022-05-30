<template>
  <div class="wrappermain">
    <br />
    <br />
    <div class="mainp">
      <div class="content">
        <h1 class="is-size-2 has-text-black">Frequently Asked Questions</h1>
      </div>
      <m-faq-card
        v-for="faq in faqs"
        :key="faq.question"
        :question="faq.question"
        :answer="faq.answer"
      />
      <br />
      <br />
    </div>
  </div>
</template>
<script>
import MFaqCard from "@/components/molecules/m-faq-card.vue";

export default {
  name: "PSFaq",
  components: { MFaqCard },
  data() {
    return {
      faqs: [
        {
          question: "What is ParkSpot ?",
          answer:
            "ParkSpot is a smart parking platform, where you can search and book \
            a parking spot at your desired location or in your vicinity.\
            ParkSpot also supports long term parking and rental parkings.\
            ParkSpot relies on new technology and software that allows you to\
            monitor your vehicle in realtime post parking your vehicle in the\
            parking spot.",
        },

        {
          question:
            "Why do I need to add my vehicle number at the time of booking? Is it \
            safe ",
          answer:
            "We require your vehicle number just to make the post booking process \
            more convenient. You dont need to wait for a parking operator to \
            just to register your vehicle numbers manually. The systems will \
            detect your car when it enter the parking site and from then you'll \
            get a video stream to monitor your car We dont share your personal \
            details no matter what. We'll keep that our secret.",
        },

        {
          question:
            "How can your platform help me? How safe is your platform ?",
          answer:
            " The problem that people in urban areas face is, where do they find a \
            parking space? We list the safest parking sites and show you the \
            parking places you can visit. We desire to be the goto place for \
            parking sites. We've used state of the art technologies to solve all \
            your problems regarding the parking site question. We have built the \
            entire platform while pushing security and transparency to the \
            limit. You can monitor your vehicle at realtime for the peace of \
            your mind.",
        },

        {
          question: "Does ParkSpot support cashless and no contact bookings ?",
          answer:
            "Yes ParkSpot supports cashless modes of payments and you can book a \
            parking site and park your vehicle at your allocated spot without \
            having to contact a person in person or any other mode.",
        },
        {
          question: "How can I rent my empty parking space?",
          answer:
            '<p>Follow below simple steps:-</p> \
          <p> \
            1) Contact us directly via phone (+91 80929 96057). We will take \
            some details from you and your empty space is get listed on our \
            platform.\
          </p>\
          <p>\
            2) Email us at\
            <a href="mailto: connect@parkspot.in" style="color: black">\
              connect@parkspot.in</a>\
            with the request. We will contact you and process the request.\
          </p>',
        },
        {
          question:
            "What would be the minimum duration to book a parking spot?",
          answer:
            "Depending upon the spot, the minimum duration for car and bike parking space may vary from hourly to monthly basis.",
        },
        {
          question: "How to make the payment for booking a parking spot?",
          answer:
            'To make the payment you can download our <a href=https://play.google.com/store/apps/details?id=com.parkspot.maya_nagri> app ParkSpot </a> and search nearby parking spots \
            or any location then choose the best parking spot based on your requirement and make the payment to confirm the booking. \
            You can opt for any payment method, UPI, card, or net banking. If somehow you are not able to complete the payment then you can call our <a "href=https://www.parkspot.in/contact/ "target="_blank">support team, </a>\
            they will send you a payment link using which you can make the payment.',
        },
        {
          question: "How to reach the booked spot location?",
          answer:
            "You can go to the My Booking option and can see your booked parking space. There will be a navigation button. You can tap on that button, this will open the Google Maps with the location added on the Map. If the offline booking has been made, then our support team will send the parking location",
        },
      ],
    };
  },
};
</script>
<style scoped>
.mainp {
  margin: 0 auto;
  width: 80%;
}
.content {
  text-align: center;
}
.wrappermain {
  background-color: #ececec;
}
.message-header {
  background-color: var(--secondary-color);
  color: white;
  border-bottom: 2px solid var(--secondary-color);
}
.message-body {
  background-color: white;
}
.message {
  box-shadow: 0 2px 15px #999;
}
</style>
