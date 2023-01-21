<template>
    <div>
        <div>
            <PageLogin></PageLogin>
        </div>
    </div>
</template>

<script>
import PageLogin from './PageLogin.vue';

export default {
    name: 'ExampleComponent',
    components: { PageLogin },
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
                        type: 'image', // 'audio'
                        size: 'normal', // 'invisible' or 'compact'
                        badge: 'bottomleft', // ' bottomright' or 'inline' applies to invisible.
                    },
                    defaultCountry: 'IN', // Set default country to the INDIA.
                    loginHint: '+911234567890',
                },
            ],
        };
        ui.start('#firebaseui-auth-container', uiConfig);
    },
};
</script>

<style lang="scss" scoped>
</style>
