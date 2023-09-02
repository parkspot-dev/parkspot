<template>
    <div class="parking-facility">
        <div class="parking-facility-header">
            <h1>Parking Facility</h1>
            <h2>Please fill all the fields</h2>
        </div>
        <div class="parking-facility-form">
            <div class="parking-facility-form-SO" v-if="userType === 'SO'">
                <div class="py-4">
                    <MoleculeNameInput
                        :fieldName="PARKING_FACILITY.SO.BUILDING_ADDR"
                        :placeholder="PARKING_FACILITY.SO.BUILDING_ADDR"
                        :rules="validation.buildingAddr"
                        v-model="model.buildingAddr"
                        :label="PARKING_FACILITY.SO.BUILDING_ADDR"
                    ></MoleculeNameInput>
                </div>
                <div class="py-4">
                    <MoleculeNameInput
                        :fieldName="PARKING_FACILITY.SO.LANDMARK"
                        :placeholder="PARKING_FACILITY.SO.LANDMARK"
                        :rules="validation.landmark"
                        v-model="model.landmark"
                        :label="PARKING_FACILITY.SO.LANDMARK"
                    ></MoleculeNameInput>
                    <p>Is there a landmark near the parking spot?</p>
                </div>
                <div class="py-4">
                    <MoleculeNameInput
                        :fieldName="PARKING_FACILITY.SO.TOTAL_PARKING"
                        :placeholder="PARKING_FACILITY.SO.TOTAL_PARKING"
                        :rules="validation.totalParking"
                        v-model="model.totalParking"
                        :label="PARKING_FACILITY.SO.TOTAL_PARKING"
                    ></MoleculeNameInput>
                </div>
                <div class="py-4">
                    <MoleculeCheckbox
                        :fieldName="PARKING_FACILITY.SO.FACILITIES"
                        :rules="validation.amenities"
                        :values="PARKING_FACILITY.SO.FACILITIES_DATA"
                        @data="updateAmenitiesData"
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
            <div class="parking-facility-form-VO" v-else>
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
            <!-- todo: map integration (not decided yet google map or mapbox) -->
            <AtomButton class="is-pulled-right">Save Profile</AtomButton>
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
import { mapState } from 'vuex';
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
            model: {
                buildingAddr: '',
                totalParking: '',
                landmark: '',
                parkingSpotImg: null,
            },
            validation: {
                buildingAddr: 'required',
                totalParking: '',
                parkingSpotImg: '',
                landmark: '',
                parkingType: '',
            },
        };
    },
    computed: {
        ...mapState('user', {
            userType: (state) => state.userProfile.Type,
        }),
    },
    methods: {
        updateParkingSpotImg(data) {
            this.model.parkingSpotImg = data;
        },

        updateAmenitiesData(amenitiesData) {
            // todo
            console.log(amenitiesData);
        },

        updateType(typeData) {
            // todo
            console.log(typeData);
        },

        updateMinDur(minDur) {
            // todo
            console.log(minDur);
        },

        updateCarType(carType) {
            // todo
            console.log(carType);
        },
    },
};
</script>
<style lang="scss" scoped>
.parking-facility-header {
    margin-bottom: 32px;
    padding: 20px 32px;
    background-color: var(--secondary-color);

    h1 {
        font-size: 24px;
        font-weight: 600;
        color: var(--parkspot-black);
    }

    h2 {
        font-size: 14px;
        color: #e8faff;
    }
}

.parking-facility-form {
    padding: 0 32px;
}
</style>
