<template>
    <div>
        <div id="app">
            <Navbar></Navbar>
            <OrganismLogin :is-show="loginModal"></OrganismLogin>
            <main class="body-container">
                <PageHome></PageHome>
                <!-- <router-view :key="$route.fullPath" /> -->
            </main>
            <TemplateFooter></TemplateFooter>
        </div>
        <AtomChat />
    </div>
</template>

<script>
import TemplateFooter from './components/templates/TemplateFooter.vue';
import Navbar from './components/extras/NavbarBody.vue';
import OrganismLogin from './components/organisms/OrganismLogin.vue';
import AtomChat from './components/atoms/AtomChat.vue';
import { PAGE_TITLE } from '@/constant/constant';
import { mapActions, mapState } from 'vuex';
import PageHome from './views/PageHome.vue';


export default {
    components: {
        TemplateFooter,
        Navbar,
        OrganismLogin,
        AtomChat,
        PageHome,

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
