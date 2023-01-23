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