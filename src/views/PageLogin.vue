<template>
    <div>
        <MoleculeModal :modal="true">
            <div class="login-card">
                <div class="logo-wrapper">
                    <img
                        class="login-logo"
                        src="../assets/pstopmini.png"
                        alt=""
                    />
                </div>
                <p class="login-title">Log In to ParkSpot</p>
                <p class="login-subtitle">
                    Get started today by entering just a few details.
                </p>
                <div id="firebaseui-auth-container"></div>
            </div>
        </MoleculeModal>
    </div>
</template>

<script>
import MoleculeModal from '../components/molecules/MoleculeModal.vue';
import { authInstance, gProvider } from '../firebase.js';
import * as firebaseui from 'firebaseui';
// the line below added in the styling for firebaseui
import 'firebaseui/dist/firebaseui.css';

export default {
    name: 'PageLogin',
    components: {
        MoleculeModal,
    },
    created() {},
    mounted() {
        // Initialize the FirebaseUI Widget using Firebase.
        const ui =
            firebaseui.auth.AuthUI.getInstance() ||
            new firebaseui.auth.AuthUI(authInstance);

        ui.reset();
        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', this.getUiConfig());
    },
    methods: {
        // return FirebaseUI config
        getUiConfig() {
            return {
                signInSuccessUrl: '/dashboard',
                // Opens IDP Providers sign-in flow in a popup.
                signInFlow: 'popup',
                signInOptions: [gProvider.providerId],
                // Terms of service url.
                tosUrl: 'https://www.parkspot.in/terms-and-conditions',
                // Privacy policy url.
                privacyPolicyUrl:
                    'https://www.parkspot.in/terms-and-conditions',
            };
        },
    },
};
</script>

<style lang="scss" scoped>
.login-card {
    max-width: 480px;
    margin: 0 auto;
    background-color: white;
    padding: 50px 25px;
    border-radius: var(--border-default);

    .logo-wrapper {
        width: 64px;
        height: 64px;
        margin: auto;
        margin-bottom: 50px;
        .login-logo {
            width: 64px;
            height: 64px;
        }
    }

    .login-title {
        font-size: 25px;
        font-weight: 600;
        text-align: center;
        margin-bottom: 15px;
    }

    .login-subtitle {
        text-align: center;
        color: var(--grey-shade);
        margin-bottom: 15px;
    }
}
</style>