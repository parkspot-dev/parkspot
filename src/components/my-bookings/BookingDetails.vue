<template>
  <div class="booking-details" v-if="booking">
    <!-- Map Section -->
    <div class="map-section">
      <MapContainer
        :center="center"
        :spotDetails="booking.SiteDetails"
        :zoom="13"
        class="sdp-map"
      />
      <div class="image-overlay">
        <h2>{{ booking.SiteDetails.SiteName }}</h2>
        <p>{{ booking.SiteDetails.Address }}</p>
      </div>
    </div>

    <!-- Booking Information Cards -->
    <div class="details-row">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Booking Information</h3>
          <span
            class="status"
            :class="statusClass(booking.BookingStatus)"
          >
            {{ this.getParkingRequestLabel(booking.BookingStatus) }}
          </span>
        </div>
        <div class="info-grid">
          <p><strong>Booking ID:</strong> {{ booking.BookingID }}</p>
          <p ><strong>Vehicle:</strong> {{ booking.VehicleNumber || "—" }}</p>
          <p><strong>Start Time:</strong> {{ booking.StartTime }}</p>
          <p><strong>End Time:</strong> {{ booking.EndTime }}</p>
          <p><strong>Rent Cycle:</strong> {{ rentCycleText(booking.RentCycle) }}</p>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Payment Details</h3>
        <div class="info-grid">
          <p><strong>Rent:</strong> ₹{{ booking.Fee.Rent }}</p>
          <p><strong>Convenience Fee:</strong> ₹{{ booking.Fee.ConvenienceFee }}</p>
          <p><strong>Discount:</strong> ₹{{ booking.Fee.Discount }}</p>
          <p><strong>Security Deposit:</strong> ₹{{ booking.Fee.SecurityDeposit }}</p>
        </div>
        <div class="total">
          <p>Total:</p>
          <h3>₹{{ totalAmount }}</h3>
        </div>
      </div>

   <div class="card location-card">
  <h3 class="card-title">Location Details</h3>

<div class="location-box">
  <div class="loc-left">
    <p class="row-item">
      <span class="label">Site Name:</span>
      <span class="value">{{ booking.SiteDetails.SiteName }}</span>
    </p>

    <p class="row-item">
      <span class="label">Navigation:</span>
      <a
        class="navigate-link"
        :href="`https://www.google.com/maps/dir/?api=1&destination=${booking.SiteDetails.Latitude},${booking.SiteDetails.Longitude}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        Google Map
      </a>
    </p>
    <button
  class="spot-btn"
  @click="spotDetails(booking.SiteDetails.SiteID)"
>
  Spot Details
</button>
  </div>
</div>

</div>

    </div>
  </div>

  <div v-else class="empty-state">
    <img
      src="https://www.parkspot.in/assets/about.svg"
      class="default-img"
      alt="default-img"
    />
    <p>Select a booking to view details.</p>
  </div>
</template>

<script>
import MapContainer from "@/components/extras/MapContainer.vue";
import {getBookingStatusLabel} from "@/constant/enums"

export default {
  name: "BookingDetails",
  components: { MapContainer },
  props: { booking: Object },
  computed: {
    center() {
      return this.booking?.SiteDetails
        ? {
            lat: this.booking.SiteDetails.Latitude,
            lng: this.booking.SiteDetails.Longitude,
          }
        : { lat: 12.9716, lng: 77.5946 };
    },
    totalAmount() {
      const f = this.booking?.Fee || {};
      return ((f.Rent || 0) + (f.ConvenienceFee || 0) - (f.Discount || 0)).toFixed(2);
    },
  },
  methods: {
    getParkingRequestLabel(status){
      return getBookingStatusLabel(status)
    },
    statusClass(status) {
      switch (status) {
        case 1:
          return "active";
        case 2:
          return "pending";
        case 3:
          return "completed";
        case 4:
          return "cancelled";
        default:
          return "unknown";
      }
    },
    rentCycleText(cycle) {
      if (cycle === 0) return "Monthly";
      if (cycle === 1) return "Weekly";
      if (cycle === 2) return "Daily";
      return "Custom";
    },
    spotDetails(spotID) {
            const route = this.$router.resolve({
                name: 'spot-detail',
                params: {
                    spotId: spotID,
                },
            });
            window.open(route.href);
        }
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
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.map-section {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sdp-map {
  height: 100%;
  width: 100%;
  border-radius: 12px;
}

.image-overlay {
  position: absolute;
  height: 100px;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 16px;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.6));
  color: #fff;
  border-radius: 0 0 12px 12px;
}

.image-overlay h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.image-overlay p {
  font-size: 13px;
  margin: 4px 0 0;
}

.details-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.status {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
}

.status.active {
  background: #16a34a;
}

.status.pending {
  background: #facc15;
  color: #1f2937;
}

.status.completed {
  background: #3b82f6;
}

.status.cancelled {
  background: #ef4444;
}

.info-grid p {
  margin: 6px 0;
  font-size: 14px;
  color: #374151;
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #2563eb;
  margin-top: 10px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  color: #9ca3af;
  gap: 20px;
  text-align: center;
}

.default-img {
  width: 280px;
  height: auto;
}

@media (max-width: 768px) {
  .map-section {
    height: 400px;
  }
  .image-overlay h2 {
    font-size: 16px;
  }
  .card-title {
    font-size: 15px;
  }
}
.location-box {
  background: #f9fafb;
  border-radius: 10px;
  padding: 14px;
  border: 1px solid #e5e7eb;
}

.row-item {
  margin: 6px 0;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.label {
  font-weight: 600;
  color: #111827;
  min-width: 110px;
}

.value {
  color: #374151;
}

.navigate-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  transition: 0.2s ease;
}

.navigate-link:hover {
  text-decoration: underline;
  color: #1e40af;
}
.spot-btn {
  background: var(--primary-color);
  color:var(--parksport-black);
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}


</style>
