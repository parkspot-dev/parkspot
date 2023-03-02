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
                        :fieldName="'Full Name'"
                        :placeholder="'Full Name'"
                        :rules="validation.FullName"
                        v-model="userProfile.FullName"
                        :label="'Full Name'"
                    ></MoleculeNameInput>
                </div>
                <div class="py-4">
                    <MoleculeNameInput
                        :fieldName="'Email'"
                        :placeholder="'Email'"
                        :rules="validation.EmailID"
                        v-model="userProfile.EmailID"
                        :label="'Email'"
                    ></MoleculeNameInput>
                </div>
                <div class="py-4">
                    <MoleculeNameInput
                        :fieldName="'Contact No.'"
                        :placeholder="'Contact No.'"
                        :rules="validation.Mobile"
                        v-model="userProfile.Mobile"
                        :label="'Contact No.'"
                    ></MoleculeNameInput>
                </div>
                <div class="py-4">
                    <MoleculeRadioButton
                        :fieldName="'radio'"
                        :rules="validation.userType"
                        :values="userTypeData"
                        :currentSelectedRadio="userType"
                        @data="setUserType"
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
import { ValidationObserver } from 'vee-validate';
import { mapActions, mapMutations, mapState } from 'vuex';

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
            userTypeData: [
                'I own a parking spot, want to rent it',
                'I am a vehicle owner, looking for parking',
            ],
            userType: 'VO',
            validation: {
                FullName: 'required',
                EmailID: 'required|email',
                Mobile: 'required|integer|phone',
                userType: '',
            },
        };
    },
    computed: {
        ...mapState('user', {
            userProfile: (state) => state.userProfile,
        }),
    },
    watch: {
        userType(type) {
            this.setUserType(type);
        },
    },
    mounted() {
        if (this.userProfile === 'SO') {
            this.userType = this.userTypeData[0];
        } else {
            this.userType = this.userTypeData[1];
        }
    },
    methods: {
        ...mapMutations('user', {
            updateUserProfile: 'update-user-profile',
        }),
        ...mapActions('user', {
            updateUserInfo: 'updateUserInfo',
        }),
        setUserType(userType) {
            if (userType.search('vehicle') === -1) {
                this.updateUserProfile({ ...this.userProfile, Type: 'SO' });
                this.userType = this.userTypeData[0];
            } else {
                this.updateUserProfile({ ...this.userProfile, Type: 'VO' });
                this.userType = this.userTypeData[1];
            }
        },
        saveProfile() {
            this.$refs.observer
                .validate()
                .then((sucess) => {
                    if (sucess) {
                        this.updateUserInfo();
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
