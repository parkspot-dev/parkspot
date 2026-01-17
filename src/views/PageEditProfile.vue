<template>
    <div>
        <TemplateEditProfile v-if="!hasError" />
        <div v-else data-testid="profile-error">Something went wrong</div>
    </div>
</template>

<script>
import TemplateEditProfile from '../components/templates/TemplateEditProfile.vue';
import { mapActions } from 'vuex';

export default {
    name: 'PageEditProfile',

    components: {
        TemplateEditProfile,
    },

    data() {
        return {
            hasError: false,
        };
    },

    async mounted() {
        try {
            await this.getUserProfile();
        } catch (error) {
            this.hasError = true;
        }
    },

    methods: {
        ...mapActions('user', {
            getUserProfile: 'getUserProfile',
        }),
    },
};
</script>
