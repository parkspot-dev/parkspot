<template>
    <div>
        <MoleculeModal :is-show="isShow" @cancel="onClose">
            <div class="login-card">
                <div class="logo-wrapper">
                    <img
                        class="login-logo"
                        src="../../assets/pstopmini.png"
                        alt="parkspot logo"
                    />
                </div>
                <p class="login-title">Log In</p>
                <p class="login-subtitle">
                    Get started today by entering just a few details.
                </p>
                <button class="google-btn" @click="login">
                    <span class="google-btn-icon-wrapper">
                        <img
                            src="../../assets/googleicon.svg"
                            alt="gmail icon"
                        />
                    </span>
                    <span class="google-btn-text"> Sign in With Google </span>
                </button>
                <div class="login-footer">
                    <p>
                        By continuing, you are indicating that you accept our
                        <a href="https://www.parkspot.in/terms-and-conditions">
                            Terms of Service
                        </a>
                        .
                    </p>
                </div>
            </div>
        </MoleculeModal>
    </div>
</template>

<script>
import MoleculeModal from '../molecules/MoleculeModal.vue';
import { mapMutations, mapActions } from 'vuex';

export default {
    name: 'OrganismLogin',
    components: {
        MoleculeModal,
    },
    props: {
        isShow: Boolean,
    },
    data() {
        return {};
    },
    mounted() {},
    methods: {
        ...mapMutations('user', {
            updateLoginModal: 'update-login-Modal',
        }),
        ...mapActions('user', {
            loginWithGoogle: 'loginWithGoogle',
            loginWithPhone: 'loginWithPhone',
        }),

        onClose(isClose) {
            this.updateLoginModal(isClose);
        },

        login() {
            this.loginWithGoogle();
        },
    },
};
</script>

<style lang="scss" scoped>
.login-card {
    background-color: white;
    border-radius: var(--border-default);
    max-width: 480px;
    margin: 0 auto;
    padding: 50px 25px 10px 25px;

    .logo-wrapper {
        width: 64px;
        height: 64px;
        margin: auto;
        margin-bottom: 30px;
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
        font-size: 14px;
        text-align: center;
        color: var(--grey-shade);
        margin-bottom: 15px;
    }

    .google-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        direction: ltr;
        font-weight: 500;
        height: auto;
        line-height: normal;
        min-height: 40px;
        padding: 8px 16px;
        margin-bottom: 48px;
        width: 100%;
        border: none;
        cursor: pointer;
        background-color: #fff;
        box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%),
            0 3px 1px -2px rgb(0 0 0 / 20%), 0 1px 5px 0 rgb(0 0 0 / 12%);

        .google-btn-icon-wrapper {
            height: 18px;
            width: 18px;
            img {
                height: 18px;
                width: 18px;
            }
        }

        .google-btn-text {
            font-size: 14px;
            padding-left: 16px;
            text-transform: none;
            color: #757575;
        }
    }
    .login-footer {
        padding: 0 60px;
        p {
            color: #757575;
            direction: ltr;
            font-size: 12px;
            line-height: 16px;
            margin-bottom: 24px;
            margin-top: 0;
            text-align: center;
        }
    }
}
</style>
