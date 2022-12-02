<template>
    <div id="app">
        <Navbar></Navbar>
        <main class="body-container">
            <router-view :key="$route.fullPath" />
        </main>
        <OrganismIntersectionObserver
            sentinal-name="socialLinks"
            @on-intersection-element="onIntersectionElement"
        ></OrganismIntersectionObserver>
        <MoleculeSocialLinks
            :class="{
                'opacity-100': isSocialLinksVisible,
                'opacity-0': !isSocialLinksVisible,
            }"
        ></MoleculeSocialLinks>
        <TemplateFooter></TemplateFooter>
    </div>
</template>

<script>
import TemplateFooter from './components/templates/TemplateFooter.vue';
import Navbar from './components/extras/NavbarBody.vue';
import { PAGE_TITLE } from '@/constant/constant';
import MoleculeSocialLinks from '@/components/molecules/MoleculeSocialLinks.vue';
import OrganismIntersectionObserver from '@/components/organisms/OrganismIntersectionObserver.vue';

export default {
    components: {
        TemplateFooter,
        Navbar,
        MoleculeSocialLinks,
        OrganismIntersectionObserver,
    },
    metaInfo() {
        return {
            title: PAGE_TITLE.HOMEPAGE,
        };
    },
    data() {
        return {
            isSocialLinksVisible: false,
        };
    },
    methods: {
        onIntersectionElement(isVisble) {
            this.isSocialLinksVisible = isVisble;
            console.log('helo');
        },
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
    margin-top: 10px;
}

.opacity-100 {
    opacity: 1;
}
.opacity-0 {
    opacity: 0;
}

@media only screen and (max-width: 1024px) {
    .body-container {
        margin-top: 2px;
    }
}
</style>
