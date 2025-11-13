<template>
    <div class="booking-details" v-if="booking">
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

        <div class="details-row">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Booking Information:</h3>
  <h3
  class="status"
  :class="{
    'status-confirmed': booking.BookingStatus === 1,
    'status-cancelled': booking.BookingStatus === 2
  }"
>
  {{ getParkingRequestLabel(booking.BookingStatus) }}
</h3>

                </div>

                <div class="info-list">
                    <div class="info-row">
                        <span>Booking ID</span>
                        <strong>{{ booking.BookingID }}</strong>
                    </div>
                    <div class="info-row">
                        <span>Vehicle</span>
                        <strong>{{
                            (booking.VehicleNumber || '—').toUpperCase()
                        }}</strong>
                    </div>
                    <div class="info-row">
                        <span>Start Time</span>
                        <strong>{{ booking.StartTime }}</strong>
                    </div>
                    <div class="info-row">
                        <span>End Time</span>
                        <strong>{{ booking.EndTime }}</strong>
                    </div>
                    <div class="info-row rent-cycle">
                        <div class="rent-cycle-label">
                            <span>Rent Cycle:</span>
                            <AtomTooltip
                                :label="`Your Payment Date is: ${booking.RentCycle}`"
                            >
                                <AtomIcon
                                    :icon="ICON.INFO"
                                    :size="'is-small'"
                                    class="info-icon"
                                />
                            </AtomTooltip>
                        </div>
                        <strong>{{ booking.RentCycle }}</strong>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Rent Details</h3>
                </div>
                <div class="info-list">
                    <div class="info-row">
                        <span>Rent</span>
                        <strong>₹{{ booking.Fee.Rent }}</strong>
                    </div>
                    <div class="info-row">
                        <span>Convenience Fee</span>
                        <strong>₹{{ booking.Fee.ConvenienceFee }}</strong>
                    </div>
                    <div class="info-row">
                        <span>Security Deposit</span>
                        <strong>₹{{ booking.Fee.SecurityDeposit }}</strong>
                    </div>
                    <div class="info-row total">
                        <span>Total</span>
                        <strong>₹{{ totalAmount }}</strong>
                    </div>
                </div>
            </div>

            <div class="card location-card">
                <div class="card-header">
                    <h3 class="card-title">Location Details:</h3>
                </div>
               <div class="info-row">
    <span>Site Name</span>
    <strong>{{ booking.SiteDetails.SiteName }}</strong>
</div>

<div class="info-row">
    <span>Navigation</span>
    <a
        class="navigate-link"
        :href="`https://www.google.com/maps/dir/?api=1&destination=${booking.SiteDetails.Latitude},${booking.SiteDetails.Longitude}`"
        target="_blank"
        rel="noopener noreferrer"
    >
        Google Map
    </a>
</div>

                <button
                    class="spot-btn"
                    @click="spotDetails(booking.SiteDetails.SiteID)"
                >
                    Spot Details
                </button>
            </div>
        </div>
    </div>

    <div v-else class="empty-state">
        <img
            src="https://www.parkspot.in/assets/about.svg"
            class="default-img"
            alt="default-img"
        />
    </div>
</template>

<script>
import MapContainer from '@/components/extras/MapContainer.vue';
import { getBookingStatusLabel } from '@/constant/enums';
import AtomTooltip from "@/components/atoms/AtomTooltip.vue";
import AtomIcon from "@/components/atoms/AtomIcon.vue";
import { ICON } from '@/constant/constant'

export default {
    name: 'BookingDetails',
    components: { MapContainer ,AtomTooltip,
    AtomIcon },
    props: { booking: Object },
    data() {
        return { 
        showPopover: false,
        ICON,
         };
    },
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
            return (
                (f.Rent || 0) +
                (f.ConvenienceFee || 0) +
                (f.SecurityDeposit || 0)
            ).toFixed(2);
        },
    },
    methods: {
        getParkingRequestLabel(status) {
            return getBookingStatusLabel(status);
        },
        spotDetails(spotID) {
            const route = this.$router.resolve({
                name: 'spot-detail',
                params: { spotId: spotID },
            });
            window.open(route.href);
        },
    },
};
</script>

<style scoped lang="scss">
.booking-details {
    background: var(--parkspot-white);
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
}

.sdp-map {
    height: 100%;
    width: 100%;
    border-radius: 12px;
}

.image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 8px 16px;
    background: linear-gradient(180deg, transparent,var(--grey-shade));
    color:var(--parkspot-black);
    
}

.details-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
    gap: 20px;
}

.card {
    background: var(--parkspot-white);
    border: 1px solid #e8faff;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--parkspot-black);
}

.info-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding: 4px 0;
}

.total {
    color: var(--parkspot-green);
    font-weight: 600;
}

.navigate-link {
    color: var(--secondary-color);
    font-weight: 600;
    text-decoration: none;
}

.navigate-link:hover {
    text-decoration: underline;
}

.spot-btn {
    background: var(--primary-color);
    color: var(--parkspot-black);
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
}

.spot-btn:hover {
    background: #ffd35c;
}

.popover {
    position: absolute;
    top: 25px;
    left: 0;
    background: #fff;
    color: #111827;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    white-space: nowrap;
    z-index: 10;
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
.status {
    display: inline-block;
    background: var(--primary-color); /* yellow from your root variables */
    color: var(--parkspot-black);
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px; /* rounded pill look */
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 4px;
}
.rent-cycle-label {
  display: flex;
  align-items: center;
  gap: 6px; /* space between text and icon */
}

.info-icon {
  color: var(--parkspot-black); /* same yellow or theme color as rest of icons */
  cursor: pointer;
  transition: transform 0.2s ease;
}

.info-icon:hover {
  transform: scale(1.1);
}
.status-confirmed {
  background: var(--parkspot-green) !important;
  color: var(--parkspot-white);
}
.status-cancelled{
    background: #eb2727 !important;
  color: var(--parkspot-white);
}
.info-row strong {
    display: block;      /* Block level so it wraps properly */
    word-wrap: break-word; /* Break long words/lines */
    max-width: 100%;     /* Don't overflow card */
}
</style>