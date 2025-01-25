<template>
    <Form
        :validation-schema="parkingRequestFormSchema"
        @submit="submitForm"
        class="form-container"
    >
        <div class="form-row">
            <FormInput
                :label="CONTACT_FORM.FULLNAME"
                :placeholder="CONTACT_FORM.FULLNAME"
                fieldname="fullname"
                v-model="contactModel.fullname"
            />

            <FormInput
                :label="CONTACT_FORM.CONTACT_NO"
                :placeholder="CONTACT_FORM.CONTACT_NO"
                fieldname="cno"
                v-model="contactModel.cno"
            />
        </div>
        <FormInput
            :label="CONTACT_FORM.EMAIL"
            :placeholder="CONTACT_FORM.EMAIL"
            fieldname="email"
            type="email"
            v-model="contactModel.email"
        />
        <div class="form-row">
            <SelectInput
                :label="PREFERENCE.PARKING_TYPE"
                :list="parkingTypeData"
                :placeholder="PREFERENCE.PARKING_TYPE"
                @update:modelValue="updateType"
                class="parking-type-input"
                name="parkingType"
                v-model="preferenceModel.spot"
            />

            <SelectInput
                :label="PREFERENCE.DURATION"
                :list="minDurData"
                :placeholder="PREFERENCE.DURATION"
                @update:modelValue="updateMinDur"
                class="min-duration-input"
                name="minDur"
                v-model="preferenceModel.minDur"
            />
        </div>
        <FormInput
            :label="PREFERENCE.MODEL"
            :placeholder="PREFERENCE.MODEL"
            fieldname="carModel"
            v-model="preferenceModel.carModel"
        />
        <button class="send-button" type="submit">
            Submit <AtomIcon class="btn-icon" :icon="'send-outline'"></AtomIcon>
        </button>
    </Form>
</template>

<script>
import { ADD_INFO, PREFERENCE, FORM } from '../../constant/constant';
import { Form } from 'vee-validate';
import { mapMutations } from 'vuex';
import { parkingRequestFormSchema } from '@/validationSchemas';
import AtomIcon from '../atoms/AtomIcon.vue';
import AtomInput from '../atoms/AtomInput.vue';
import FormInput from '@/components/global/FormInput.vue';
import MoleculeCheckbox from '../molecules/MoleculeCheckbox.vue';
import SelectInput from '@/components/global/SelectInput.vue';

export default {
    name: 'ParkingRequestForm',
    components: {
        AtomIcon,
        AtomInput,
        Form,
        FormInput,
        MoleculeCheckbox,
        SelectInput,
    },
    data() {
        return {
            parkingRequestFormSchema,
            contactModel: {
                cno: '',
                email: '',
                fullname: '',
            },
            preferenceModel: {
                carModel: '',
                minDur: '',
                spot: '',
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

        submitForm(values) {
            console.log('Submiting form', values);
            console.log(this.contactModel, this.preferenceModel);
            parkingRequestFormSchema.parse().then((val) => console.log(val));
            // this.updateContact(this.contactModel);
            // this.updatePreference(this.preferenceModel);
            // this.$emit('onSubmit');
        },
        updateMinDur(val) {
            this.preferenceModel.minDur = val;
        },
        updateType(val) {
            this.preferenceModel.spot = val;
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

    .parking-type-input {
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
