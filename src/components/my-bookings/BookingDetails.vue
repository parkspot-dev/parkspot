<template>
    <!-- Booking Details Section -->
    <div class="booking-details" v-if="booking">
        <!-- Map Section -->
        <div class="map-section">
            <MapContainer
                :key="booking?.BookingID"
                :center="center"
                :spotDetails="booking.SiteDetails"
                :zoom="13"
                class="sdp-map"
            />
        </div>

        <div class="details-row">
            <!-- Booking Information Card -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Booking Information:</h3>
                    <h3
                        class="status"
                        :class="{
                            'status-confirmed': booking.BookingStatus === 1,
                            'status-cancelled': booking.BookingStatus === 2,
                        }"
                    >
                        {{ getParkingRequestLabel(booking.BookingStatus) }}
                    </h3>
                </div>

                <!-- Booking Details List -->
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
                                :label="`Your payment date is: ${booking.RentCycle}`"
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

            <!-- Rent Details Card -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Rent Details:</h3>
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

                    <!-- Show Transaction History Button -->
                    <div class="btn-container">
                        <AtomButton
                            class="btn"
                            @click.native="showPopup = true"
                        >
                            Show History
                        </AtomButton>
                    </div>

                    <!-- Transaction Popup -->
                    <div v-if="showPopup" class="popup-overlay">
                        <div class="txn-popup">
                            <div class="popup-header">
                                <h2>Transaction Details:</h2>
                                <span
                                    class="close-btn"
                                    @click="showPopup = false"
                                >
                                    <AtomIcon icon="close" size="16" />
                                </span>
                            </div>

                            <!-- Transaction Table -->
                            <table class="txn-table">
                                <thead>
                                    <tr>
                                        <th>Payment ID</th>
                                        <th>Transaction ID</th>
                                        <th>Transaction Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="p in payments"
                                        :key="p.PaymentID"
                                    >
                                        <td>{{ p.PaymentID }}</td>
                                        <td>{{ p.TransactionID || '—' }}</td>
                                        <td>{{ formatDate(p.CreatedAt) }}</td>
                                        <td>{{ p.Amount }}</td>
                                        <td>
                                            {{
                                                getPaymentStatusUILabel(
                                                    p.Status,
                                                )
                                            }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Location Details Card -->
            <div class="card location-card">
                <div class="card-header">
                    <h3 class="card-title">Location Details:</h3>
                </div>
                <div class="info-list">
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
                    <div class="info-row">
                        <span>Site Address</span>
                        <strong>{{ booking.SiteDetails.Address }}</strong>
                    </div>

                    <!-- Spot Details Button -->
                    <div class="btn-container">
                        <AtomButton
                            class="btn"
                            @click.native="
                                spotDetails(booking.SiteDetails.SiteID)
                            "
                        >
                            Spot Details
                        </AtomButton>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
        <img
            src="https://www.parkspot.in/assets/about.svg"
            class="default-img"
            alt="No bookings"
        />
        <p class="empty-text">
            Oops! Looks like you haven’t booked any parking yet.
        </p>
        <p class="empty-subtext">
            Start exploring spots and reserve your first parking now!
        </p>
    </div>
</template>
<script>
import MapContainer from '@/components/extras/MapContainer.vue';
import { getBookingStatusLabel } from '@/constant/enums';
import AtomTooltip from '@/components/atoms/AtomTooltip.vue';
import AtomIcon from '@/components/atoms/AtomIcon.vue';
import { ICON } from '@/constant/constant';
import { mapActions, mapState } from 'vuex';
import { getPaymentStatusUILabel } from '@/constant/enums';
import AtomButton from '../atoms/AtomButton.vue';
import moment from 'moment';

export default {
    name: 'BookingDetails',
    components: { MapContainer, AtomTooltip, AtomIcon, AtomButton },
    props: { booking: Object, activeTab: String },
    data() {
        return {
            ICON,
            showPopup: false,
        };
    },
    computed: {
        ...mapState('myBookings', [
            'isLoading',
            'hasError',
            'errorMessage',
            'payments',
        ]),
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
        ...mapActions('myBookings', ['fetchPayments']),
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
        getPaymentStatusUILabel(status) {
            return getPaymentStatusUILabel(status);
        },

        // formatDate to formate the date in 'YYYY-MM-DD' ex: "2024-08-12"
        formatDate(date) {
            if (!date) return '';
            return moment(date).format('YYYY-MM-DD');
        },
    },

    watch: {
        booking: {
            handler(value) {
                if (value) this.fetchPayments(value.BookingID);
            },
            immediate: true,
        },
    },
};
</script>
<style scoped lang="scss">
.booking-details {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 85vh;
    overflow-y: auto;
    padding: 16px;
    background: var(--parkspot-white);
    border-radius: 12px;
}

.details-row {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
}

.card {
    display: flex;
    flex-direction: column;
    min-height: 200px;
    padding: 16px;
    background: var(--card-bg, #fff);
    border-radius: var(--border-default, 8px);
    box-shadow: var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.1));
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

.status {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 4px 10px;
    border-radius: 20px;
    color: var(--parkspot-black);
    background: var(--primary-color);
}

.status-confirmed {
    background: var(--parkspot-green);
    color: var(--parkspot-white);
}

.status-cancelled {
    background: #eb2727;
    color: var(--parkspot-white);
}

.info-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 20px;
    flex: 1;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
}

.info-row span {
    flex-shrink: 0;
    white-space: nowrap;
}

.info-row strong {
    display: block;
    max-width: 100%;
    text-align: right;
    white-space: normal;
    word-wrap: break-word;
}

.map-section {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
}

.sdp-map {
    width: 100%;
    height: 100%;
    border-radius: 12px;
}

.navigate-link {
    font-weight: 600;
    color: var(--secondary-color);
    text-decoration: none;
}

.navigate-link:hover {
    text-decoration: underline;
}

.info-icon {
    cursor: pointer;
    transition: transform 0.2s ease;
    color: var(--parkspot-black);
}

.info-icon:hover {
    transform: scale(1.1);
}

.btn-container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: auto;
}

.btn {
    font-weight: 700;
    border-radius: var(--border-default);
    margin: 4px;
    width: fit-content;
}

.default-img {
    width: 280px;
    height: auto;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh;
    gap: 20px;
    text-align: center;
    color: #9ca3af;
}

.txn-popup {
    width: 90%;
    max-width: 850px;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
    background: var(--parkspot-white);
    box-sizing: border-box;
    overflow-x: auto;
}

.popup-overlay {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    position: fixed;
    inset: 0;
    z-index: 2000;
    background: rgba(0, 0, 0, 0.45);
    padding-top: 60px;
    overflow-y: auto;
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
}

.popup-header h2 {
    font-size: 20px;
    font-weight: 600;
    color: var(--parkspot-black);
}

.close-btn {
    background: none;
    border: none;
    font-size: 26px;
    cursor: pointer;
    color: var(--parkspot-black);
}

.txn-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
}

.txn-table th,
.txn-table td {
    padding: 8px 6px;
    border-bottom: 1px solid #ddd;
    font-weight: 400;
    white-space: nowrap;
}

.txn-table th {
    font-weight: 600;
}

.rent-cycle-label {
    display: flex;
    align-items: center;
    gap: 6px;
}

.total {
    font-weight: 600;
    color: var(--parkspot-green);
}

@media (max-width: 768px) {
    .details-row {
        grid-template-columns: 1fr;
        justify-items: center;
    }

    .details-row .card {
        width: 100%;
        max-width: 400px;
    }

    .txn-popup {
        width: 95%;
        padding: 12px;
    }

    .popup-header h2 {
        font-size: 18px;
    }

    .txn-table th,
    .txn-table td {
        padding: 6px 4px;
        font-size: 12px;
    }

    .btn-container {
        flex-direction: column;
        gap: 8px;
    }
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    height: 80vh;
    text-align: center;
    color: var(--parkspot-black);
}

.empty-text {
    font-size: 16px;
    font-weight: 600;
    color: var(--parkspot-black);
}

.empty-subtext {
    font-size: 14px;
    color: var(--parkspot-gray, #6b7280);
}
</style>
