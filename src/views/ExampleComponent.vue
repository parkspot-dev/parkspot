<template>
    <section id="firebaseui-auth-container"></section>
</template>

<script>
import { authInstance, gProvider, phoneProvider } from '../firebase.js';
import * as firebaseui from 'firebaseui';

/* the line below added in the styling for me */
import 'firebaseui/dist/firebaseui.css';

export default {
    name: 'ExampleComponent',
    props: ['messages'],

    mounted() {
        const ui = new firebaseui.auth.AuthUI(authInstance);
        console.log(phoneProvider);
        const uiConfig = {
            signInSuccessUrl: '/profile',
            signInOptions: [
                gProvider.providerId,
                {
                    provider: phoneProvider.providerId,
                    recaptchaParameters: {
                        size: 'invisible', // 'invisible' or 'compact'
                    },
                    defaultCountry: 'IN', // Set default country to the INDIA.
                    loginHint: '+911234567890',
                    callback: (response) => {
                        // reCAPTCHA solved, allow signInWithPhoneNumber.
                        onSignInSubmit();
                    },
                },
            ],
        };
        ui.start('#firebaseui-auth-container', uiConfig);
    },
};
</script>

<style lang="scss" scoped>
</style>
