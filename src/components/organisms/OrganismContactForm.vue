<template>
    <ValidationObserver ref="observer" v-slot="{}">
        <MoleculeNameInput
            :rules="validation.fullname"
            :fieldName="CONTACT_FORM.FULLNAME"
            v-model="model.fullname"
            :placeholder="CONTACT_FORM.FULLNAME"
            :label="CONTACT_FORM.FULLNAME"
        >
        </MoleculeNameInput>
        <MoleculeNameInput
            :rules="validation.email"
            :fieldName="CONTACT_FORM.EMAIL"
            v-model="model.email"
            :placeholder="CONTACT_FORM.EMAIL"
            :inputType="'email'"
            :label="CONTACT_FORM.EMAIL"
        >
        </MoleculeNameInput>
        <MoleculeNameInput
            :rules="validation.cno"
            :fieldName="CONTACT_FORM.CONTACT_NO"
            v-model="model.cno"
            :placeholder="CONTACT_FORM.CONTACT_NO"
            :label="CONTACT_FORM.CONTACT_NO"
        >
        </MoleculeNameInput>
        <AtomTextarea
            v-if="textArea"
            v-model="model.msg"
            :label="'Message'"
        ></AtomTextarea>
    </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate';
import { FORM } from '../../constant/constant';
import { mapMutations } from 'vuex';
import MoleculeNameInput from '../molecules/MoleculeNameInput.vue';
import AtomTextarea from '../atoms/AtomTextarea.vue';

export default {
    name: 'OrganismContactForm',
    components: {
        ValidationObserver,
        MoleculeNameInput,
        AtomTextarea,
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
                msg: '',
            },
            validation: {
                fullname: 'required',
                email: 'required|email',
                cno: 'required|integer|phone',
            },
            CONTACT_FORM: FORM,
        };
    },
    watch: {
        formSubmitted(newVal) {
            if (newVal) {
                this.$refs.observer
                    .validate()
                    .then((el) => {
                        if (el) {
                            this.submit();
                            this.$emit('formValidate', el);
                        } else {
                            this.$emit('formValidate', el);
                        }
                    })
                    .catch((er) => {
                        console.log(er);
                    });
            }
        },
    },
    methods: {
        ...mapMutations({
            updateContact: 'user/update-contact',
        }),
        submit() {
            this.updateContact(this.model);
        },
        resetForm() {
            this.model.fullname = '';
            this.model.email = '';
            this.model.cno = '';
            requestAnimationFrame(() => {
                this.$refs.observer.reset();
            });
        },
    },
};
</script>

<style></style>
