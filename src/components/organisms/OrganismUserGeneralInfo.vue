<template>
    <div class="general-info">
        <div class="general-info-header">
            <h1>General Info</h1>
            <h2>Please fill all the field correctly</h2>
        </div>
        <div class="general-info-form">
            <MoleculeNameInput
                :fieldName="FORM.FULLNAME"
                :placeholder="FORM.FULLNAME"
                :rules="validation.fullname"
                v-model="model.fullname"
                :label="FORM.FULLNAME"
            ></MoleculeNameInput>
            <MoleculeNameInput
                :fieldName="FORM.EMAIL"
                :placeholder="FORM.EMAIL"
                :rules="validation.email"
                v-model="model.email"
                :label="FORM.EMAIL"
            ></MoleculeNameInput>
            <MoleculeNameInput
                :fieldName="FORM.CONTACT_NO"
                :placeholder="FORM.CONTACT_NO"
                :rules="validation.contactNo"
                v-model="model.contactNo"
                :label="FORM.CONTACT_NO"
            ></MoleculeNameInput>
            <AtomButton>Save Profile</AtomButton>
        </div>
    </div>
</template>

<script>
import MoleculeNameInput from '../molecules/MoleculeNameInput.vue';
import AtomButton from '../atoms/AtomButton.vue';
import { FORM } from '../../constant/constant';
export default {
    name: 'OrganismUserGeneralInfo',
    components: {
        MoleculeNameInput,
        AtomButton,
    },
    data() {
        return {
            FORM,
            model: {
                fullname: '',
                email: '',
                contactNo: '',
            },
            validation: {
                fullname: '',
                email: '',
                contactNo: '',
            },
        };
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