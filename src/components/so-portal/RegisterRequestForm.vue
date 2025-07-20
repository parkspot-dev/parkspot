<template>
    <Form
        :validation-schema="registerSpotRequestFormSchema"
        @submit="submitForm"
    >
        <div class="form-row">
            <FormInput
                :label="FORM.FULLNAME"
                :placeholder="FORM_PLACEHOLDERS.FULL_NAME"
                name="fullname"
                required
                v-model="contactModel.fullname"
            />
            <FormInput
                :label="FORM.CONTACT_NO"
                :placeholder="FORM_PLACEHOLDERS.CONTACT_NO"
                name="cno"
                required
                type="tel"
                v-model="contactModel.cno"
            />
        </div>

        <div class="form-row">
            <FormInput
                :label="FORM.EMAIL"
                :placeholder="FORM_PLACEHOLDERS.EMAIL"
                name="email"
                required
                type="email"
                v-model="contactModel.email"
            />

            <FormInput
                :label="FORM.GOOGLE_MAP_LINK"
                name="mapsLink"
                :placeholder="FORM_PLACEHOLDERS.GOOGLE_MAP_LINK"
                type="url"
                v-model="contactModel.mapsLink"
            />
        </div>

        <div class="form-row">
            <FormInput
                :label="FORM.APARTMENT"
                :placeholder="FORM_PLACEHOLDERS.APARTMENT"
                name="apartment"
                v-model="contactModel.apartment"
            />
            <FormInput
                :label="FORM.ADDRESS"
                :placeholder="FORM_PLACEHOLDERS.ADDRESS"
                name="address"
                required
                v-model="contactModel.address"
            />
        </div>

        <div class="form-row">
            <div class="form-column">
                <FormInput
                    :label="FORM.BASEAMOUNT"
                    min="0"
                    name="expectedRent"
                    :placeholder="FORM_PLACEHOLDERS.BASE_AMOUNT"
                    type="number"
                    v-model="contactModel.expectedRent"
                />
            </div>
            <SelectInput
                :list="parkingSizeLabels"
                @change="updateParkingSizeLabel"
                label="Parking Size"
                name="parkingSize"
                v-model="parkingSizeLabel"
            />
        </div>

        <div class="form-row">
            <div>
                <MultiSelectInput
                    :list="facilityOptions"
                    placeholder="Select one or more facilities"
                    label="Facilities"
                    name="facilities"
                    v-model="contactModel.facilities"
                />
            </div>

            <SelectInput
                :list="citiesOptions"
                @change="updateSelectedCity"
                label="Select City"
                name="city"
                v-model="contactModel.city"
            />
        </div>

        <div class="form-row">
            <div class="upload-images">
                <label class="label-input">Upload Images</label>
                <ImageUpload v-model:images="contactModel.images" />
            </div>
        </div>
        <CheckboxInput :label="termData" @update="updateTermsData" name="terms">
            <template v-slot:extra>
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
    </Form>
</template>

<script>
import { ADD_INFO, FORM, PARKING_FACILITY, FORM_PLACEHOLDERS, CITY_OPTIONS } from '@/constant/constant';
import MultiSelectInput from '@/components/global/MultiSelectInput.vue';
import ImageUpload from '@/components/global/ImageUpload.vue';
import AtomIcon from '@/components/atoms/AtomIcon.vue';
import CheckboxInput from '@/components/global/CheckBoxInput.vue';
import FormInput from '@/components/global/FormInput.vue';
import SelectInput from '@/components/global/SelectInput.vue';
import { registerSpotRequestFormSchema } from '@/validationSchemas';
import { mapMutations } from 'vuex';
import { ParkingSizeDisplayMap, ParkingSizeLabels } from '@/constant/constant';
import { Form } from 'vee-validate'; 
import { SiteType } from '@/constant/enums';

export default {
    name: 'RegisterRequestForm',
    components: {
        AtomIcon,
        CheckboxInput,
        Form,
        FormInput,
        SelectInput,
        ImageUpload,
        MultiSelectInput,
    },
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
                apartment: '',
                parkingSize: 0, // Initally Undefined
                expectedRent: '',
                facilities: [],
                mapsLink: '',
                images: [],
                isTermsAccepted: false,
                siteType: SiteType.Register,  // pass as default
                city: ''
            },
            FORM,
            FORM_PLACEHOLDERS,
            ADD_INFO,
            termData: ADD_INFO.TERMS_DATA,
            citiesOptions: CITY_OPTIONS
        };
    },
    emits: ['submitForm'],
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
