<template>
    <div>
        <MoleculeModal :modal="true">
            <div class="login-card">
                <div class="logo-wrapper">
                    <img
                        class="login-logo"
                        src="../../assets/pstopmini.png"
                        alt=""
                    />
                </div>
                <p class="login-title">Sign Up to ParkSpot</p>
                <p class="login-subtitle">
                    Get started today by entering just a few details.
                </p>
            </div>
        </MoleculeModal>
    </div>
</template>

<script>
import MoleculeModal from '../molecules/MoleculeModal.vue';

export default {
    name: 'OrganismSignup',
    components: {
        MoleculeModal,
    },
    mounted() {},
    methods: {},
};
</script>

<style lang="scss" scoped>
.login-card {
    margin: 0 auto;
    padding: 50px 25px;
    max-width: 480px;
    border-radius: var(--border-default);
    background-color: var(--parkspot-white);

    .logo-wrapper {
        margin: auto;
        margin-bottom: 50px;
        width: 64px;
        height: 64px;

        .login-logo {
            width: 64px;
            height: 64px;
        }
    }

    .login-title {
        margin-bottom: 16px;
        font-size: 24px;
        font-weight: 600;
        text-align: center;
    }

    .login-subtitle {
        margin-bottom: 15px;
        text-align: center;
        color: var(--grey-shade);
    }
}
</style>
