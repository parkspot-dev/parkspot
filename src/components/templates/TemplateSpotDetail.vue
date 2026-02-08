<template>
    <BodyWrapper>
        <div>
            <!-- image gallery -->
            <ImageGallery
                :images="displayImages"
                :location-name="locationName"
                :removable="false"
            ></ImageGallery>
            <!-- Rate Card Organism -->
            <div class="rate-card-container">
                <SpotRateCard
                    class="card-position"
                    @open-booking-modal="openBookingModal"
                ></SpotRateCard>
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

            <div>
                <hr />
                <div
                    v-if="
                        spotDetails.Facilities &&
                        spotDetails.Facilities.length > 0
                    "
                    class="spot-detail-amenities"
                >
                    <h2>What this place offers?</h2>
                    <div class="facilities-grid">
                        <div
                            v-for="facility in spotDetails.Facilities"
                            :key="facility.FacilityID"
                            class="facility-card"
                        >
                            <span class="material-symbols-outlined">
                                {{ facility.IconURL }}
                            </span>
                            <div class="facility-text">
                                <div>{{ facility.Name }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
            <div class="spot-detail-map">
                <h2>How to get here?</h2>
                <div class="warning">
                    <span class="material-symbols-outlined"> warning </span>
                    The provided address is for reference only. For the exact
                    location, book the spot now and our team will share the
                    precise address with you!
                </div>
                <MapContainer
                    :center="center"
                    :spot-details="selectedSpot[0]"
                    :zoom="13"
                    class="sdp-map"
                >
                </MapContainer>
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

            <!-- only for agents -->
            <div class="only-to-agent">
                <div v-if="ownerInfoDetails.UserName" class="spot-detail-owner">
                    <hr style="width: 100%" />
                    <h2>Owner Info Details</h2>
                    <div class="spot-detail-owner-body">
                        <div>
                            <table>
                                <tr v-if="spotDetails.ApartmentName">
                                    <td>Apartment</td>
                                    <td>{{ spotDetails.ApartmentName }}</td>
                                </tr>
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
                                            :assigned-date="
                                                spotDetails.LastCallDate
                                            "
                                            :size="'is-small'"
                                            @changed="
                                                (date) =>
                                                    changeLastCallDate(date)
                                            "
                                        >
                                        </AtomDatePicker>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Remark</td>
                                    <td>
                                        <AtomTextarea
                                            v-model="spotDetails.Remark"
                                            :row-no="2"
                                            @changed="changeRemark"
                                        />
                                    </td>
                                </tr>
                                <tr v-if="paymentDetails">
                                    <td>Account</td>
                                    <td>{{ paymentDetails }}</td>
                                </tr>
                                <tr v-if="ownerInfoDetails.UserName">
                                    <td>UserName</td>
                                    <td>{{ ownerInfoDetails.UserName }}</td>
                                </tr>
                                <tr v-if="isAdmin">
                                    <td>Image Uploads</td>
                                    <td>
                                        <div class="form-field">
                                            <ImageUpload
                                                v-model:images="updatedImages"
                                            />
                                        </div>

                                        <AtomButton @click="saveImages">
                                            Save Images
                                        </AtomButton>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div class="btn-group">
                            <div class="goto-btn">
                                <AtomButton
                                    @click="
                                        goToInterestedVO([
                                            spotDetails.Lat,
                                            spotDetails.Long,
                                        ])
                                    "
                                >
                                    Interested VO's
                                </AtomButton>
                            </div>
                            <div v-if="isAvailable" class="goto-btn">
                                <AtomButton @click="changeAvailability(-1)">
                                    Mark Rented
                                </AtomButton>
                            </div>
                            <div v-if="!isAvailable" class="goto-btn">
                                <AtomButton @click="changeAvailability(1)">
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
                                                getBookingDetailURL(booking.ID)
                                            "
                                            target="_blank"
                                        >
                                            {{ booking.ID }}
                                        </a>
                                    </td>
                                    <td>
                                        <span
                                            :class="{
                                                active:
                                                    booking.Status ===
                                                        BookingStatus.BookingConfirmed ||
                                                    booking.Status ===
                                                        BookingStatus.BookingRentDue,
                                                visit:
                                                    booking.Status ===
                                                        BookingStatus.BookingPaymentPending ||
                                                    booking.Status ===
                                                        BookingStatus.BookingVisiting ||
                                                    booking.Status ===
                                                        BookingStatus.BookingScheduleVisit,
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
        <BookingModal
            v-if="showBookingModal"
            :initial-data="prefilledData"
            @close="showBookingModal = false"
            @submitted="handleBookingSubmit"
        />
        <LoaderModal v-if="showLoader" />
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
import BookingModal from '@/components/organisms/OrganismBookingModal.vue';
import {
    BookingStatus,
    getBookingStatusLabel,
    getKYCStatusLabel,
} from '@/constant/enums';
import { mapState, mapActions } from 'vuex';
import AtomTextarea from '../atoms/AtomTextarea.vue';
import LoaderModal from '../extras/LoaderModal.vue';
import ImageUpload from '../global/ImageUpload.vue';
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
        BookingModal,
        LoaderModal,
        ImageUpload,
    },
    props: {
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    emits: [
        'goToSearchPortal',
        'changeAvailability',
        'changeLastCallDate',
        'changeRemark',
    ],
    data() {
        return {
            BookingStatus: BookingStatus,
            showBookingModal: false,
            emailWatcher: null,
            showLoader: false,
            updatedImages: [],
        };
    },
    computed: {
        ...mapState('sdp', [
            'images',
            'thumbnail',
            'center',
            'isAvailable',
            'ownerInfoDetails',
            'paymentDetails',
            'selectedSpot',
            'spotDetails',
            'spotInProgressBookings',
        ]),
        ...mapState('user', ['isAdmin']),
        locationName() {
            return this.selectedSpot.length > 0
                ? this.selectedSpot[0].Name
                : '';
        },
        displayImages() {
            if (this.images && this.images.length) {
                return this.images;
            } else if (this.thumbnail && this.thumbnail.length) {
                return this.thumbnail;
            } else {
                return [];
            }
        },
        isLoggedIn() {
            return !!this.$store.state.user.user;
        },
        userProfile() {
            return this.$store.state.user.userProfile;
        },
        prefilledData() {
            if (!this.isLoggedIn) return {};

            return {
                fullName: this.userProfile.FullName,
                email: this.userProfile.EmailID,
                mobile: this.userProfile.Mobile,
            };
        },
    },
    watch: {
        images: {
            immediate: true,
            deep: true,
            handler(newImages) {
                if (!newImages || !newImages.length) return;

                // map backend images → ImageUpload format
                this.updatedImages = newImages.map((img) => ({
                    id: img.SiteImageID,
                    preview: img.ImageURL,
                    file: null,
                    isNew: false,
                }));
            },
        },
    },
    beforeUnmount() {
        this.emailWatcher?.();
    },
    methods: {
        ...mapActions('bookingPortal', [
            'createTentativeBooking',
            'createContactLead',
        ]),
        ...mapActions('sdp', ['updateImages']),
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
        getBookingDetailURL(bookingID) {
            return `${window.location.origin}/internal/booking-portal?bookingId=${bookingID}`;
        },
        getBookingStatusLabel(bookingStatus) {
            return getBookingStatusLabel(bookingStatus);
        },
        async handleBookingSubmit(form) {
            try {
                this.showLoader = true;
                if (!this.isLoggedIn) {
                    await this.createContactLead({
                        User: {
                            FullName: form.fullName,
                            EmailID: form.email,
                            Mobile: form.mobile,
                        },
                        Comments: `From spot detail page | Vehicle: ${form.vehicleNo || 'NA'}`,
                    });

                    this.showLoader = false;

                    this.$buefy.toast.open({
                        message: 'We will get you in 12 hours.',
                        type: 'is-success',
                    });

                    return;
                }

                const formatDate = (date) => {
                    const yyyy = date.getFullYear();
                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                    const dd = String(date.getDate()).padStart(2, '0');
                    const hh = String(date.getHours()).padStart(2, '0');
                    const min = String(date.getMinutes()).padStart(2, '0');

                    return `${yyyy}${mm}${dd}t${hh}${min}`;
                };

                // start = now
                const startTime = formatDate(new Date());

                // end = after 1 month
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);
                const endTime = formatDate(endDate);

                await this.createTentativeBooking({
                    SiteID: this.spotDetails.SiteID,
                    StartTime: startTime,
                    EndTime: endTime,

                    UserInfo: {
                        Name: form.fullName,
                        Mobile: form.mobile,
                        EmailID: form.email,
                        VehicleNo: form.vehicleNo || '',
                    },

                    Fee: {
                        Rent: this.spotDetails.Rate,
                        ConvenienceFee: 500,
                    },

                    PaymentEnv: 0,
                });

                this.showLoader = false;

                this.$buefy.toast.open({
                    message: 'Booking request submitted successfully',
                    type: 'is-success',
                    duration: 3000,
                    position: 'is-top',
                });

                setTimeout(() => {
                    this.$router.push('/profile/my-bookings?tab=Request');
                }, 800);
            } catch (err) {
                this.showLoader = false;
                this.$buefy.toast.open({
                    message: err?.message || 'Booking failed',
                    type: 'is-danger',
                    position: 'is-top',
                });
            }
        },
        openBookingModal() {
            if (this.isLoggedIn && !this.userProfile.EmailID) {
                this.emailWatcher = this.$watch(
                    'userProfile.EmailID',
                    (val) => {
                        if (val) {
                            this.showBookingModal = true;
                            this.emailWatcher?.();
                            this.emailWatcher = null;
                        }
                    },
                );
                return;
            }

            this.showBookingModal = true;
        },
        saveImages() {
            this.updateImages(this.updatedImages);
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
    max-width: 50%;
    padding: 20px;
}

h2 {
    color: black;
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 26px;
}

.facilities-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: flex-start;
    margin-top: 16px;
}

.facility-card {
    align-items: center;
    border-radius: 10px;
    border: 1px solid hsla(141, 93%, 30%, 0.442);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.316);
    display: flex;
    flex: 1 1 calc(33.333% - 20px);
    gap: 10px;
    justify-content: start;
    max-width: calc(33.333% - 20px);
    padding: 16px;
    text-align: center;
    transition: transform 0.2s ease;
}

.facility-card:hover {
    transform: translateY(-4px);
}

.facility-icon {
    height: 48px;
    margin-bottom: 12px;
    width: 48px;
}

.facility-text {
    color: var(--secondary-color);
    font-size: 14px;
    font-weight: bold;
}

.material-symbols-outlined {
    color: hsl(141, 93%, 30%);
}

@media screen and (max-width: 768px) {
    .facility-card {
        flex: 1 1 calc(50% - 20px);
        max-width: calc(50% - 20px);
    }

    .spot-detail-amenities {
        max-width: 100%;
    }
}

@media screen and (max-width: 480px) {
    .facility-card {
        flex: 1 1 100%;
        max-width: 100%;
    }
}

.spot-detail-map {
    margin: 150px 0 0 20px;
    @media only screen and (max-width: 1024px) {
        margin: 0;
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

.only-to-agent {
    display: flex;
    flex-direction: row;
    gap: 80px;
    justify-content: space-between;
    padding: 60px 0;
}

@media (max-width: 768px) {
    .only-to-agent {
        flex-direction: column;
        gap: 40px;
    }
}

.spot-detail-owner {
    display: flex;
    flex-direction: column;
    margin-left: 20px;

    h2 {
        color: black;
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 26px;
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
    height: 340px;
    overflow-y: scroll;
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

.warning {
    display: flex;
    margin-bottom: 20px;
    margin-top: -20px;

    span {
        color: red;
    }
}
</style>
