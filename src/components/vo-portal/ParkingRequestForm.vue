<template>
    <Form
        :validation-schema="parkingRequestFormSchema"
        @submit="submitForm"
        class="form-container"
    >
        <div class="form-row">
            <FormInput
                :label="FORM.FULLNAME"
                :placeholder="FORM_PLACEHOLDERS.FULLNAME"
                :name="'fullname'"
                v-model="contactModel.fullname"
            />

            <FormInput
                :label="FORM.CONTACT_NO"
                :placeholder="FORM_PLACEHOLDERS.CONTACT_NO"
                :name="'cno'"
                v-model="contactModel.cno"
            />
        </div>
        <FormInput
            :label="FORM.EMAIL"
            :placeholder="FORM_PLACEHOLDERS.EMAIL"
            :name="'email'"
            type="email"
            v-model="contactModel.email"
        />
        <div class="form-row">
            <SelectInput
                :label="PREFERENCE.PARKING_TYPE"
                :list="parkingTypeData"
                @change="updateType"
                class="parking-type-input"
                name="parkingType"
                v-model="preferenceModel.spot"
            />

            <SelectInput
                :label="PREFERENCE.DURATION"
                :list="minDurData"
                @change="updateMinDur"
                class="min-duration-input"
                name="minDur"
                v-model="preferenceModel.minDur"
            />
        </div>
        <FormInput
            :label="FORM.CAR_MODEL"
            :placeholder="FORM_PLACEHOLDERS.CAR_MODEL"
            :name="'carModel'"
            v-model="preferenceModel.carModel"
        />
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
            Submit <AtomIcon class="btn-icon" :icon="'send-outline'"></AtomIcon>
        </button>
    </Form>
</template>

<script>
import { ADD_INFO, PREFERENCE, FORM, FORM_PLACEHOLDERS } from '../../constant/constant';
import { Form } from 'vee-validate';
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
        Form,
        FormInput,
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
    emits: ['onSubmit'],
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
