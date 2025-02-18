<template>
    <div ref="observer">
        <MoleculeSelectInput
            :fieldName="PREFERENCE.PARKING_TYPE"
            :list="parkingTypeData"
            :rules="validation.parkingType"
            @input="updateType"
            :placeholder="'Type of Parking'"
            :label="PREFERENCE.PARKING_TYPE"
        ></MoleculeSelectInput>
        <MoleculeSelectInput
            :fieldName="PREFERENCE.DURATION"
            :list="minDurData"
            :rules="validation.minDur"
            @input="updateMinDur"
            :placeholder="'Minimum duration if any'"
            :label="PREFERENCE.DURATION"
        ></MoleculeSelectInput>
        <MoleculeNameInput
            :fieldName="PREFERENCE.MODEL"
            :placeholder="PREFERENCE.MODEL"
            :rules="validation.carModel"
            v-model="model.carModel"
            :label="PREFERENCE.MODEL"
        ></MoleculeNameInput>
        <MoleculeCheckbox
            :fieldName="ADD_INFO.TERMS"
            :rules="validation.terms"
            :values="termData"
            @data="updateTermsData"
        >
            <template v-slot:extra>
                <a
                    href="https://www.parkspot.in/terms-and-conditions"
                    target="_blank"
                    >T&C
                </a>
            </template>
        </MoleculeCheckbox>
    </div>
</template>

<script>
import MoleculeCheckbox from '../molecules/MoleculeCheckbox.vue';
import MoleculeSelectInput from '../molecules/MoleculeSelectInput.vue';
import MoleculeNameInput from '../molecules/MoleculeNameInput.vue';
import { ADD_INFO, PREFERENCE } from '../../constant/constant';
import { mapMutations } from 'vuex';
export default {
    name: 'OrganismPreferenceForm',
    components: {
        MoleculeCheckbox,
        MoleculeSelectInput,
        MoleculeNameInput,
    },
    props: {
        formSubmitted: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['formValidate'],
    data() {
        return {
            ADD_INFO,
            PREFERENCE,
            parkingTypeData: PREFERENCE.PARKING_TYPE_LIST,
            minDurData: ADD_INFO.MINIMUM_DURATION_DATA,
            termData: ADD_INFO.TERMS_DATA,
            model: {
                carModel: '',
                minDur: '',
                terms: '',
            },
            validation: {
                carModel: 'required',
                minDur: 'required',
                terms: 'required',
                parkingType: 'required',
            },
        };
    },
    watch: {
        formSubmitted(newVal) {
            if (newVal) {
                this.$refs.observer
                    .validate()
                    .then((el) => {
                        if (el) {
                            this.submit();
                            this.$emit('formValidate', el);
                        } else {
                            this.$emit('formValidate', el);
                        }
                    })
                    .catch((er) => {
                        console.log(er);
                    });
            }
        },
    },
    methods: {
        ...mapMutations({
            updatePreference: 'user/update-preference',
        }),
        submit() {
            this.updatePreference(this.model);
        },
        updateMinDur(val) {
            this.model.minDur = this.minDurData[val].name;
        },
        updateType(val) {
            this.model.spot = this.parkingTypeData[val].name;
        },
        updateTermsData(data) {
            this.model.terms = data;
        },
    },
};
</script>
<style lang="scss" scoped></style>
