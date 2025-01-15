<template>
    <div ref="observer">
        <MoleculeNameInput
            :rules="validation.fullname"
            :fieldName="CONTACT_FORM.FULLNAME"
            v-model="model.fullname"
            :placeholder="CONTACT_FORM.FULLNAME"
            :label="CONTACT_FORM.FULLNAME"
        >
        </MoleculeNameInput>
        <AtomInput
            v-model="model.email"
            :placeholder="CONTACT_FORM.EMAIL"
            :type="'email'"
            :label="CONTACT_FORM.EMAIL"
            class="mb-1"
        >
        </AtomInput>
        <MoleculeNameInput
            :rules="validation.cno"
            :fieldName="CONTACT_FORM.CONTACT_NO"
            v-model="model.cno"
            :placeholder="CONTACT_FORM.CONTACT_NO"
            :label="CONTACT_FORM.CONTACT_NO"
        >
        </MoleculeNameInput>
        <MoleculeNameInput
            v-if="isEnable"
            :rules="validation.addr"
            :fieldName="'Address'"
            v-model="model.addr"
            :placeholder="'Address'"
            :label="'Address'"
        >
        </MoleculeNameInput>
        <AtomTextarea
            v-if="textArea"
            v-model="model.msg"
            :label="'Message'"
        ></AtomTextarea>
    </div>
</template>

<script>
import { FORM } from '../../constant/constant';
import { mapMutations } from 'vuex';
import MoleculeNameInput from '../molecules/MoleculeNameInput.vue';
import AtomTextarea from '../atoms/AtomTextarea.vue';
import AtomInput from '../atoms/AtomInput.vue';

export default {
    name: 'OrganismContactForm',
    components: {
        MoleculeNameInput,
        AtomTextarea,
        AtomInput,
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
                addr: '',
            },
            validation: {
                fullname: 'required',
                email: '',
                cno: 'required|integer|phone',
                addr: 'required|address',
            },
            CONTACT_FORM: FORM,
            isEnable: false,
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
    mounted() {
        this.isEnable = this.$route.name === 'SOPortal';
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
