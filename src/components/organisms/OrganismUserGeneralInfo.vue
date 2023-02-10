<template>
    <div class="general-info">
        <div class="general-info-header">
            <h1>General Info</h1>
            <h2>Please fill all the fields</h2>
        </div>
        <div class="general-info-form">
            <ValidationObserver ref="observer" v-slot="{}">
                <div class="py-4">
                    <MoleculeNameInput
                        :fieldName="FORM.FULLNAME"
                        :placeholder="FORM.FULLNAME"
                        :rules="validation.fullname"
                        v-model="model.fullname"
                        :label="FORM.FULLNAME"
                    ></MoleculeNameInput>
                </div>
                <div class="py-4">
                    <MoleculeNameInput
                        :fieldName="FORM.EMAIL"
                        :placeholder="FORM.EMAIL"
                        :rules="validation.email"
                        v-model="model.email"
                        :label="FORM.EMAIL"
                    ></MoleculeNameInput>
                </div>
                <div class="py-4">
                    <MoleculeNameInput
                        :fieldName="FORM.CONTACT_NO"
                        :placeholder="FORM.CONTACT_NO"
                        :rules="validation.contactNo"
                        v-model="model.contactNo"
                        :label="FORM.CONTACT_NO"
                    ></MoleculeNameInput>
                </div>
                <div class="py-4">
                    <MoleculeRadioButton
                        :fieldName="'radio'"
                        :rules="validation.userType"
                        :values="userType"
                        @data="updateUserType"
                    >
                        What is you are looking for?
                    </MoleculeRadioButton>
                </div>
                <AtomButton class="is-pulled-right">Save Profile</AtomButton>
            </ValidationObserver>
        </div>
    </div>
</template>

<script>
import MoleculeNameInput from '../molecules/MoleculeNameInput.vue';
import MoleculeRadioButton from '../molecules/MoleculeRadioButton.vue';
import AtomButton from '../atoms/AtomButton.vue';
import { FORM } from '../../constant/constant';
import { ValidationObserver } from 'vee-validate';

export default {
    name: 'OrganismUserGeneralInfo',
    components: {
        MoleculeNameInput,
        AtomButton,
        MoleculeRadioButton,
        ValidationObserver,
    },
    data() {
        return {
            FORM,
            userType: [
                'I own a parking lot, want to rent it',
                'I am a car owner, looking for parking',
            ],
            model: {
                fullname: '',
                email: '',
                contactNo: '',
            },
            validation: {
                fullname: '',
                email: '',
                contactNo: '',
                userType: '',
            },
        };
    },
    methods: {
        updateUserType(userType) {
            console.log(userType);
        },
    },
};
</script>

<style lang="scss" scoped>
.general-info-header {
    background-color: var(--secondary-color);
    padding: 20px 30px;
    margin-bottom: 30px;

    h1 {
        color: black;
        font-weight: 600;
        font-size: 24px;
    }

    h2 {
        color: #e8faff;
        font-size: 14px;
    }
}

.general-info-form {
    padding: 0px 30px;
}
</style>