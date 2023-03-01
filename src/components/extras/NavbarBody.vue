<template>
    <header>
        <nav class="primary-nav">
            <div class="primary-nav-inner">
                <div class="company-logo">
                    <router-link :to="{ name: 'Home' }">
                        <img
                            class="ps-icon"
                            src="@/assets/pstopmini.png"
                            alt="parkspot icon"
                        />
                        <img
                            class="ps-text"
                            src="@/assets/pstoptext.png"
                            alt="parkspot text"
                        />
                    </router-link>
                </div>
                <div class="menu-wrapper-left">
                    <ul class="menu-wrapper">
                        <li class="menu-item">
                            <span class="menu-title">Company</span>
                            <div class="menu-item-dropdown">
                                <ul>
                                    <li>
                                        <router-link :to="{ name: 't-about' }">
                                            Go to About
                                        </router-link>
                                    </li>
                                    <li>
                                        <router-link :to="{ name: 'features' }">
                                            Features
                                        </router-link>
                                    </li>
                                    <li>
                                        <router-link :to="{ name: 'blog' }">
                                            Blogs
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li class="menu-item">
                            <span class="menu-title">Services</span>
                            <div class="menu-item-dropdown">
                                <ul>
                                    <li>
                                        <router-link :to="{ name: 'VOPortal' }">
                                            Request Spot
                                        </router-link>
                                    </li>
                                    <li>
                                        <router-link :to="{ name: 'SOPortal' }">
                                            Register Spot
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="menu-wrapper-right">
                    <ul>
                        <li></li>
                    </ul>
                    <AtomButton class="login-btn" @click.native="logInBtn">
                        Log in
                    </AtomButton>
                    <!-- todo: add functionality for sign up -->
                    <AtomButton>Sign up</AtomButton>
                </div>
                <div class="primary-nav-hamburger">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="20"
                        viewBox="0 0 26 20"
                        fill="none"
                    >
                        <rect width="26" height="4" fill="#0C0B0B"></rect>
                        <rect y="8" width="26" height="4" fill="#0C0B0B"></rect>
                        <rect
                            y="16"
                            width="26"
                            height="4"
                            fill="#0C0B0B"
                        ></rect>
                    </svg>
                </div>
            </div>
        </nav>
        <nav class="primary-nav-mobile">
            <div class="nav-wrapper">
                <div class="nav-container">
                    <div class="primary-nav-mobile-innner">
                        <div class="close-icon"></div>
                        <div class="menu-slide">
                            <div class="slide-header"></div>
                            <div class="scroll-section">
                                <ul class="scroll-items">
                                    <li class="scroll-item">
                                        <a href="">
                                            <span>Company</span>
                                        </a>
                                    </li>
                                    <li class="scroll-item">
                                        <a href="">
                                            <span> Services </span>
                                        </a>
                                    </li>
                                </ul>
                                <div class="menu-mobile-btn">
                                    <AtomButton
                                        class="login-btn"
                                        @click.native="logInBtn"
                                    >
                                        Log in
                                    </AtomButton>
                                </div>
                                <div class="menu-mobile-btn">
                                    <!-- todo: add functionality for sign up -->
                                    <AtomButton>Sign up</AtomButton>
                                </div>
                            </div>
                        </div>
                        <div class="menu-slide"></div>
                        <div class="menu-slide"></div>
                        <div class="menu-slide"></div>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>

<script>
import AtomButton from '../atoms/AtomButton.vue';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    name: 'NavbarBody',
    components: {
        AtomButton,
    },
    data() {
        return {};
    },
    computed: {
        ...mapState('user', {
            user: (state) => state.user,
            isAuthReady: (state) => state.isAuthReady,
        }),
    },
    mounted() {
        this.authenticateWithMaya();
    },
    methods: {
        ...mapMutations('user', {
            updateLoginModal: 'update-login-Modal',
        }),
        ...mapActions('user', {
            authenticateWithMaya: 'authenticateWithMaya',
            logOut: 'logOut',
        }),

        logInBtn() {
            this.updateLoginModal(true);
            this.authenticateWithMaya();
        },

        signout() {
            this.logOut();
        },

        gotoUserProfile() {
            this.$router.push({ name: 'userProfile' });
        },

        gotoEditProfile() {
            this.$router.push({ name: 'editProfile' });
        },
    },
};
</script>

<style lang="scss">
// .primary-nav {
//     position: fixed;
//     top: 0;
//     left: 0;
//     right: 0;
//     padding-right: inherit;
//     z-index: 39;
// }

.primary-nav-inner {
    position: relative;
    display: flex;
    align-items: center;
    height: 4.375rem;
    max-width: 90rem;
    margin: 0 auto;
    padding: 0 1.25rem;
}

.company-logo {
    margin-right: 2.5rem;
    a {
        display: inline-flex;

        .ps-icon {
            width: 36px;
            height: 36px;
        }
        .ps-text {
            width: auto;
            height: 36px;
        }
    }
}

.menu-wrapper {
    display: flex;
}

.menu-wrapper-left {
    display: flex;
    flex-grow: 1;

    .menu-item {
        margin-right: 1.875rem;
        position: relative;

        &:after {
            content: '';
            width: 100%;
            height: 1.25rem;
            position: absolute;
            top: 100%;
            left: 0;
        }

        .menu-title {
            &:after {
                content: '\276F';
                display: inline-block;
                font-size: 0.925rem;
                margin-left: 0.5rem;
                vertical-align: middle;
                transform: rotate(90deg);
                transition: -webkit-transform 0.2s ease-in-out;
                transition: transform 0.2s ease-in-out;
            }
        }

        span {
            font-size: 1.125rem;
            line-height: 1.25rem;
        }

        .menu-item-dropdown {
            position: absolute;
            top: 2.5rem;
            background: #fff;
            border: 1px solid #36a635;
            border-radius: 1.25rem;
            max-width: 25rem;
            transform: translateY(30px);
        }
    }
}

.menu-wrapper-right {
    display: flex;
    align-items: center;
    margin: 0 1.25rem 0 0;

    .login-btn {
        margin: 0 0.625rem 0 0;
        font-weight: bold;
    }
}

.primary-nav-hamburger {
    display: none;
    margin-top: 6px;

    @media only screen and (max-width: 1024px) {
        display: block;
        cursor: pointer;
    }
}

.primary-nav-mobile {
    position: fixed;
    top: 0.625rem;
    left: 0;
    right: 0;
    z-index: 30;
    transform: scale(1);
    transform-origin: calc(100vw - 25px) 0;
    transition: transform 0.5s cubic-bezier(1, 0.07, 0.11, 1);
}

.nav-wrapper {
    display: flex;

    .nav-container {
        padding-right: 0.9375rem;
        padding-left: 0.9375rem;
        flex: 0 0 auto;
        min-height: 0;
        min-width: 0;
        width: 100%;
    }
}

.primary-nav-mobile-innner {
    background-color: #fff;
    position: relative;
    max-height: calc(100vh - 20px);
    height: 200px;
    transition: height 0.3s ease-in-out;
}

.menu-slide {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    // transform: translateX(100%);
    transform: translateX(0);
    transition: transform 0.3s ease-in-out;

    .slide-header {
        padding: 0 1.25rem;
        height: 4.0625rem;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-shrink: 0;
    }

    .scroll-section {
        padding: 0 1.25rem 1.25rem;
        height: 100%;
        width: 100%;
        overflow-y: auto;

        .scroll-items {
            margin-bottom: 2.5rem;
        }

        .scroll-item {
            display: block;
            width: 100%;
            text-align: left;
            font-weight: 400;
            position: relative;
            padding: 0;
            margin: 0;
            border-bottom: 1px solid #bfbfbf;

            a {
                display: block;
                width: 100%;
                text-align: left;
                font-weight: 400;
                padding: 0.875rem 0;
            }
        }
    }
}
.menu-mobile-btn {
    text-align: center;
}
</style>
