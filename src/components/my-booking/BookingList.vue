<template>
  <div class="booking-list">
    <div
      class="booking-card"
      v-for="booking in filteredBookings"
      :key="booking.id"
    >
      <div class="left">
        <h3>Spot: {{ booking.spot }}</h3>
        <p>Payment: {{ booking.payment }}</p>
      </div>

      <div class="status" :class="booking.type">
        {{ booking.type.toUpperCase() }}
      </div>

      <a :href="booking.link" class="view-btn">View</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookingList",
  props: { tab: String },
  data() {
    return {
      bookings: [
        { id: 1, type: "active", spot: "A1", payment: "Paid", link: "#" },
        { id: 2, type: "past", spot: "B3", payment: "Paid", link: "#" },
        { id: 3, type: "requested", spot: "C2", payment: "Pending", link: "#" },
        { id: 4, type: "active", spot: "D4", payment: "Paid", link: "#" },
        { id: 5, type: "past", spot: "E5", payment: "Paid", link: "#" },
      ],
    };
  },
  computed: {
    filteredBookings() {
      return this.bookings.filter((b) => b.type === this.tab);
    },
  },
};
</script>

<style scoped>
.booking-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.booking-card {
  background: white;
  padding: 20px;
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.07);
  transition: 0.3s ease;
}

.booking-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.left h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.left p {
  margin: 4px 0 0;
  color: #555;
  font-size: 14px;
}

.status {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
}

.status.active {
  background: #cce5ff;
  color: #005ecb;
}

.status.past {
  background: #eaeaea;
  color: #444;
}

.status.requested {
  background: #ffe0b3;
  color: #b36b00;
}

.view-btn {
  padding: 8px 18px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: 0.3s ease;
}

.view-btn:hover {
  background: #0068d4;
}
</style>
