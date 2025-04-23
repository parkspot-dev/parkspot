<template>
    <Form
        :validation-schema="registerSpotRequestFormSchema"
        @submit="submitForm"
    >
        <div class="form-row">
            <FormInput
                :label="CONTACT_FORM.FULLNAME"
                :placeholder="CONTACT_FORM.FULLNAME"
                name="fullname"
                required
                v-model="contactModel.fullname"
            />
            <FormInput
                :label="CONTACT_FORM.CONTACT_NO"
                :placeholder="CONTACT_FORM.CONTACT_NO"
                name="cno"
                required
                type="tel"
                v-model="contactModel.cno"
            />
        </div>

        <div class="form-row">
            <FormInput
                :label="CONTACT_FORM.EMAIL"
                :placeholder="CONTACT_FORM.EMAIL"
                name="email"
                required
                type="email"
                v-model="contactModel.email"
            />

            <FormInput
                label="Google Maps Link"
                name="mapsLink"
                placeholder="Maps URL"
                type="url"
                v-model="contactModel.mapsLink"
            />
        </div>

        <div class="form-row">
            <FormInput
                :label="CONTACT_FORM.APARTMENT"
                :placeholder="CONTACT_FORM.APARTMENT"
                name="apartment"
                v-model="contactModel.apartment"
            />
            <FormInput
                :label="CONTACT_FORM.ADDRESS"
                :placeholder="CONTACT_FORM.ADDRESS"
                name="address"
                required
                v-model="contactModel.address"
            />
        </div>

        <div class="form-row">
            <div class="form-column">
                <FormInput
                    :label="CONTACT_FORM.BASEAMOUNT"
                    min="0"
                    name="expectedRent"
                    placeholder="₹"
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
import { ADD_INFO, FORM, PARKING_FACILITY } from '@/constant/constant';
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
            isTermsAccepted: false,
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
                terms: false
            },
            CONTACT_FORM: FORM,
            ADD_INFO,
            termData: ADD_INFO.TERMS_DATA,
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

        updateTermsData(val) {
            this.contactModel.terms = val;
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
