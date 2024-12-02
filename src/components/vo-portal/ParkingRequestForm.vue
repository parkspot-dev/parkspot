<template>
    <ValidationObserver ref="observer" v-slot="{}">
        <!-- Contact Form Fields -->
        <div class="form-container">
            <div class="form-row">
                <MoleculeNameInput
                    :fieldName="CONTACT_FORM.FULLNAME"
                    :label="CONTACT_FORM.FULLNAME"
                    :placeholder="CONTACT_FORM.FULLNAME"
                    :rules="validation.fullname"
                    v-model="contactModel.fullname"
                >
                </MoleculeNameInput>
                <MoleculeNameInput
                    :fieldName="CONTACT_FORM.CONTACT_NO"
                    :label="CONTACT_FORM.CONTACT_NO"
                    :placeholder="CONTACT_FORM.CONTACT_NO"
                    :rules="validation.cno"
                    v-model="contactModel.cno"
                >
                </MoleculeNameInput>
            </div>
            <AtomInput
                :label="CONTACT_FORM.EMAIL"
                :placeholder="CONTACT_FORM.EMAIL"
                :type="'email'"
                v-model="contactModel.email"
            ></AtomInput>
            <div class="form-row">
                <!-- Preference Form Fields -->
                <MoleculeSelectInput
                    :fieldName="PREFERENCE.PARKING_TYPE"
                    :label="PREFERENCE.PARKING_TYPE"
                    :list="parkingTypeData"
                    :placeholder="'Type of Parking'"
                    :rules="validation.parkingType"
                    @input="updateType"
                    class="parking-type-input"
                ></MoleculeSelectInput>
                <MoleculeSelectInput
                    :fieldName="PREFERENCE.DURATION"
                    :label="PREFERENCE.DURATION"
                    :list="minDurData"
                    :placeholder="'Minimum duration if any'"
                    :rules="validation.minDur"
                    @input="updateMinDur"
                    class="min-duration-input"
                ></MoleculeSelectInput>
            </div>
            <MoleculeNameInput
                :fieldName="PREFERENCE.MODEL"
                :label="PREFERENCE.MODEL"
                :placeholder="PREFERENCE.MODEL"
                :rules="validation.carModel"
                class="car-modal-input"
                v-model="preferenceModel.carModel"
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
                        >T&C</a
                    >
                </template>
            </MoleculeCheckbox>
            <AtomButton class="cta-btn" @click.native="submit">
                <span class="btn-wrap">
                    <span class="btn-text"> Send </span>
                    <AtomIcon
                        class="btn-icon"
                        :icon="'send-outline'"
                    ></AtomIcon>
                </span>
            </AtomButton>
        </div>
    </ValidationObserver>
</template>

<script>
import AtomButton from '../atoms/AtomButton.vue';
import MoleculeCheckbox from '../molecules/MoleculeCheckbox.vue';
import { ADD_INFO, PREFERENCE, FORM } from '../../constant/constant';
import { mapMutations } from 'vuex';
import { ValidationObserver } from 'vee-validate';
import AtomIcon from '../atoms/AtomIcon.vue';
import AtomInput from '../atoms/AtomInput.vue';
import MoleculeNameInput from '../molecules/MoleculeNameInput.vue';
import MoleculeSelectInput from '../molecules/MoleculeSelectInput.vue';

export default {
    name: 'ParkingRequestForm',
    components: {
        AtomButton,
        AtomIcon,
        AtomInput,
        MoleculeCheckbox,
        MoleculeNameInput,
        MoleculeSelectInput,
        ValidationObserver,
    },
    data() {
        return {
            contactModel: {
                fullname: '',
                email: '',
                cno: '',
            },
            preferenceModel: {
                carModel: '',
                minDur: '',
                terms: '',
            },
            validation: {
                fullname: 'required',
                email: 'required|email',
                cno: 'required|integer|phone',
                carModel: 'required',
                minDur: 'required',
                terms: 'required',
                parkingType: 'required',
            },
            CONTACT_FORM: FORM,
            PREFERENCE,
            ADD_INFO,
            parkingTypeData: PREFERENCE.PARKING_TYPE_LIST,
            minDurData: ADD_INFO.MINIMUM_DURATION_DATA,
            termData: ADD_INFO.TERMS_DATA,
            isEnable: false,
        };
    },
    emits: ['onSubmit'],
    methods: {
        ...mapMutations({
            updateContact: 'user/update-contact',
            updatePreference: 'user/update-preference',
        }),
        submit() {
            this.$refs.observer
                .validate()
                .then((ele) => {
                    if (ele) {
                        this.updateContact(this.contactModel);
                        this.updatePreference(this.preferenceModel);
                        this.$emit('onSubmit');
                    }
                })
                .catch((err) =>
                    console.log('Error while submitting form', err),
                );
        },
        updateMinDur(val) {
            this.preferenceModel.minDur = this.minDurData[val].name;
        },
        updateType(val) {
            this.preferenceModel.spot = this.parkingTypeData[val].name;
        },
        updateTermsData(data) {
            this.preferenceModel.terms = data;
        },
    },
};
</script>

<style lang="scss" scoped>
.form-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem !important;
}

.form-row {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    width: 100%;
}

.form-row > * {
    width: 50%;
}

@media (max-width: 768px) {
    .form-row {
        flex-direction: column;
    }

    .form-row > * {
        width: 100%;
    }
}

.car-modal-input {
    margin-top: -20px !important;
}

.min-duration-input {
    margin-top: 0px !important;
}

@media (max-width: 768px) {
    .min-duration-input {
        margin-top: -20px !important;
    }

    .parking-type-input{
        margin-top: 4px;
    }
}

.cta-btn {
    background-color: var(--primary-color);
    margin-top: -20px;
    width: 100%;
}

.btn-wrap {
    align-items: center;
    display: flex;
    justify-content: center;
}

.btn-text {
    font-weight: var(--semi-bold-font);
    letter-spacing: -1px;
}

.btn-icon {
    font-size: 1.25rem;
    transform: rotate(316deg);
}
</style>
