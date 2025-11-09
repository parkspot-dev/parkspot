<template>
  <div class="booking-details" v-if="booking">
    <!-- Top Section -->
    <div class="image-card">
      <div class="no-image"></div>
      <div class="image-overlay">
        <h2>{{ booking.siteName }}</h2>
        <p>{{ booking.address }}</p>
      </div>
    </div>
    <!-- 3 Cards -->
    <div class="details-row">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"># Booking Information</h3>
          <span class="status" :class="booking.status.toLowerCase()">{{ booking.status }}</span>
        </div>
        <div class="info-grid">
          <p><strong>Booking ID:</strong> {{ booking.id }}</p>
          <p><strong>Slot:</strong> {{ booking.slot }}</p>
          <p><strong>Vehicle:</strong> {{ booking.vehicle }}</p>
          <p><strong>Start Time:</strong> {{ formatTime(booking.startTime) }}</p>
          <p><strong>End Time:</strong> {{ formatTime(booking.endTime) }}</p>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Payment Details</h3>
        <div class="info-grid">
          <p><strong>Base Rent:</strong> ₹{{ booking.payment.baseRent }}</p>
          <p><strong>Fees:</strong> ₹{{ booking.payment.fees }}</p>
          <p><strong>Discount:</strong> -₹{{ booking.payment.discount }}</p>
        </div>
        <div class="total">
          <p>Total:</p>
          <h3>₹{{ totalAmount }}</h3>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Rent Cycle</h3>
        <div class="info-grid">
          <p><strong>Duration:</strong> {{ booking.duration }}</p>
          <p><strong>Billing Cycle:</strong> {{ booking.billingCycle }}</p>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="empty-state">
    <p>Select a booking to view details.</p>
  </div>
</template>

<script>
export default {
  name: "BookingDetails",
  props: { booking: Object },
  computed: {
    totalAmount() {
      const p = this.booking.payment;
      return (p.baseRent + p.fees - p.discount).toFixed(2);
    },
  },
  methods: {
    formatTime(date) {
      const d = new Date(date);
      return d.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.booking-details {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  height: 85vh;
  overflow-y: auto;
}

/* Image section */
.image-card {
  position: relative;
  height: 200px;
  background: #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
}
.no-image {
  height: 100%;
  background: #e5e7eb;
}
.image-overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 12px;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.6));
  color: white;
}

/* Card Styles */
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  padding: 16px;
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

/* Map */
.map-placeholder {
  height: 220px;
  background: #e0f2fe;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #0369a1;
  font-weight: 500;
}

/* Info Grid */
.details-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
.info-grid p {
  margin: 6px 0;
  font-size: 14px;
  color: #374151;
}

/* Status */
.status {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: white;
}
.status.active {
  background: #22c55e;
}
.status.pending {
  background: #eab308;
}
.status.cancelled {
  background: #ef4444;
}

/* Total */
.total {
  margin-top: 10px;
  font-weight: 600;
  color: #2563eb;
  text-align: right;
}

/* Empty */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  color: #9ca3af;
}

/* ✅ Responsive */
@media (max-width: 768px) {
  .image-card {
    height: 160px;
  }
  .map-placeholder {
    height: 180px;
  }
  .card-title {
    font-size: 15px;
  }
}
</style>
