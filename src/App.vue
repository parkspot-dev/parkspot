<template>
    <div>
        <div id="app">
            <Navbar></Navbar>
            <!-- Login modal depends on Buefy + Firebase Auth, both of which
                 require the browser. Rendering it client-only keeps the SSR
                 HTML free of unmounted modal markup. -->
            <ClientOnly>
                <OrganismLogin></OrganismLogin>
            </ClientOnly>
            <main class="body-container">
                <router-view :key="$route.fullPath" />
            </main>
            <TemplateFooter></TemplateFooter>
        </div>
        <ClientOnly>
            <AtomChat />
        </ClientOnly>
        <!-- Disclosure-only cookie notice (PR-2 of conversion-tracking).
             Wrapped in <ClientOnly> for SSG safety: the component reads
             localStorage in mounted(), which is unavailable during
             vite-ssg prerender. See plan.md §2.8. -->
        <ClientOnly>
            <OrganismConsentNotice />
        </ClientOnly>
    </div>
</template>

<script>
import TemplateFooter from './components/templates/TemplateFooter.vue';
import Navbar from './components/extras/NavbarBody.vue';
import OrganismLogin from './components/organisms/OrganismLogin.vue';
import OrganismConsentNotice from './components/organisms/OrganismConsentNotice.vue';
import AtomChat from './components/atoms/AtomChat.vue';
import { PAGE_TITLE } from '@/constant/constant';
import { mapActions } from 'vuex';

export default {
    components: {
        TemplateFooter,
        Navbar,
        OrganismLogin,
        OrganismConsentNotice,
        AtomChat,
    },
    async created() {
        await this.getHelplineNumber();
    },
    metaInfo() {
        return {
            title: PAGE_TITLE.HOMEPAGE,
        };
    },
    methods: {
        ...mapActions('config', ['getHelplineNumber']),
    },
};
</script>

<style lang="scss" src="@/styles/app.scss"></style>
