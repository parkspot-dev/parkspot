<template>
    <ValidationObserver ref="observer" v-slot="{}">
        <!-- Contact Form Fields -->
        <div class="form-container">
            <div class="form-row">
                <MoleculeNameInput
                    :rules="validation.fullname"
                    :fieldName="CONTACT_FORM.FULLNAME"
                    v-model="contactModel.fullname"
                    :placeholder="CONTACT_FORM.FULLNAME"
                    :label="CONTACT_FORM.FULLNAME"
                >
                </MoleculeNameInput>
                <MoleculeNameInput
                    :rules="validation.cno"
                    :fieldName="CONTACT_FORM.CONTACT_NO"
                    v-model="contactModel.cno"
                    :placeholder="CONTACT_FORM.CONTACT_NO"
                    :label="CONTACT_FORM.CONTACT_NO"
                >
                </MoleculeNameInput>
            </div>
            <AtomInput
                v-model="contactModel.email"
                :placeholder="CONTACT_FORM.EMAIL"
                :type="'email'"
                :label="CONTACT_FORM.EMAIL"
            ></AtomInput>
            <div class="form-row">
                <!-- Preference Form Fields -->
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
                    class="min-duration-input"
                ></MoleculeSelectInput>
            </div>
            <MoleculeNameInput
                :fieldName="PREFERENCE.MODEL"
                :placeholder="PREFERENCE.MODEL"
                :rules="validation.carModel"
                v-model="preferenceModel.carModel"
                :label="PREFERENCE.MODEL"
                class="car-modal-input"
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
import { ValidationObserver } from 'vee-validate';
import MoleculeNameInput from '../molecules/MoleculeNameInput.vue';
import MoleculeSelectInput from '../molecules/MoleculeSelectInput.vue';
import MoleculeCheckbox from '../molecules/MoleculeCheckbox.vue';
import AtomInput from '../atoms/AtomInput.vue';
import { ADD_INFO, PREFERENCE, FORM } from '../../constant/constant';
import { mapMutations } from 'vuex';
import AtomButton from '../atoms/AtomButton.vue';
import AtomIcon from '../atoms/AtomIcon.vue';

export default {
    name: 'ParkingRequestForm',
    components: {
        ValidationObserver,
        MoleculeNameInput,
        MoleculeSelectInput,
        MoleculeCheckbox,
        AtomInput,
        AtomButton,
        AtomIcon,
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
                .catch((err) => console.log('Error while submitting form', err));
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
    width: 100%;
    flex-direction: row;
    gap: 1rem;
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
}

.cta-btn {
    width: 100%;
    background-color: var(--primary-color);
}

.btn-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.15rem;
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
