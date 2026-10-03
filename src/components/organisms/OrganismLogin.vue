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
                <button class="google-btn" :disabled="isLoading" @click="login">
                    <span class="google-btn-icon-wrapper">
                        <AtomImage
                            src="/assets/googleicon.svg"
                            alt="gmail icon"
                        />
                    </span>
                    <span class="google-btn-text">
                        {{
                            isLoading ? 'Signing in…' : ' Sign in With Google '
                        }}
                    </span>
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
    data() {
        return {
            // Guards against double submits: a second click while the Google
            // popup is open opens a second popup, and Firebase then throws
            // auth/popup-blocked, which reads to the user as a failed login.
            isLoading: false,
        };
    },
    computed: {
        showModal: {
            get() {
                return this.$store.state.user.loginModal;
            },
            set(value) {
                this.$store.commit('user/update-login-modal', value);
            },
        },
    },
    methods: {
        ...mapMutations('user', {
            updateLoginModal: 'update-login-modal',
        }),
        ...mapActions('user', {
            loginWithGoogle: 'loginWithGoogle',
        }),

        onClose(isClose) {
            this.updateLoginModal(isClose);
        },

        showDangerToast(message) {
            this.$buefy.toast.open({
                message,
                type: 'is-danger',
                duration: 4000,
            });
        },

        async login() {
            if (this.isLoading) {
                return;
            }
            this.isLoading = true;

            try {
                // `loginWithGoogle` reports failure in its result instead of
                // throwing (see the store action), so the user gets told what
                // happened instead of the click silently doing nothing.
                const result = await this.loginWithGoogle();

                if (result?.ok === false && !this.isDismissed(result.code)) {
                    this.showDangerToast(this.failureMessage(result.code));
                }
            } catch {
                // The action is contracted not to throw. Guard anyway so an
                // unexpected rejection cannot leave the button stuck disabled.
                this.showDangerToast(this.failureMessage(null));
            } finally {
                this.isLoading = false;
            }
        },

        // The user closing the popup is a normal outcome, not a failure, so it
        // gets no error toast. Matched loosely because Firebase has carried
        // both `popup-closed-by-user` and `cancelled-popup-request` codes.
        isDismissed(code) {
            return Boolean(
                code &&
                    (code.includes('popup-closed-by-user') ||
                        code.includes('cancelled-popup-request')),
            );
        },

        // A blocked popup is fixed in the browser, not the network, so it
        // gets its own message instead of "check your connection".
        failureMessage(code) {
            if (code && code.includes('popup-blocked')) {
                return 'Your browser blocked the sign-in popup. Please allow popups for this site and try again.';
            }
            return 'Sign-in failed. Please check your connection and try again.';
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

        &:disabled {
            cursor: not-allowed;
            opacity: 0.6;
        }

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
