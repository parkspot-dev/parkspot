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
    mounted() {
        this.getGoogleToken();
    },
    methods: {
        ...mapActions('map', ['getGoogleToken']),
    },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Rubik:wght@400;500;600;700&display=swap');
@import url('./assets/styles/variables.css');

#app {
    color: #555;
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
}

.body-container {
    padding-top: 4.375rem;
}
</style>
