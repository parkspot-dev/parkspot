<template>
    <VeeForm
        :validation-schema="contactFormSchema"
        @submit="submitForm"
        @invalid-submit="onInvalidSubmit"
        @focusout.capture="onFieldBlur"
    >
        <FormInput
            v-model="model.fullname"
            :name="'fullname'"
            :label="FORM.FULLNAME"
            :placeholder="FORM_PLACEHOLDERS.FULL_NAME"
        />

        <FormInput
            v-model="model.email"
            :name="'email'"
            :label="FORM.EMAIL"
            :placeholder="FORM_PLACEHOLDERS.EMAIL"
            type="email"
        />

        <FormInput
            v-model="model.cno"
            :name="'cno'"
            :label="FORM.CONTACT_NO"
            :placeholder="FORM_PLACEHOLDERS.CONTACT_NO"
        />

        <FormInput
            v-if="isEnable"
            v-model="model.addr"
            :name="'addr'"
            :label="FORM.ADDRESS"
            :placeholder="FORM_PLACEHOLDERS.ADDRESS"
        />

        <div v-if="textArea">
            <AtomTextarea
                v-model="FORM_PLACEHOLDERS.MESSAGE"
                :name="'msg'"
                :label="FORM.MESSAGE"
            />
        </div>
        <button class="send-button" type="submit">
            Submit <AtomIcon class="btn-icon" :icon="'send-outline'"></AtomIcon>
        </button>
    </VeeForm>
</template>

<script>
import { contactFormSchema } from '@/validationSchemas';
import { FORM, FORM_PLACEHOLDERS } from '@/constant/constant';
import { Form as VeeForm } from 'vee-validate';
import { mapMutations } from 'vuex';
import AtomIcon from '@/components/atoms/AtomIcon.vue';
import AtomTextarea from '@/components/atoms/AtomTextarea.vue';
import FormInput from '@/components/global/FormInput.vue';
import { track, EVENTS } from '@/lib/analytics';

const FUNNEL_NAME = 'contact';

export default {
    name: 'OrganismContactForm',
    components: {
        AtomTextarea,
        VeeForm,
        FormInput,
        AtomIcon,
    },
    props: {
        textArea: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['submitForm'],
    data() {
        return {
            FORM: FORM,
            FORM_PLACEHOLDERS: FORM_PLACEHOLDERS,
            contactFormSchema,
            isEnable: false,
            model: {
                addr: '',
                cno: '',
                email: '',
                fullname: '',
                msg: '',
            },
            // Funnel-C instrumentation: gates `form_start` to the first
            // non-empty blur per form lifetime. Reset on remount.
            formStarted: false,
        };
    },
    mounted() {
        this.isEnable = this.$route?.name === 'SOPortal';
        // Step 1 — Funnel C entry marker. Fires whenever the contact
        // form mounts; multiple host pages embed this organism (Home,
        // BlogPost, ContactUs, AutomateParking) so Funnel C view counts
        // are aggregated across them, which matches the spec.
        track(EVENTS.FUNNEL_VIEW, {
            funnel_name: FUNNEL_NAME,
            step_index: 1,
        });
    },
    methods: {
        ...mapMutations({
            updateContactForm: 'user/update-contact',
        }),

        // Step 2 — first non-empty blur on any form field.
        onFieldBlur(event) {
            if (this.formStarted) return;
            const target = event && event.target;
            if (!target) return;
            const value =
                typeof target.value === 'string' ? target.value.trim() : '';
            if (!value) return;
            this.formStarted = true;
            track(EVENTS.FORM_START, {
                funnel_name: FUNNEL_NAME,
                step_index: 2,
            });
        },

        // Step 3 — vee-validate fires this on submit when the schema fails.
        onInvalidSubmit({ errors }) {
            const errorFields = Object.keys(errors || {}).join(',');
            track(EVENTS.FORM_ERROR, {
                funnel_name: FUNNEL_NAME,
                step_index: 3,
                error_fields: errorFields,
            });
        },

        submitForm() {
            // Step 4 — vee-validate calls this only when the schema is valid.
            track(EVENTS.FORM_SUBMIT_ATTEMPT, {
                funnel_name: FUNNEL_NAME,
                step_index: 4,
            });
            this.updateContactForm(this.model);
            this.$emit('submitForm');
        },
    },
};
</script>

<style>
.error {
    color: red;
    font-size: 0.875em;
}

.send-button {
    align-items: center;
    background-color: var(--primary-color);
    border-radius: 5px;
    border: none;
    cursor: pointer;
    display: flex;
    font-size: 16px;
    font-weight: var(--semi-bold-font);
    gap: 8px;
    margin: 16px auto;
    padding: 10px 20px;
    transition:
        background 0.3s,
        transform 0.2s;
}

.btn-icon {
    font-size: 18px;
    transform: rotate(316deg);
}
</style>
