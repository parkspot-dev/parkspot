<template>
    <div class="general-info">
        <LoaderModal :isLoading="isLoading"></LoaderModal>
        <div class="general-info-header">
            <h1>General Info</h1>
            <h2>Please fill all the fields</h2>
        </div>
        <div v-if="!isLoading" class="general-info-form">
            <ValidationObserver ref="observer" v-slot="{}">
                <div class="py-4">
                    <MoleculeNameInput
                        :fieldName="'Full Name'"
                        :placeholder="'Full Name'"
                        :rules="validation.FullName"
                        :value="fullName"
                        @input="userProfileChange('FullName', ...arguments)"
                        :label="'Full Name'"
                    ></MoleculeNameInput>
                </div>
                <div class="py-4">
                    <MoleculeNameInput
                        :fieldName="'Email'"
                        :placeholder="'Email'"
                        :rules="validation.EmailID"
                        :value="emailID"
                        @input="userProfileChange('EmailID', ...arguments)"
                        :label="'Email'"
                    ></MoleculeNameInput>
                </div>
                <div class="py-4">
                    <MoleculeNameInput
                        :fieldName="'Contact No.'"
                        :placeholder="'Contact No.'"
                        :rules="validation.Mobile"
                        :value="mobile"
                        @input="userProfileChange('Mobile', ...arguments)"
                        :label="'Contact No.'"
                    ></MoleculeNameInput>
                </div>
                <div class="py-4">
                    <MoleculeRadioButton
                        :fieldName="'radio'"
                        :rules="validation.userType"
                        :values="userTypeData"
                        :currentSelectedRadio="userType"
                        @data="userProfileChange('Type', ...arguments)"
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
import LoaderModal from '../extras/LoaderModal.vue';
import { ValidationObserver } from 'vee-validate';
import { mapActions, mapState } from 'vuex';

export default {
    name: 'OrganismUserGeneralInfo',
    components: {
        MoleculeNameInput,
        AtomButton,
        MoleculeRadioButton,
        ValidationObserver,
        LoaderModal,
    },
    data() {
        return {
            userTypeData: [
                'I am a vehicle owner, looking for parking',
                'I own a parking spot, want to rent it',
            ],
            localFullName: '',
            localEmailID: '',
            localMobile: '',
            localType: '',
            validation: {
                FullName: 'required',
                EmailID: 'required|email',
                Mobile: 'required|integer|phone',
                userType: '',
            },
        };
    },
    computed: {
        ...mapState('user', ['userProfile', 'isLoading']),
        fullName() {
            return this.userProfile.FullName;
        },
        emailID() {
            return this.userProfile.EmailID;
        },
        mobile() {
            return this.userProfile.Mobile;
        },
        userType() {
            return this.userTypeData[this.userProfile.Type];
        },
    },
    watch: {
        userProfile(userProfileData) {
            this.localType = userProfileData.Type;
        },
        localFullName(newFullName) {
            if (newFullName != this.userProfile.FullName) {
                this.updateSavedProfileFlag(false);
            } else {
                this.updateSavedProfileFlag(true);
            }
        },
        localEmailID(newEmailID) {
            if (newEmailID != this.userProfile.EmailID) {
                this.updateSavedProfileFlag(false);
            } else {
                this.updateSavedProfileFlag(true);
            }
        },
        localMobile(newMobile) {
            if (newMobile != this.userProfile.Mobile) {
                this.updateSavedProfileFlag(false);
            } else {
                this.updateSavedProfileFlag(true);
            }
        },
        localType(newType) {
            if (newType != this.userProfile.Type) {
                this.updateSavedProfileFlag(false);
            } else {
                this.updateSavedProfileFlag(true);
            }
        },
    },
    mounted() {},
    methods: {
        ...mapActions('user', ['updateUserInfo', 'updateSavedProfileFlag']),

        userProfileChange(userProperty, userData) {
            switch (userProperty) {
                case 'FullName':
                    this.localFullName = userData;
                    break;
                case 'EmailID':
                    this.localEmailID = userData;
                    break;
                case 'Mobile':
                    this.localMobile = userData;
                    break;
                case 'Type':
                    if (userData === this.userTypeData[0]) {
                        this.localType = 0;
                    } else if (userData === this.userTypeData[1]) {
                        this.localType = 1;
                    }
                    break;
            }
        },
        saveProfile() {
            this.$refs.observer
                .validate()
                .then(async (sucess) => {
                    if (sucess) {
                        try {
                            await this.updateUserInfo({
                                FullName: this.localFullName,
                                EmailID: this.localEmailID,
                                Mobile: this.localMobile,
                                Type: this.localType,
                            });
                            this.updateSavedProfileFlag(true);
                            this.$buefy.toast.open({
                                message: 'Profile updated successfully!',
                                type: 'is-success',
                                duration: 2000,
                            });
                        } catch (error) {
                            this.$buefy.toast.open({
                                message: `Something went wrong!`,
                                type: 'is-danger',
                                duration: 2000,
                            });
                        }
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
