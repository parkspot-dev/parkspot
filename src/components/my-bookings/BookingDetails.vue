<template>
  <div class="booking-details">
    <h3>{{ booking.spot }}</h3>
    <img :src="booking.spotImage" alt="Spot Image" />
    <p><strong>Status:</strong> {{ booking.status }}</p>
    <p><strong>Bill Summary:</strong> {{ booking.billSummary }}</p>
    <p><strong>Booking Date:</strong> {{ formattedDate }}</p>
  </div>
</template>

<script>
export default {
  name: 'BookingDetails',
  props: {
    booking: Object,
  },
  computed: {
    formattedDate() {
      const date = new Date(this.booking.bookingDate)
      return date.toLocaleDateString()
    },
  },
}
</script>

<style scoped>
.booking-details {
  flex-grow: 1;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 0px 10px #ddd;
  max-width: 600px;
}
.booking-details h3 {
  margin-bottom: 15px;
}
.booking-details img {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
}
.booking-details p {
  font-size: 16px;
  margin: 8px 0;
  font-weight: 500;
}
</style>