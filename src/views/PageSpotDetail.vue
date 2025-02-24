<template>
    <div>
        <LoaderModal v-if="isLoading"></LoaderModal>
        <TemplateSpotDetail
            v-else
            @goToSearchPortal="goToSearchPortal"
            @changeAvailability="changeAvailability"
            @changeLastCallDate="changeLastCallDate"
            @changeRemark="changeRemark"
        ></TemplateSpotDetail>
        <div
            v-if="this.spotActiveBookings && this.spotActiveBookings.length > 0"
            class="table-container"
        >
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Status</th>
                        <th>Agent</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="booking in spotActiveBookings" :key="booking.ID">
                        <td>
                            <a class="booking-link">
                                {{ booking.ID }}
                            </a>
                        </td>
                        <td>
    {{
        [6, 7, 8].includes(booking.Status)
            ? 'Booking in Progress'
            : [1, 9].includes(booking.Status)
                ? 'Active Booking'
                : ''
    }}
</td>

                        <td>{{ getAgentName(booking.AgentUserName) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import TemplateSpotDetail from '../components/templates/TemplateSpotDetail.vue';
import LoaderModal from '../components/extras/LoaderModal.vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import { PAGE_TITLE } from '@/constant/constant';
import { getActiveTabStatusLabel } from '../constant/enums';
import { getBookingStatusLabel } from '../constant/enums';

export default {
    name: 'PageSpotDetail',
    components: {
        TemplateSpotDetail,
        LoaderModal,
    },
    metaInfo() {
        return {
            title: this.title,
            titleTemplate: PAGE_TITLE.TITLE_TEMPLATE + '%s',
        };
    },
    data() {
        return {
            spotId: null,
            spotDetails: null,
        };
    },
    computed: {
        ...mapState('sdp', {
            isLoading: (state) => state.loading,
            title: (state) => state.title,
            spotActiveBookings: (state) => state.spotActiveBookings,
        }),
        ...mapState('bookingPortal', ['activeBookings', 'agents']),
    },
    watch: {
        activeBookings() {
            this.filterActiveBookingForSpot();
        },
    },
    async mounted() {
        this.getAgents();
        this.getActiveBooking();
        this.spotId = this.$route.params.spotId;
        if (this.spotId.includes('#')) {
            this.spotId = encodeURIComponent(this.spotId);
        }
        try {
            await this.getSpotDetails({
                spotId: this.spotId,
            });
        } catch (error) {
            this.$buefy.toast.open({
                message: `Something went wrong!`,
                type: 'is-danger',
                duration: 2000,
            });
            this.$router.push({
                name: 'error',
                params: { msg: error.DisplayMsg },
            });
        }
        this.getUserLocation();
    },
    methods: {
        ...mapActions('sdp', [
            'getSpotDetails',
            'updateAvailability',
            'updateLastCallDate',
            'updateRemark',
            'setSpotActiveBookings',
        ]),
        ...mapActions('searchPortal', [
            'activeTab',
            'updateActiveTab',
            'updateSOLatLngInput',
        ]),
        ...mapActions('bookingPortal', ['getActiveBooking', 'getAgents']),
        ...mapMutations('map', {
            updateUserLocation: 'update-user-location',
        }),
        getUserLocation() {
            const geolocation = navigator.geolocation;
            if (geolocation) {
                geolocation.getCurrentPosition(
                    this.onGeoSuccess,
                    this.onGeoError,
                );
            } else {
                console.log('Geolocation is not supported by this browser.');
            }
        },
        onGeoSuccess(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const location = [lng, lat];
            this.updateUserLocation(location);
        },
        onGeoError(error) {
            let detailError;

            if (error.code === error.PERMISSION_DENIED) {
                detailError = 'User denied the request for Geolocation.';
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                detailError = 'Location information is unavailable.';
            } else if (error.code === error.TIMEOUT) {
                detailError = 'The request to get user location timed out.';
            } else if (error.code === error.UNKNOWN_ERROR) {
                detailError = 'An unknown error occurred.';
            }

            console.log(detailError);
        },
        goToSearchPortal(latLng) {
            this.updateActiveTab(1);
            this.updateSOLatLngInput(latLng.join(','));
            this.$router.push({
                name: 'SearchPortal',
                query: {
                    latlng: latLng.join(','),
                    tab: getActiveTabStatusLabel(
                        this.$store.state.searchPortal.activeTab,
                    ),
                },
            });
        },
        async changeAvailability(availableCount) {
            await this.updateAvailability(availableCount);
            await this.getSpotDetails({
                spotId: this.spotId,
            });
        },
        async changeLastCallDate(lastCallDate) {
            await this.updateLastCallDate(lastCallDate);
            await this.getSpotDetails({
                spotId: this.spotId,
            });
        },
        async changeRemark(remark) {
            await this.updateRemark(remark);
            await this.getSpotDetails({
                spotId: this.spotId,
            });
        },
        filterActiveBookingForSpot() {
            if (this.activeBookings && this.spotId) {
                console.log(
                    'These are active bookings',
                    this.activeBookings,
                    this.spotId,
                );
                const spotActiveBooking = this.activeBookings.filter(
                    (booking) => {
                        const bookingSiteID = encodeURIComponent(
                            booking.SiteID,
                        );
                        return bookingSiteID === this.spotId;
                    },
                );
                if (spotActiveBooking) {
                    this.setSpotActiveBookings(spotActiveBooking);
                }
            }
        },

        getAgentName(agentUsername) {
            const agent = this.agents.find(
                (agent) => agent.UserName === agentUsername,
            );
            return agent ? agent.FullName : '';
        },

        getBookingStatusLabel(bookingStatus) {
            return getBookingStatusLabel(bookingStatus);
        },
    },
};
</script>
<style scoped>
.table-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px 0;
}

.styled-table {
    width: 60%;
    border-collapse: collapse;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.styled-table th,
.styled-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: center;
}

.styled-table thead {
    background-color: var(--primary-color);
    color: white;
    font-weight: bold;
}

.styled-table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
}

.styled-table tbody tr:hover {
    background-color: #f1f1f1;
}

.booking-link {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
}

.booking-link:hover {
    text-decoration: underline;
}
</style>
