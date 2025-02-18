<template>
    <Form @submit="submitForm" :validation-schema="contactFormSchema">
        <FormInput
            :name="'fullname'"
            :label="CONTACT_FORM.FULLNAME"
            :placeholder="CONTACT_FORM.FULLNAME"
            v-model="model.fullname"
        />

        <FormInput
            :name="'email'"
            :label="CONTACT_FORM.EMAIL"
            :placeholder="CONTACT_FORM.EMAIL"
            type="email"
            v-model="model.email"
        />

        <FormInput
            :name="'cno'"
            :label="CONTACT_FORM.CONTACT_NO"
            :placeholder="CONTACT_FORM.CONTACT_NO"
            v-model="model.cno"
        />

        <FormInput
            :name="'addr'"
            :label="'Address'"
            :placeholder="'Enter your address'"
            v-if="isEnable"
            v-model="model.addr"
        />

        <div v-if="textArea">
            <AtomTextarea
                :name="'msg'"
                :label="'Message'"
                v-model="model.msg"
            />
        </div>
        <button class="send-button" type="submit">
            Submit <AtomIcon class="btn-icon" :icon="'send-outline'"></AtomIcon>
        </button>
    </Form>
</template>

<script>
import { contactFormSchema } from '@/validationSchemas';
import { FORM } from '../../constant/constant';
import { Form } from 'vee-validate';
import { mapMutations } from 'vuex';
import AtomIcon from '@/components/atoms/AtomIcon.vue';
import AtomTextarea from '@/components/atoms/AtomTextarea.vue';
import FormInput from '@/components/global/FormInput.vue';

export default {
    name: 'OrganismContactForm',
    components: {
        AtomTextarea,
        Form,
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
            CONTACT_FORM: FORM,
            contactFormSchema,
            isEnable: false,
            model: {
                addr: '',
                cno: '',
                email: '',
                fullname: '',
                msg: '',
            },
        };
    },
    mounted() {
        this.isEnable = this.$route?.name === 'SOPortal';
    },
    methods: {
        ...mapMutations({
            updateContactForm: 'user/update-contact',
        }),

        submitForm() {
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
