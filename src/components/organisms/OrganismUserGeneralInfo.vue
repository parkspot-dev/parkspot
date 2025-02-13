<template>
    <div class="general-info">
        <div class="general-info-header">
            <h1>General Info</h1>
            <h2>Please fill all the fields</h2>
        </div>
        <Form
            :validation-schema="editProfileFormSchema"
            @submit="saveProfile"
            class="form-container"
        >
            <FormInput
                :label="'Full Name'"
                :placeholder="'Full Name'"
                :name="'fullname'"
                v-model="userProfile.FullName"
            />
            <FormInput
                :label="'Email'"
                :placeholder="'Email'"
                :name="'email'"
                type="email"
                v-model="userProfile.EmailID"
            />
            <FormInput
                :label="'Contact No.'"
                :placeholder="'Contact No.'"
                :name="'cno'"
                v-model="userProfile.Mobile"
            />
            <RadioInput
                v-if="getUserType"
                :values="userTypeData"
                label="What is you are looking for?"
                v-model="userType"
            />

            <button class="send-button" type="submit">Save Profile</button>
        </Form>
    </div>
</template>

<script>
import { editProfileFormSchema } from '@/validationSchemas';
import { Form } from 'vee-validate';
import { mapActions, mapMutations, mapState } from 'vuex';
import FormInput from '../global/FormInput.vue';
import RadioInput from '../global/RadioInput.vue';
export default {
    name: 'OrganismUserGeneralInfo',
    components: {
        Form,
        FormInput,
        RadioInput,
    },
    data() {
        return {
            editProfileFormSchema,
            userTypeData: [
                'I own a parking spot, want to rent it',
                'I am a vehicle owner, looking for parking',
            ],
            userType: 'VO',
            getUserType: false
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
        this.getUserType = true
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
            try {
                this.updateUserInfo();
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
        },
    },
};
</script>

<style lang="scss" scoped>
.general-info-header {
    margin-bottom: 32px;
    padding: 20px 32px;
    background-color: var(--secondary-color);

    h1 {
        font-size: 24px;
        font-weight: 600;
        color: var(--parkspot-black);
    }

    h2 {
        font-size: 14px;
        color: #e8faff;
    }
}

.general-info-form {
    padding: 0px 32px;
}
</style>
