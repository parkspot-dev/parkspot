<template>
    <ValidationObserver ref="observer" v-slot="{}">
        <!-- Contact Form Fields -->
        <div class="form-container">
            <div class="form-row">
                <MoleculeNameInput
                    :rules="validation.fullname"
                    :fieldName="CONTACT_FORM.FULLNAME"
                    v-model="model.fullname"
                    :placeholder="CONTACT_FORM.FULLNAME"
                    :label="CONTACT_FORM.FULLNAME"
                ></MoleculeNameInput>
                <AtomInput
                    v-model="model.email"
                    :placeholder="CONTACT_FORM.EMAIL"
                    :type="'email'"
                    :label="CONTACT_FORM.EMAIL"
                ></AtomInput>
            </div>
            <MoleculeNameInput
                :rules="validation.cno"
                :fieldName="CONTACT_FORM.CONTACT_NO"
                v-model="model.cno"
                :placeholder="CONTACT_FORM.CONTACT_NO"
                :label="CONTACT_FORM.CONTACT_NO"
            ></MoleculeNameInput>
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
                ></MoleculeSelectInput>
            </div>
            <MoleculeNameInput
                :fieldName="PREFERENCE.MODEL"
                :placeholder="PREFERENCE.MODEL"
                :rules="validation.carModel"
                v-model="model.carModel"
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
            <AtomButton class="cta-btn" @click.native="sendMsg">
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
    name: 'CombinedForm',
    components: {
        ValidationObserver,
        MoleculeNameInput,
        MoleculeSelectInput,
        MoleculeCheckbox,
        AtomInput,
        AtomButton,
        AtomIcon,
    },
    props: {
        formSubmitted: {
            type: Boolean,
            default: false,
        },
        textArea: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['formValidate'],
    data() {
        return {
            model: {
                fullname: '',
                email: '',
                cno: '',
                addr: '',
                msg: '',
                carModel: '',
                minDur: '',
                terms: '',
            },
            validation: {
                fullname: 'required',
                email: 'required|email',
                cno: 'required|integer|phone',
                addr: 'required|address',
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
    watch: {
        formSubmitted(newVal) {
            if (newVal) {
                this.$refs.observer
                    .validate()
                    .then((isValid) => {
                        this.$emit('formValidate', isValid);
                        if (isValid) {
                            this.submit();
                        }
                    })
                    .catch(console.error);
            }
        },
    },
    mounted() {
        this.isEnable = this.$route.name === 'SOPortal';
    },
    methods: {
        ...mapMutations({
            updateContact: 'user/update-contact',
            updatePreference: 'user/update-preference',
        }),
        submit() {
            this.updateContact(this.model);
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
        display: flex;
        width: 100%;
        flex-direction: column;
        gap: 1rem;
    }

    .form-row > * {
        width: 100%;
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

.car-modal-input{
    margin-top: -20px !important;
}
</style>
