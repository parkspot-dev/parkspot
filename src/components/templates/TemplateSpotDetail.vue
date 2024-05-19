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
                    class="sdp-map"
                    :spotsList="selectedSpot"
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
            <div class="spot-detail-owner" v-if="ownerInfoDetails.UserName">
                <hr style="width: 100%; margin-top: 80px" />
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
                                <td>{{ ownerInfoDetails.AlternateMobile }}</td>
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
                                        getKYCStatus(ownerInfoDetails.KYCStatus)
                                    }}
                                </td>
                            </tr>
                            <tr v-if="spotDetails.UpdatedAt">
                                <td>Last Call Date</td>
                                <td>
                                    <AtomDatePicker
                                        :assignedDate="spotDetails.LastCallDate"
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
                                        :value="spotDetails.Remark"
                                        :rowNo="2"
                                        @changed="changeRemark"
                                    />
                                </td>
                            </tr>
                        </table>
                    </div>
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
                        <AtomButton @click.native="changeAvailability(-1)">
                            Mark Rented
                        </AtomButton>
                    </div>
                    <div class="goto-btn" v-if="!isAvailable">
                        <AtomButton @click.native="changeAvailability(1)">
                            Mark Available
                        </AtomButton>
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
import { getKYCStatusLabel } from '@/constant/enums';
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
            'spotDetails',
            'ownerInfoDetails',
            'selectedSpot',
            'isAvailable',
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

.spot-detail-owner {
    margin-left: 20px;
    margin-top: 50px;
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
        gap: 10px;
    }

    .goto-btn {
        margin-top: 10px;
    }

    table,
    th,
    td {
        border: 1px solid;
        padding: 5px;
    }
}
</style>
