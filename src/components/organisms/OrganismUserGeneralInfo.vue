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
                        :rules="validation.FullName"
                        v-model="userProfile.FullName"
                        :label="FORM.FULLNAME"
                    ></MoleculeNameInput>
                </div>
                <div class="py-4">
                    <MoleculeNameInput
                        :fieldName="FORM.EMAIL"
                        :placeholder="FORM.EMAIL"
                        :rules="validation.EmailID"
                        v-model="userProfile.EmailID"
                        :label="FORM.EMAIL"
                    ></MoleculeNameInput>
                </div>
                <div class="py-4">
                    <MoleculeNameInput
                        :fieldName="FORM.CONTACT_NO"
                        :placeholder="FORM.CONTACT_NO"
                        :rules="validation.Mobile"
                        v-model="userProfile.Mobile"
                        :label="FORM.CONTACT_NO"
                    ></MoleculeNameInput>
                </div>
                <div class="py-4">
                    <MoleculeRadioButton
                        :fieldName="'radio'"
                        :rules="validation.userType"
                        :values="userType"
                        :currentSelectedRadio="userType[1]"
                        @data="updateUserType"
                    >
                        What is you are looking for?
                    </MoleculeRadioButton>
                </div>
                <AtomButton class="is-pulled-right" @click.native="saveProfile">
                    Save Profile
                </AtomButton>
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
import { mapState } from 'vuex';

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
                'I own a parking spot, want to rent it',
                'I am a vehicle owner, looking for parking',
            ],
            model: {
                FullName: '',
                EmailID: '',
                Mobile: '',
            },
            validation: {
                FullName: 'required',
                EmailID: 'required|email',
                Mobile: 'required|integer|phone',
                userType: 'required',
            },
        };
    },
    computed: {
        ...mapState('user', {
            userProfile: (state) => state.userProfile,
        }),
    },
    methods: {
        updateUserType(userType) {
            console.log(userType);
            const isVO = userType.search('vehicle') === -1 ? false : true;
            this.$emit('userType', isVO);
        },

        saveProfile() {
            this.$refs.observer
                .validate()
                .then((sucess) => {
                    if (sucess) {
                        this.submit();
                    }
                })
                .catch((er) => {
                    console.log(er);
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.general-info-header {
    background-color: var(--secondary-color);
    padding: 20px 32px;
    margin-bottom: 32px;

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
    padding: 0px 32px;
}
</style>
