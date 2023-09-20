<template>
    <div id="app">
        <Navbar></Navbar>
        <OrganismLogin :is-show="loginModal"></OrganismLogin>
        <main class="body-container">
            <router-view :key="$route.fullPath" />
        </main>
        <TemplateFooter></TemplateFooter>
    </div>
</template>

<script>
import TemplateFooter from './components/templates/TemplateFooter.vue';
import Navbar from './components/extras/NavbarBody.vue';
import OrganismLogin from './components/organisms/OrganismLogin.vue';
import { PAGE_TITLE } from '@/constant/constant';
import { mapActions, mapState } from 'vuex';
export default {
    components: {
        TemplateFooter,
        Navbar,
        OrganismLogin,
    },
    async created() {
        await this.getHelplineNumber();
    },
    metaInfo() {
        return {
            title: PAGE_TITLE.HOMEPAGE,
        };
    },
    computed: {
        ...mapState('user', {
            loginModal: (state) => state.loginModal,
        }),
    },
    methods: {
        ...mapActions('config', ['getHelplineNumber']),
    },
};
</script>

<style lang="scss" src="@/styles/app.scss"></style>
