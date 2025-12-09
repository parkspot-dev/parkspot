<template>
    <!-- Booking Details Section -->
    <div class="booking-details" v-if="booking">
        <!-- Map Section -->
        <div class="map-section">
            <MapContainer
                :key="booking?.BookingID"
                :center="center"
                :spotDetails="siteDetails"
                :zoom="13"
                class="sdp-map"
            />
        </div>

        <div class="details-row">
            <!-- Booking Information Card -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Booking Information:</h3>
                    <AtomTooltip
                        :label="
                            getBookingStatusDescription(booking.BookingStatus)
                        "
                    >
                        <span
                            class="status"
                            :class="{
                                'status-confirmed':
                                    booking.BookingStatus ===
                                    BookingStatus.BookingConfirmed,
                                'status-cancelled':
                                    booking.BookingStatus ===
                                    BookingStatus.BookingCancelled,
                            }"
                        >
                            {{ getBookingStatusLabel(booking.BookingStatus) }}
                        </span>
                    </AtomTooltip>
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

                    <div v-if="activeTab !== 'Past'" class="btn-container">
                        <AtomButton
                            class="cancel-btn"
                            @click.native="cancelBooking(booking)"
                        >
                            Cancel
                        </AtomButton>
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

                    <div class="btn-container">
                        <AtomButton
                            class="btn"
                            @click.native="showPopup = true"
                        >
                            Show History
                        </AtomButton>
                    </div>

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

                            <table class="txn-table">
                                <thead>
                                    <tr>
                                        <th class="txn-center">Payment ID</th>
                                        <th class="txn-center">
                                            Transaction ID
                                        </th>
                                        <th class="txn-center">
                                            Transaction Date
                                        </th>
                                        <th class="txn-center">Amount</th>
                                        <th class="txn-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="p in payments"
                                        :key="p.PaymentID"
                                    >
                                        <td class="txn-center">
                                            {{ p.PaymentID }}
                                        </td>
                                        <td class="txn-center">
                                            {{ p.TransactionID || '—' }}
                                        </td>
                                        <td class="txn-center">
                                            {{ formatDate(p.CreatedAt) }}
                                        </td>
                                        <td class="txn-center">
                                            {{ p.Amount }}
                                        </td>
                                        <td class="txn-center">
                                            {{
                                                getBookingPaymentStatusLabell(
                                                    p.Status,
                                                )
                                            }}
                                        </td>
                                    </tr>
                                    <tr
                                        v-if="
                                            !payments || payments.length === 0
                                        "
                                    >
                                        <td colspan="5" class="no-data">
                                            Transaction not found
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

                    <div class="btn-container">
                        <AtomButton
                            class="btn"
                            @click.native="
                                openSpotDetails(booking.SiteDetails.SiteID)
                            "
                        >
                            Spot Details
                        </AtomButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MapContainer from '@/components/extras/MapContainer.vue';
import { BookingStatus, getBookingStatusLabel } from '@/constant/enums';
import AtomTooltip from '@/components/atoms/AtomTooltip.vue';
import AtomIcon from '@/components/atoms/AtomIcon.vue';
import { DEFAULT_BANGALORE_COORDINATES, ICON } from '@/constant/constant';
import { mapActions, mapState } from 'vuex';
import { getBookingPaymentStatusLabell } from '@/constant/enums';
import AtomButton from '@/components/atoms/AtomButton.vue';
import moment from 'moment';

export default {
    name: 'BookingDetails',
    components: { MapContainer, AtomTooltip, AtomIcon, AtomButton },
    props: { booking: Object, activeTab: String },
    data() {
        return {
            ICON,
            showPopup: false,
            BookingStatus,
            siteDetails: {
                ...this.booking?.SiteDetails,
                ID: this.booking?.SiteDetails?.SiteID,
                Long: this.booking?.SiteDetails?.Longitude,
                Lat: this.booking?.SiteDetails?.Latitude,
                Name: this.booking?.SiteDetails?.SiteName,
            },
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
                : {
                      lat: DEFAULT_BANGALORE_COORDINATES.lat,
                      lng: DEFAULT_BANGALORE_COORDINATES.lng,
                  };
        },
    },
    methods: {
        ...mapActions('myBookings', ['fetchPayments']),

        getBookingStatusLabel(status) {
            return getBookingStatusLabel(status);
        },
        openSpotDetails(spotID) {
            const route = this.$router.resolve({
                name: 'spot-detail',
                params: { spotId: spotID },
            });
            window.open(route.href);
        },
        getBookingPaymentStatusLabell(status) {
            return getBookingPaymentStatusLabell(status);
        },
        getBookingStatusDescription(status) {
            switch (status) {
                case this.BookingStatus.BookingConfirmed:
                    return 'Booking has been confirmed.';
                case this.BookingStatus.BookingCancelled:
                    return 'The booking has been cancelled.';
                default:
                    return 'We are in progress to check the availability of the spot. It may take up to 24–48 hours for the confirmation.';
            }
        },
        formatDate(date) {
            if (!date) return '';
            return moment(date).format('DD-MM-YYYY');
        },
        cancelBooking(booking) {
            const phone = '917488239471';
            const message = `I want to cancel my booking.\nBooking ID: ${booking.BookingID}`;
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(
                message,
            )}`;
            const win = window.open(url, '_blank');
            if (!win) {
                alert(
                    'Could not open WhatsApp. Please contact us on 7488239471 to cancel the booking.',
                );
            }
        },
    },
    watch: {
        booking: {
            handler(newBooking) {
                if (newBooking) {
                    this.fetchPayments(newBooking.BookingID);
                }
            },
            immediate: true,
        },
    },
};
</script>

<style scoped>
.booking-details {
    background: var(--parkspot-white);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 85vh;
    overflow-y: auto;
    padding: 16px;
}

.btn,
.cancel-btn {
    border-radius: var(--border-default);
    cursor: pointer;
    font-weight: 700;
    margin: 12px;
    padding: 8px 16px;
    text-align: center;
    width: 180px;
}

.btn-container {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: auto;
    width: 100%;
}

.cancel-btn {
    background: transparent;
    border: 1px solid var(--parkspot-red);
    color: var(--parkspot-red);
}

.card {
    background: var(--card-bg, var(--parkspot-white));
    border-radius: var(--border-default, 8px);
    box-shadow: var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.1));
    display: flex;
    flex-direction: column;
    min-height: 200px;
    padding: 16px;
}

.card-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
}

.card-title {
    color: var(--parkspot-black);
    font-size: 16px;
    font-weight: 600;
}

.close-btn {
    background: none;
    border: none;
    color: var(--parkspot-black);
    cursor: pointer;
    font-size: 26px;
}

.default-img {
    height: auto;
    width: 280px;
}

.details-row {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
}

.info-icon {
    color: var(--parkspot-black);
    cursor: pointer;
    transition: transform 0.2s ease;
}

.info-icon:hover {
    transform: scale(1.1);
}

.info-list {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 4px;
    margin-top: 20px;
}

.info-row {
    align-items: flex-start;
    display: flex;
    gap: 10px;
    justify-content: space-between;
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
    border-radius: 12px;
    overflow: hidden;
    position: relative;
}

.navigate-link {
    color: var(--secondary-color);
    font-weight: 600;
    text-decoration: none;
}

.navigate-link:hover {
    text-decoration: underline;
}

.no-data {
    color: var(--parkspot-black);
    font-style: normal;
    font-weight: 600;
    padding: 20px 6px;
    text-align: center;
}

.popup-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
}

.popup-header h2 {
    color: var(--parkspot-black);
    font-size: 20px;
    font-weight: 600;
}

.popup-overlay {
    align-items: flex-start;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    inset: 0;
    justify-content: center;
    overflow-y: auto;
    padding-top: 60px;
    position: fixed;
    z-index: 2000;
}

.rent-cycle-label {
    align-items: center;
    display: flex;
    gap: 6px;
}

.sdp-map {
    border-radius: 12px;
    height: 100%;
    width: 100%;
}

.status {
    background: var(--primary-color);
    border-radius: 20px;
    color: var(--parkspot-black);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    padding: 4px 10px;
    text-transform: uppercase;
}

.status-cancelled {
    background: var(--parkspot-red);
    color: var(--parkspot-white);
}

.status-confirmed {
    background: var(--parkspot-green);
    color: var(--parkspot-white);
}

.txn-center {
    text-align: center;
}

.txn-popup {
    background: var(--parkspot-white);
    border-radius: 16px;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    max-width: 850px;
    overflow-x: auto;
    padding: 16px;
    width: 90%;
}

.txn-table {
    border-collapse: collapse;
    table-layout: auto;
    width: 100%;
}

.txn-table th,
.txn-table td {
    border-bottom: 1px solid var(--parkspot-white);
    font-weight: 400;
    padding: 8px 6px;
    white-space: nowrap;
}

.txn-table th {
    font-weight: 600;
}

@media (max-width: 768px) {
    .btn-container {
        flex-direction: column;
        gap: 8px;
    }

    .details-row {
        grid-template-columns: 1fr;
        justify-items: center;
    }

    .details-row .card {
        max-width: 400px;
        width: 100%;
    }

    .popup-header h2 {
        font-size: 18px;
    }

    .txn-popup {
        padding: 12px;
        width: 95%;
    }

    .txn-table th,
    .txn-table td {
        font-size: 12px;
        padding: 6px 4px;
    }
}
</style>
