<template>
    <VeeForm
        :validation-schema="registerSpotRequestFormSchema"
        @submit="submitForm"
    >
        <div class="form-row">
            <FormInput
                v-model="contactModel.fullname"
                :label="FORM.FULLNAME"
                :placeholder="FORM_PLACEHOLDERS.FULL_NAME"
                name="fullname"
                required
            />
            <FormInput
                v-model="contactModel.cno"
                :label="FORM.CONTACT_NO"
                :placeholder="FORM_PLACEHOLDERS.CONTACT_NO"
                name="cno"
                required
                type="tel"
            />
        </div>

        <div class="form-row">
            <FormInput
                v-model="contactModel.email"
                :label="FORM.EMAIL"
                :placeholder="FORM_PLACEHOLDERS.EMAIL"
                name="email"
                required
                type="email"
            />

            <FormInput
                v-model="contactModel.mapsLink"
                :label="FORM.GOOGLE_MAP_LINK"
                name="mapsLink"
                :placeholder="FORM_PLACEHOLDERS.GOOGLE_MAP_LINK"
                type="url"
            />
        </div>

        <div class="form-row">
            <FormInput
                v-model="contactModel.ApartmentName"
                :label="FORM.APARTMENT"
                :placeholder="FORM_PLACEHOLDERS.APARTMENT"
                name="apartment"
            />
            <FormInput
                v-model="contactModel.address"
                :label="FORM.ADDRESS"
                :placeholder="FORM_PLACEHOLDERS.ADDRESS"
                name="address"
                required
            />
        </div>

        <div class="form-row">
            <div class="form-column">
                <FormInput
                    v-model="contactModel.expectedRent"
                    :label="FORM.BASEAMOUNT"
                    min="0"
                    name="expectedRent"
                    :placeholder="FORM_PLACEHOLDERS.BASE_AMOUNT"
                    type="number"
                />
            </div>
            <SelectInput
                v-model="parkingSizeLabel"
                :list="parkingSizeLabels"
                label="Parking Size"
                name="parkingSize"
                @change="updateParkingSizeLabel"
            />
        </div>

        <div class="form-row">
            <div>
                <MultiSelectInput
                    v-model="contactModel.facilities"
                    :list="facilityOptions"
                    placeholder="Select one or more facilities"
                    label="Facilities"
                    name="facilities"
                />
            </div>

            <SelectInput
                v-model="contactModel.city"
                :list="citiesOptions"
                label="Select City"
                name="city"
                @change="updateSelectedCity"
            />
        </div>

        <div class="form-row">
            <div class="upload-images">
                <label class="label-input">Upload Images</label>
                <ImageUpload v-model:images="contactModel.images" />
            </div>
        </div>
        <CheckboxInput :label="termData" name="terms" @update="updateTermsData">
            <template #extra>
                <a
                    href="https://www.parkspot.in/terms-and-conditions"
                    target="_blank"
                    >Terms and Conditions</a
                >
            </template>
        </CheckboxInput>
        <button class="send-button" type="submit">
            Submit
            <AtomIcon class="btn-icon" icon="send-outline" />
        </button>
    </VeeForm>
</template>

<script>
import {
    ADD_INFO,
    FORM,
    PARKING_FACILITY,
    FORM_PLACEHOLDERS,
    CITY_OPTIONS,
} from '@/constant/constant';
import MultiSelectInput from '@/components/global/MultiSelectInput.vue';
import ImageUpload from '@/components/global/ImageUpload.vue';
import AtomIcon from '@/components/atoms/AtomIcon.vue';
import CheckboxInput from '@/components/global/CheckBoxInput.vue';
import FormInput from '@/components/global/FormInput.vue';
import SelectInput from '@/components/global/SelectInput.vue';
import { registerSpotRequestFormSchema } from '@/validationSchemas';
import { mapMutations } from 'vuex';
import { ParkingSizeDisplayMap, ParkingSizeLabels } from '@/constant/constant';
import { Form as VeeForm } from 'vee-validate';
import { SiteType } from '@/constant/enums';

export default {
    name: 'RegisterRequestForm',
    components: {
        AtomIcon,
        CheckboxInput,
        VeeForm,
        FormInput,
        SelectInput,
        ImageUpload,
        MultiSelectInput,
    },
    emits: ['submitForm'],
    data() {
        return {
            registerSpotRequestFormSchema,
            parkingSizeLabel: '',
            parkingSizeLabels: ParkingSizeLabels,
            facilityOptions: [...PARKING_FACILITY.SO.FACILITIES_DATA],
            contactModel: {
                fullname: '',
                cno: '',
                email: '',
                address: '',
                ApartmentName: '',
                parkingSize: 0, // Initally Undefined
                expectedRent: '',
                facilities: [],
                mapsLink: '',
                images: [],
                isTermsAccepted: false,
                siteType: SiteType.Register, // pass as default
                city: '',
            },
            FORM,
            FORM_PLACEHOLDERS,
            ADD_INFO,
            termData: ADD_INFO.TERMS_DATA,
            citiesOptions: CITY_OPTIONS,
        };
    },
    methods: {
        ...mapMutations({
            updateContact: 'user/update-contact',
        }),
        updateParkingSizeLabel(event) {
            const newVal = event?.target?.value;
            this.contactModel.parkingSize =
                ParkingSizeDisplayMap[newVal] ?? null;
        },

        updateSelectedCity(event) {
            const newVal = event?.target?.value;
            this.contactModel.city = newVal;
        },

        updateTermsData(val) {
            this.contactModel.isTermsAccepted = val;
        },

        submitForm() {
            this.updateContact(this.contactModel);
            this.$emit('submitForm', this.contactModel);
        },
    },
};
</script>
<style lang="scss" scoped>
.btn-icon {
    font-size: 1.25rem;
}
.form-column {
    display: flex;
    flex-direction: column;
}
.form-row {
    display: flex;
    flex-direction: row;
    gap: 1.2rem;
}
.form-row > * {
    width: 50%;
}
.label-input {
    font-size: 14px;
    font-weight: 500;
}
.upload-images {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-top: 1rem;
}
@media (max-width: 768px) {
    .form-row {
        flex-direction: column;
        gap: 0.4rem;
    }

    .form-row > * {
        width: 100%;
    }
}
</style>
