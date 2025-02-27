<template>
    <BodyWrapper>
        <div>
            <!-- image gallery -->
            <div class="spot-image-container">
                <ImageGallery></ImageGallery>
            </div>

            <!-- Rate Card Organism -->
            <div class="rate-card-container">
                <SpotRateCard class="card-position"></SpotRateCard>
            </div>
            <div class="spot-detail-main-description">
                <div class="title-container">
                    <h1>{{ spotDetails.Name }}</h1>
                </div>
                <div>
                    <p>Address:</p>
                    <p>
                        {{ spotDetails.Address }}
                    </p>
                    <p>
                        {{ spotDetails.Area }}
                    </p>
                    <p>
                        {{ spotDetails.City }}
                    </p>
                </div>
            </div>
            <hr />

            <div class="spot-detail-amenities">
                <h2>What this place offers</h2>
                <ul>
                    <li>Covered</li>
                    <li>Gated</li>
                    <li>Security Guard</li>
                </ul>
            </div>
            <hr />

            <div class="spot-detail-map">
                <h2>How to get here?</h2>
                <MapContainer
                    :center="center"
                    :spotDetails="selectedSpot[0]"
                    :zoom="13"
                    class="sdp-map"
                ></MapContainer>
            </div>

            <hr style="width: 100%" />
            <div class="spot-detail-things">
                <h2>Things to Know</h2>
                <p>
                    ParkSpot does the KYC of the Parking Spot Owner. But, before
                    you park your vehicle, please verify the facts claimed by
                    the owner.
                </p>
                <InfographicSteps></InfographicSteps>
            </div>

            <!-- only to admin -->
            <div class="only-to-agent-admin">
                <div class="spot-detail-owner" v-if="ownerInfoDetails.UserName">
                    <hr style="width: 100%" />
                    <h2>Owner Info Details</h2>
                    <div class="spot-detail-owner-body">
                        <div>
                            <table>
                                <tr v-if="ownerInfoDetails.FullName">
                                    <td>FullName</td>
                                    <td>{{ ownerInfoDetails.FullName }}</td>
                                </tr>
                                <tr v-if="ownerInfoDetails.Mobile">
                                    <td>Mobile</td>
                                    <td>{{ ownerInfoDetails.Mobile }}</td>
                                </tr>
                                <tr v-if="ownerInfoDetails.AlternateMobile">
                                    <td>Alternate Mobile</td>
                                    <td>
                                        {{ ownerInfoDetails.AlternateMobile }}
                                    </td>
                                </tr>
                                <tr v-if="ownerInfoDetails.City">
                                    <td>City</td>
                                    <td>{{ ownerInfoDetails.City }}</td>
                                </tr>
                                <tr v-if="ownerInfoDetails.EmailID">
                                    <td>EmailID</td>
                                    <td>{{ ownerInfoDetails.EmailID }}</td>
                                </tr>
                                <tr v-if="ownerInfoDetails.KYCStatus">
                                    <td>KYCStatus</td>
                                    <td>
                                        {{
                                            getKYCStatus(
                                                ownerInfoDetails.KYCStatus,
                                            )
                                        }}
                                    </td>
                                </tr>
                                <tr v-if="spotDetails.UpdatedAt">
                                    <td>Last Call Date</td>
                                    <td>
                                        <AtomDatePicker
                                            :assignedDate="
                                                spotDetails.LastCallDate
                                            "
                                            :size="'is-small'"
                                            @changed="changeLastCallDate"
                                        >
                                        </AtomDatePicker>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Remark</td>
                                    <td>
                                        <AtomTextarea
                                            v-model="spotDetails.Remark"
                                            :rowNo="2"
                                            @changed="changeRemark"
                                        />
                                    </td>
                                </tr>
                                <tr v-if="paymentDetails">
                                    <td>Account</td>
                                    <td>{{ paymentDetails }}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="btn-group">
                            <div class="goto-btn">
                                <AtomButton
                                    @click.native="
                                        goToInterestedVO([
                                            spotDetails.Lat,
                                            spotDetails.Long,
                                        ])
                                    "
                                >
                                    Interested VO's
                                </AtomButton>
                            </div>
                            <div class="goto-btn" v-if="isAvailable">
                                <AtomButton
                                    @click.native="changeAvailability(-1)"
                                >
                                    Mark Rented
                                </AtomButton>
                            </div>
                            <div class="goto-btn" v-if="!isAvailable">
                                <AtomButton
                                    @click.native="changeAvailability(1)"
                                >
                                    Mark Available
                                </AtomButton>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="spotInProgressBookings" class="in-progress-bookings">
                    <hr style="width: 100%" />
                    <h2>In-progress Bookings</h2>
                    <div class="table-container">
                        <table class="styled-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Status</th>
                                    <th>Agent Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="booking in spotInProgressBookings"
                                    :key="booking.ID"
                                >
                                    <td>
                                        <a
                                            :href="
                                                this.BookingDetailURL(
                                                    booking.ID,
                                                )
                                            "
                                        >
                                            {{ booking.ID }}
                                        </a>
                                    </td>
                                    <td>
                                        <span
                                            :class="{
                                                active:
                                                    booking.Status === 1 ||
                                                    booking.Status === 9,
                                                visit:
                                                    booking.Status === 6 ||
                                                    booking.Status === 7 ||
                                                    booking.Status === 8,
                                            }"
                                        >
                                            {{
                                                getBookingStatusLabel(
                                                    booking.Status,
                                                )
                                            }}
                                        </span>
                                    </td>

                                    <td>{{ booking.AgentFullName }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="rate-card-container-mobile">
                <hr style="width: 100%; margin-top: 80px" />
            </div>
        </div>
    </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import SpotRateCard from '@/components/organisms/OrganismSpotRateCard.vue';
import MapContainer from '@/components/extras/MapContainer.vue';
import ImageGallery from '../organisms/OrganismImageGallery.vue';
import InfographicSteps from '../molecules/MoleculeInfographicSteps.vue';
import AtomButton from '@/components/atoms/AtomButton.vue';
import AtomDatePicker from '../atoms/AtomDatePicker.vue';
import { getBookingStatusLabel, getKYCStatusLabel } from '@/constant/enums';
import { mapState } from 'vuex';
import AtomTextarea from '../atoms/AtomTextarea.vue';

export default {
    name: 'TemplateSpotDetail',
    components: {
        BodyWrapper,
        SpotRateCard,
        MapContainer,
        ImageGallery,
        InfographicSteps,
        AtomButton,
        AtomDatePicker,
        AtomTextarea,
    },
    props: {
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        ...mapState('sdp', [
            'center',
            'isAvailable',
            'ownerInfoDetails',
            'paymentDetails',
            'selectedSpot',
            'spotDetails',
            'spotInProgressBookings',
        ]),
    },
    emits: ['goToSearchPortal', 'changeAvailability', 'changeLastCallDate'],
    methods: {
        goToInterestedVO(latLng) {
            this.$emit('goToSearchPortal', latLng);
        },
        changeAvailability(availableCount) {
            this.$emit('changeAvailability', availableCount);
        },
        changeLastCallDate(lastCallDate) {
            this.$emit('changeLastCallDate', lastCallDate);
        },
        changeRemark(remark) {
            this.$emit('changeRemark', remark);
        },
        getKYCStatus(kycStatus) {
            return getKYCStatusLabel(kycStatus);
        },
        BookingDetailURL(bookingID) {
            return `${window.location.origin}/internal/booking-portal?bookingId=${bookingID}`;
        },
        getBookingStatusLabel(bookingStatus) {
            return getBookingStatusLabel(bookingStatus);
        },
    },
};
</script>

<style lang="scss" scoped>
hr {
    width: 600px;
}
.spot-image-container {
    width: 100%;
    height: 400px;
    margin-bottom: 48px;
    margin-left: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-default);
    overflow: hidden;

    @media only screen and (max-width: 1024px) {
        margin-left: 0px;
    }

    img {
        height: 60vh;
    }
}

.rate-card-container {
    position: relative;

    @media only screen and (max-width: 1024px) {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
    }
    .card-position {
        position: absolute;
        top: 0;
        right: 0;
        @media only screen and (max-width: 1024px) {
            position: relative;
        }
    }
}

.rate-card-container-mobile {
    display: none;
    @media only screen and (max-width: 1024px) {
        display: block;
        min-height: 450px;
    }
}

.spot-detail-main-description {
    width: 600px;
    margin-left: 20px;

    @media only screen and (max-width: 1024px) {
        margin-left: 0px;
    }

    @media only screen and (max-width: 540px) {
        width: 335px;
    }

    .title-container {
        display: flex;
        align-items: center;
        justify-content: space-between;

        h1 {
            font-size: 32px;
            font-weight: 500;
            margin-bottom: 13px;
            color: black;
        }
    }

    p {
        font-size: 16px;
        font-weight: 500;
    }
}

.spot-detail-amenities {
    width: 600px;
    min-height: 158px;
    margin-left: 20px;

    @media only screen and (max-width: 1024px) {
        margin-left: 0px;
    }

    h2 {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 26px;
        color: black;
    }

    ul {
        list-style: none;
    }

    ul li:before {
        content: '✓ ';
        color: hsl(141, 53%, 53%);
        font-weight: bold;
        font-size: 20px;
    }
}

.spot-detail-map {
    margin-left: 20px;

    @media only screen and (max-width: 1024px) {
        margin-left: 0px;
    }

    h2 {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 26px;
        color: black;
    }

    .sdp-map {
        border: 1px solid black;
    }
}

.spot-detail-things {
    margin-left: 20px;
    h2 {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 26px;
        color: black;
    }

    p {
        font-size: 20px;
    }
}

.only-to-agent-admin {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 60px 0;
    gap: 80px;
}

@media (max-width: 768px) {
    .only-to-agent-admin {
        flex-direction: column;
        gap: 40px;
    }
}

.spot-detail-owner {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    h2 {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 26px;
        color: black;
    }

    p {
        font-size: 20px;
    }

    .spot-detail-owner-body {
        display: flex;
        flex-direction: column;
        gap: 10px;
        vertical-align: middle;
    }

    .btn-group {
        display: flex;
        justify-content: flex-start;
        gap: 20px;
        .goto-btn {
            margin-top: 10px;
        }
    }

    table,
    th,
    td {
        border: 1px solid;
        padding: 5px;
    }
}

.in-progress-bookings {
    display: flex;
    flex-direction: column;
    justify-content: start;
    justify-items: start;
    width: 100%;

    h2 {
        color: black;
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 26px;
    }
}
.table-container {
    align-items: center;
    display: flex;
    justify-content: center;
    width: 100%;
}

.styled-table {
    border-collapse: collapse;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    width: 100%;
}

.styled-table th,
.styled-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: center;
}

.styled-table thead {
    background-color: var(--primary-color);
    color: var(--parkspot-white);
    font-weight: bold;
}

.active,
.visit {
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 12px;
}

.active {
    background-color: rgba(255, 0, 0, 0.278);
    color: red;
}

.visit {
    background-color: hsla(141, 53%, 53%, 0.256);
    color: hsl(141, 93%, 30%);
}
</style>
