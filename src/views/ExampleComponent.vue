<template>
    <section id="firebaseui-auth-container"></section>
</template>

<script>
import { authInstance, gProvider } from '../firebase.js';
import * as firebaseui from 'firebaseui';

/* the line below added in the styling for me */
import 'firebaseui/dist/firebaseui.css';

export default {
    name: 'ExampleComponent',
    props: ['messages'],

    mounted() {
        const ui = new firebaseui.auth.AuthUI(authInstance);
        console.log(gProvider);
        const uiConfig = {
            signInSuccessUrl: '/profile',
            signInOptions: [gProvider.providerId],
        };
        ui.start('#firebaseui-auth-container', uiConfig);
    },
};
</script>

<style lang="scss" scoped>
</style>
