<template>
    <div id="app">
        <Navbar></Navbar>
        <main class="body-container">
            <router-view :key="$route.fullPath" />
        </main>
        <TemplateFooter></TemplateFooter>
    </div>
</template>

<script>
import TemplateFooter from './components/templates/TemplateFooter.vue';
import Navbar from './components/extras/Navbar.vue';
export default {
    components: {
        TemplateFooter,
        Navbar,
    },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Rubik:wght@400;500;600;700&display=swap');
@import './assets/styles/variables.css';
#app {
    font-family: 'Poppins', sans-serif;
    color: #555;
    font-weight: 400;
}
.body-container {
    margin-top: 10px;
}
@media only screen and (max-width: 1024px) {
    .body-container {
        margin-top: 2px;
    }
}
</style>
