<template>
    <div class="general-info">
        <div class="general-info-header">
            <h1>General Info</h1>
            <h2>Please fill all the fields</h2>
        </div>
        <Form
            :validation-schema="editProfileFormSchema"
            class="form-container"
            @submit="saveProfile"
        >
            <FormInput
                v-model="userProfile.FullName"
                :label="'Full Name'"
                :placeholder="'Full Name'"
                :name="'fullname'"
            />
            <FormInput
                v-model="userProfile.EmailID"
                :label="'Email'"
                :placeholder="'Email'"
                :name="'email'"
                type="email"
            />
            <FormInput
                v-model="userProfile.Mobile"
                :label="'Contact No.'"
                :placeholder="'Contact No.'"
                :name="'cno'"
            />
            <RadioInput
                v-if="getUserType"
                v-model="userType"
                :values="userTypeData"
                label="What is you are looking for?"
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
                'I own a parking space and wish to rent it out.',
                'I am a vehicle owner looking for a parking spot to rent',
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
