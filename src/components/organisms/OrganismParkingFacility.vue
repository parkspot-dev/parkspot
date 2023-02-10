<template>
    <div class="parking-facility">
        <div class="parking-facility-header">
            <h1>Parking Facility</h1>
            <h2>Please fill all the field correctly</h2>
        </div>
        <div class="parking-facility-form">
            <div class="py-4">
                <MoleculeNameInput
                    :fieldName="PARKING_FACILITY.BUILDING_ADDR"
                    :placeholder="PARKING_FACILITY.BUILDING_ADDR"
                    :rules="validation.buildingAddr"
                    v-model="model.buildingAddr"
                    :label="PARKING_FACILITY.BUILDING_ADDR"
                ></MoleculeNameInput>
            </div>
            <div class="py-4">
                <MoleculeNameInput
                    :fieldName="PARKING_FACILITY.LANDMARK"
                    :placeholder="PARKING_FACILITY.LANDMARK"
                    :rules="validation.landmark"
                    v-model="model.landmark"
                    :label="PARKING_FACILITY.LANDMARK"
                ></MoleculeNameInput>
                <p>Is there a landmark near the parking spot?</p>
            </div>
            <div class="py-4">
                <MoleculeNameInput
                    :fieldName="PARKING_FACILITY.TOTAL_PARKING"
                    :placeholder="PARKING_FACILITY.TOTAL_PARKING"
                    :rules="validation.totalParking"
                    v-model="model.totalParking"
                    :label="PARKING_FACILITY.TOTAL_PARKING"
                ></MoleculeNameInput>
            </div>
            <div class="py-4">
                <MoleculeCheckbox
                    :fieldName="PARKING_FACILITY.FACILITIES"
                    :rules="validation.amenities"
                    :values="PARKING_FACILITY.FACILITIES_DATA"
                    @data="updateAmenitiesData"
                >
                    {{ PARKING_FACILITY.FACILITIES }}
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
import { PARKING_FACILITY } from '../../constant/constant';
export default {
    name: 'OrganismParkingFacility',
    components: {
        MoleculeNameInput,
        MoleculeCheckbox,
        MoleculeUpload,
        AtomButton,
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
                buildingAddr: '',
                totalParking: '',
                parkingSpotImg: '',
                landmark: '',
            },
        };
    },
    methods: {
        updateParkingSpotImg(data) {
            this.model.parkingSpotImg = data;
        },

        updateAmenitiesData(amenitiesData) {
            console.log(amenitiesData);
        },
    },
};
</script>
<style lang="scss" scoped>
.parking-facility-header {
    background-color: var(--secondary-color);
    padding: 20px 30px;
    margin-bottom: 30px;

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
    padding: 0 30px;
}
</style>