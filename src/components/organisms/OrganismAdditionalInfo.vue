<template>
    <div ref="observer">
        <MoleculeCheckbox
            :field-name="ADD_INFO.AMENITIES"
            :rules="validation.amenities"
            :values="checkboxData"
            @data="updateAmenitiesData"
        >
            {{ ADD_INFO.AMENITIES }}
        </MoleculeCheckbox>
        <MoleculeSelectInput
            :field-name="ADD_INFO.SPOTS"
            :list="spotData"
            :rules="validation.spot"
            :placeholder="'Please specify the no. of Spot'"
            :label="ADD_INFO.SPOTS"
            @input="updateSpot"
        ></MoleculeSelectInput>
        <MoleculeSelectInput
            :field-name="ADD_INFO.MINIMUM_DURATION"
            :list="minDurData"
            :rules="validation.minDur"
            :placeholder="'Minimum duration if any'"
            :label="ADD_INFO.MINIMUM_DURATION"
            @input="updateMinDur"
        ></MoleculeSelectInput>
        <MoleculeNameInput
            v-model="model.rent"
            :field-name="ADD_INFO.RENT"
            :placeholder="ADD_INFO.RENT"
            :rules="validation.rent"
            :label="ADD_INFO.RENT"
        ></MoleculeNameInput>
        <MoleculeCheckbox
            :field-name="ADD_INFO.TERMS"
            :rules="validation.terms"
            :values="termData"
            @data="updateTermsData"
        >
            <template #extra>
                <p class="custom-terms">
                    <a
                        href="https://www.parkspot.in/terms-and-conditions"
                        target="_blank"
                        >T&C</a
                    >
                </p>
            </template>
        </MoleculeCheckbox>
    </div>
</template>

<script>
import MoleculeCheckbox from '../molecules/MoleculeCheckbox.vue';
import MoleculeSelectInput from '../molecules/MoleculeSelectInput.vue';
import MoleculeNameInput from '../molecules/MoleculeNameInput.vue';
import { ADD_INFO } from '../../constant/constant';
import { mapMutations } from 'vuex';
export default {
    name: 'OrganismAdditionalInfo',
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
            checkboxData: ADD_INFO.AMENITIES_DATA,
            spotData: ADD_INFO.SPOTS_DATA,
            minDurData: ADD_INFO.MINIMUM_DURATION_DATA,
            termData: ADD_INFO.TERMS_DATA,
            model: {
                amenities: '',
                spot: '',
                minDur: '',
                rent: '',
                terms: '',
            },
            validation: {
                amenities: 'required',
                spot: 'required',
                minDur: 'required',
                rent: 'required|integer',
                terms: 'required',
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
            updateAddInfo: 'user/update-additional-info',
        }),
        submit() {
            this.updateAddInfo(this.model);
        },
        updateMinDur(index) {
            this.model.minDur = this.minDurData[index].name;
        },
        updateSpot(index) {
            this.model.spot = this.spotData[index].name;
        },
        updateAmenitiesData(data) {
            this.model.amenities = data;
        },
        updateTermsData(data) {
            this.model.terms = data;
        },
    },
};
</script>
<style lang="scss" scoped>
.custom-terms {
    position: absolute;
    top: -2px;
    left: 111px;
}
</style>
