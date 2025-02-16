<template>
    <div>
        <b-modal v-model="showModal" @cancel="onClose">
            <div class="login-card">
                <div class="logo-wrapper">
                    <AtomImage
                        class="login-logo"
                        src="/assets/pstopmini.png"
                        alt="parkspot logo"
                    />
                </div>
                <p class="login-title">Log In</p>
                <p class="login-subtitle">
                    Get started today by entering just a few details.
                </p>
                <button class="google-btn" @click="login">
                    <span class="google-btn-icon-wrapper">
                        <AtomImage
                            src="/assets/googleicon.svg"
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
        </b-modal>
    </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import AtomImage from '../atoms/AtomImage.vue';

export default {
    name: 'OrganismLogin',
    components: { AtomImage },
    props: {
        isShow: Boolean,
    },
    methods: {
        ...mapMutations('user', {
            updateLoginModal: 'update-login-Modal',
        }),
        ...mapActions('user', {
            loginWithGoogle: 'loginWithGoogle',
        }),

        onClose(isClose) {
            this.updateLoginModal(isClose);
        },

        login() {
            this.loginWithGoogle();
        },
    },
    computed: {
        showModal: {
            get() {
                return this.$store.state.user.loginModal;
            },
            set(value) {
                this.$store.commit('user/update-login-Modal', value);
            },
        },
    },
};
</script>

<style lang="scss" scoped>
.login-card {
    margin: 0 auto;
    padding: 50px 25px 10px;
    max-width: 480px;
    border-radius: var(--border-default);
    background-color: var(--parkspot-white);

    .logo-wrapper {
        margin: auto;
        margin-bottom: 30px;
        width: 64px;
        height: 64px;

        .login-logo {
            width: 64px;
            height: 64px;
        }
    }

    .login-title {
        margin-bottom: 15px;
        font-size: 25px;
        font-weight: 600;
        text-align: center;
    }

    .login-subtitle {
        margin-bottom: 15px;
        font-size: 14px;
        text-align: center;
        color: var(--grey-shade);
    }

    .google-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 48px;
        padding: 8px 16px;
        width: 100%;
        height: auto;
        min-height: 40px;
        direction: ltr;
        font-weight: 500;
        line-height: normal;
        border: none;
        cursor: pointer;
        background-color: var(--parkspot-white);
        box-shadow:
            0 2px 2px 0 rgb(0 0 0 / 14%),
            0 3px 1px -2px rgb(0 0 0 / 20%),
            0 1px 5px 0 rgb(0 0 0 / 12%);

        .google-btn-icon-wrapper {
            width: 18px;
            height: 18px;

            img {
                width: 18px;
                height: 18px;
            }
        }

        .google-btn-text {
            padding-left: 16px;
            font-size: 14px;
            text-transform: none;
            color: #757575;
        }
    }
    .login-footer {
        padding: 0 60px;

        p {
            margin-top: 0;
            margin-bottom: 24px;
            font-size: 12px;
            text-align: center;
            color: #757575;
            direction: ltr;
            line-height: 16px;
        }
    }
}
</style>
