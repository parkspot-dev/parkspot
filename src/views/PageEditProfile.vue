<template>
    <div>
        <TemplateEditProfile></TemplateEditProfile>
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
    mounted() {
        this.getUserProfile();
    },
    methods: {
        ...mapActions('user', { getUserProfile: 'getUserProfile' }),
    },
};
</script>