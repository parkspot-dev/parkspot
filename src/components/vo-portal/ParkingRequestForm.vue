<template>
    <VeeForm
        :validation-schema="parkingRequestFormSchema"
        class="form-container"
        @submit="submitForm"
    >
        <div class="form-row">
            <FormInput
                v-model="contactModel.fullname"
                :label="FORM.FULLNAME"
                :placeholder="FORM_PLACEHOLDERS.FULL_NAME"
                :name="'fullname'"
            />

            <FormInput
                v-model="contactModel.cno"
                :label="FORM.CONTACT_NO"
                :placeholder="FORM_PLACEHOLDERS.CONTACT_NO"
                :name="'cno'"
            />
        </div>
        <FormInput
            v-model="contactModel.email"
            :label="FORM.EMAIL"
            :placeholder="FORM_PLACEHOLDERS.EMAIL"
            :name="'email'"
            type="email"
        />
        <div class="form-row">
            <SelectInput
                v-model="preferenceModel.spot"
                :label="PREFERENCE.PARKING_TYPE"
                :list="parkingTypeData"
                class="parking-type-input"
                name="parkingType"
                @change="updateType"
            />

            <SelectInput
                v-model="preferenceModel.minDur"
                :label="PREFERENCE.DURATION"
                :list="minDurData"
                class="min-duration-input"
                name="minDur"
                @change="updateMinDur"
            />
        </div>
        <FormInput
            v-model="preferenceModel.carModel"
            :label="FORM.CAR_MODEL"
            :placeholder="FORM_PLACEHOLDERS.CAR_MODEL"
            :name="'carModel'"
        />
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
            Submit <AtomIcon class="btn-icon" :icon="'send-outline'"></AtomIcon>
        </button>
    </VeeForm>
</template>

<script>
import { ADD_INFO, PREFERENCE, FORM, FORM_PLACEHOLDERS } from '@/constant/constant';
import { Form as VeeForm } from 'vee-validate';
import { mapMutations } from 'vuex';
import { parkingRequestFormSchema } from '@/validationSchemas';
import AtomIcon from '@/components/atoms/AtomIcon.vue';
import CheckboxInput from '@/components/global/CheckBoxInput.vue';
import FormInput from '@/components/global/FormInput.vue';
import SelectInput from '@/components/global/SelectInput.vue';
export default {
    name: 'ParkingRequestForm',
    components: {
        AtomIcon,
        CheckboxInput,
        VeeForm,
        FormInput,
        SelectInput,
    },
    emits: ['onSubmit'],
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
                minDur: ADD_INFO.MINIMUM_DURATION_DATA.length
                    ? ADD_INFO.MINIMUM_DURATION_DATA[0].name
                    : '',
                spot: PREFERENCE.PARKING_TYPE_LIST.length
                    ? PREFERENCE.PARKING_TYPE_LIST[0].name
                    : '',
                terms: '',
            },
            FORM,
            FORM_PLACEHOLDERS,
            PREFERENCE,
            ADD_INFO,
            parkingTypeData: PREFERENCE.PARKING_TYPE_LIST.map(
                (item) => item.name,
            ),
            minDurData: ADD_INFO.MINIMUM_DURATION_DATA.map((item) => item.name),
            termData: ADD_INFO.TERMS_DATA,
            isEnable: false,
        };
    },
    methods: {
        ...mapMutations({
            updateContact: 'user/update-contact',
            updatePreference: 'user/update-preference',
        }),

        submitForm() {
            this.updateContact(this.contactModel);
            this.updatePreference(this.preferenceModel);
            this.$emit('onSubmit');
        },
        updateMinDur(event) {
            this.preferenceModel.minDur = event?.target?.value;
        },
        updateType(event) {
            this.preferenceModel.spot = event?.target?.value;;
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
    gap: 1rem;
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
    .form-container {
        gap: 1rem;
    }

    .form-row {
        flex-direction: column;
        gap: 1rem;
    }

    .form-row > * {
        width: 100%;
    }
}

.car-modal-input,
.min-duration-input,
.parking-type-input {
    margin-top: 0 !important;
}

.cta-btn {
    background-color: var(--primary-color);
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
