<template>
    <div class="parking-facility">
        <div class="parking-facility-header">
            <h1>Parking Facility</h1>
            <h2>Please fill all the fields</h2>
        </div>
        <div class="parking-facility-form">
            <div class="parking-facility-form-VO" v-if="userProfile.Type === 1">
                <div class="py-4">
                    <MoleculeSelectInput
                        :fieldName="PARKING_FACILITY.VO.PARKING_TYPE"
                        :list="PARKING_FACILITY.VO.PARKING_TYPE_LIST"
                        @input="updateType"
                        :placeholder="'Type of Parking'"
                        :label="PARKING_FACILITY.VO.PARKING_TYPE"
                    ></MoleculeSelectInput>
                </div>
                <div class="py-4">
                    <MoleculeSelectInput
                        :fieldName="PARKING_FACILITY.VO.DURATION"
                        :list="PARKING_FACILITY.VO.MINIMUM_DURATION_DATA"
                        @input="updateMinDur"
                        :placeholder="'Minimum duration if any'"
                        :label="PARKING_FACILITY.VO.DURATION"
                    ></MoleculeSelectInput>
                </div>
                <div class="py-4">
                    <MoleculeSelectInput
                        :fieldName="'Car Type'"
                        :list="PARKING_FACILITY.VO.CAR_TYPE"
                        @input="updateCarType"
                        :placeholder="'Type of Car'"
                        :label="'Car Type'"
                    ></MoleculeSelectInput>
                </div>
            </div>
            <div class="parking-facility-form-SO" v-if="userProfile.Type === 2">
                <div class="py-4">
                    <MoleculeNameInput
                        :fieldName="PARKING_FACILITY.SO.BUILDING_ADDR"
                        :placeholder="PARKING_FACILITY.SO.BUILDING_ADDR"
                        :rules="validation.buildingAddr"
                        v-model="localBuildingAddr"
                        :label="PARKING_FACILITY.SO.BUILDING_ADDR"
                    ></MoleculeNameInput>
                </div>
                <div class="py-4">
                    <MoleculeNameInput
                        :fieldName="PARKING_FACILITY.SO.LANDMARK"
                        :placeholder="PARKING_FACILITY.SO.LANDMARK"
                        :rules="validation.landmark"
                        v-model="localLandmark"
                        :label="PARKING_FACILITY.SO.LANDMARK"
                    ></MoleculeNameInput>
                    <p>Is there a landmark near the parking spot?</p>
                </div>
                <div class="py-4">
                    <MoleculeNameInput
                        :fieldName="PARKING_FACILITY.SO.TOTAL_PARKING"
                        :placeholder="PARKING_FACILITY.SO.TOTAL_PARKING"
                        :rules="validation.totalParking"
                        v-model="localTotalParking"
                        :label="PARKING_FACILITY.SO.TOTAL_PARKING"
                    ></MoleculeNameInput>
                </div>
                <div class="py-4">
                    <MoleculeCheckbox
                        :fieldName="PARKING_FACILITY.SO.FACILITIES"
                        :rules="validation.amenities"
                        :values="PARKING_FACILITY.SO.FACILITIES_DATA"
                        v-model="localAmenities"
                    >
                        {{ PARKING_FACILITY.SO.FACILITIES }}
                    </MoleculeCheckbox>
                </div>
                <div class="py-4">
                    <p>Photos(Parking spot pictures)</p>
                    <MoleculeUpload
                        @data="updateParkingSpotImg"
                        :fieldName="'document'"
                        :rules="validation.parkingSpotImg"
                    ></MoleculeUpload>
                </div>
            </div>

            <!-- todo: map integration (not decided yet google map or mapbox) -->
            <AtomButton class="is-pulled-right" @click="saveProfile">
                Save Profile
            </AtomButton>
        </div>
    </div>
</template>

<script>
import MoleculeNameInput from '../molecules/MoleculeNameInput.vue';
import MoleculeCheckbox from '../molecules/MoleculeCheckbox.vue';
import MoleculeUpload from '../molecules/MoleculeUpload.vue';
import AtomButton from '../atoms/AtomButton.vue';
import MoleculeSelectInput from '../molecules/MoleculeSelectInput.vue';
import { PARKING_FACILITY } from '../../constant/constant';
import { mapActions, mapState } from 'vuex';
export default {
    name: 'OrganismParkingFacility',
    components: {
        MoleculeNameInput,
        MoleculeCheckbox,
        MoleculeUpload,
        AtomButton,
        MoleculeSelectInput,
    },
    data() {
        return {
            PARKING_FACILITY,
            validation: {
                buildingAddr: 'required',
                totalParking: '',
                parkingSpotImg: '',
                landmark: '',
                parkingType: '',
            },
            // so variables
            localBuildingAddr: '',
            localTotalParking: '',
            localLandmark: '',
            localParkingSpotImg: null,
            localAmenities: '',
            // vo variables
            localParkingType: '',
            localMinDur: '',
            localCarType: '',
        };
    },
    computed: {
        ...mapState('user', ['userProfile']),
        // to be used when backend api implemented
        // voParkingType() {
        //     return 1;
        // },
        // voMinDur() {
        //     return 1;
        // },
        // voCarType() {
        //     return 1;
        // },
    },
    methods: {
        ...mapActions('user', [
            'updateVOParkingFacility',
            'updateSOParkingFacility',
        ]),

        updateParkingSpotImg(spotImg) {
            this.localParkingSpotImg = spotImg;
        },

        updateType(typeData) {
            this.localParkingType =
                PARKING_FACILITY.VO.PARKING_TYPE_LIST[typeData].name;
        },

        updateMinDur(minDur) {
            this.localMinDur =
                PARKING_FACILITY.VO.MINIMUM_DURATION_DATA[minDur].name;
        },

        updateCarType(carType) {
            this.localCarType = PARKING_FACILITY.VO.CAR_TYPE[carType].name;
        },

        async saveProfile() {
            if (this.userProfile.Type === 1) {
                try {
                    await this.updateVOParkingFacility({
                        ParkingType: this.localParkingType,
                        MinDur: this.localMinDur,
                        CarType: this.localCarType,
                    });
                    this.updateSavedProfileFlag(true);
                    this.$buefy.toast.open({
                        message: 'Profile updated successfully!',
                        type: 'is-success',
                        duration: 2000,
                    });
                } catch (error) {
                    this.$buefy.toast.open({
                        message: `Something went wrong!`,
                        type: 'is-danger',
                        duration: 2000,
                    });
                }
            }
            if (this.userProfile.Type === 2) {
                try {
                    await this.updateSOParkingFacility({
                        FullName: this.localFullName,
                        EmailID: this.localEmailID,
                        Mobile: this.localMobile,
                        Type: this.localType,
                    });
                    this.updateSavedProfileFlag(true);
                    this.$buefy.toast.open({
                        message: 'Profile updated successfully!',
                        type: 'is-success',
                        duration: 2000,
                    });
                } catch (error) {
                    this.$buefy.toast.open({
                        message: `Something went wrong!`,
                        type: 'is-danger',
                        duration: 2000,
                    });
                }
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.parking-facility-header {
    background-color: var(--secondary-color);
    padding: 20px 32px;
    margin-bottom: 32px;

    h1 {
        color: black;
        font-weight: 600;
        font-size: 24px;
    }

    h2 {
        color: #e8faff;
        font-size: 14px;
    }
}

.parking-facility-form {
    padding: 0 32px;
}
</style>
