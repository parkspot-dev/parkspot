<template>
    <ValidationObserver ref="observer" v-slot="{}">
        <MoleculeNameInput
            :rules="validation.fullname"
            :fieldName="'Full name'"
            v-model="model.fullname"
            :placeholder="'Full name'"
            :label="'Full name'"
        >
        </MoleculeNameInput>
        <MoleculeNameInput
            :rules="validation.email"
            :fieldName="'Email'"
            v-model="model.email"
            :placeholder="'Email'"
            :inputType="'email'"
            :label="'Email'"
        >
        </MoleculeNameInput>
        <MoleculeNameInput
            :rules="validation.cno"
            :fieldName="'Contact No.'"
            v-model="model.cno"
            :placeholder="'Contact No.'"
            :label="'Contact No.'"
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
    </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate';
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
                addr: '',
            },
            validation: {
                fullname: 'required',
                email: 'required|email',
                cno: 'required|integer|phone',
                addr: 'required',
            },
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
