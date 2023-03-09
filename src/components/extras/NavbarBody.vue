<template>
    <header class="main-nav">
        <!-- desktop version navbar -->
        <nav class="primary-nav">
            <div class="primary-nav-inner">
                <!-- company logo -->
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
                <!-- nav-links -->
                <div class="menu-wrapper-left">
                    <ul class="menu-wrapper">
                        <li class="menu-item">
                            <span class="menu-title">Company</span>
                            <!-- menu dropdown -->
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
                            <!-- menu dropdown -->
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
                <!-- phone link -->
                <div class="mobile-phone-link">
                    <p>
                        <a href="tel:+91 80929 96057"> +91 80929 96057 </a>
                    </p>
                </div>
                <!-- login buttons -->
                <div class="menu-wrapper-right">
                    <ul>
                        <li>
                            <p>
                                <a href="tel:+91 80929 96057">
                                    +91 809-299-6057
                                </a>
                            </p>
                        </li>
                    </ul>
                    <template v-if="isAuthReady">
                        <div class="login-options" v-if="!user">
                            <AtomButton
                                class="login-btn"
                                @click.native="logInBtn"
                            >
                                Log in
                            </AtomButton>
                            <!-- todo: add functionality for sign up -->
                            <AtomButton>Sign up</AtomButton>
                        </div>
                        <div class="login-options" v-if="user">
                            <div class="user-profile">
                                <div class="user-pic-wrapper">
                                    <img
                                        class="user-pic"
                                        :src="user.photoURL"
                                        alt="profile image"
                                    />
                                </div>
                                <!-- user profile dropdown -->
                                <div class="user-dropdown">
                                    <ul>
                                        <li class="dropdown-list">
                                            <a @click="gotoProfile">
                                                Profile
                                            </a>
                                        </li>
                                        <li class="dropdown-list">
                                            <a @click="signout"> Sign Out </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
                <!-- hamburger for mobile view -->
                <div class="primary-nav-hamburger" @click="toggleMobileNav">
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
        <!-- mobile version navbar -->
        <nav
            :class="[
                'primary-nav-mobile',
                showMobileNav ? 'primary-nav-mobile--open' : '',
            ]"
        >
            <div class="nav-wrapper">
                <div class="nav-container">
                    <div class="primary-nav-mobile-innner">
                        <div class="close-icon" @click="toggleMobileNav">
                            <b-icon icon="close"> </b-icon>
                        </div>
                        <div
                            :class="[
                                'menu-slide',
                                activeSlide === 0 ? 'active-slide' : '',
                            ]"
                        >
                            <div class="slide-header">
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
                            </div>
                            <div class="scroll-section">
                                <ul class="scroll-items">
                                    <li
                                        v-if="user"
                                        class="scroll-item"
                                        @click="toggleSlide(1)"
                                    >
                                        <p><span>My Account</span></p>
                                    </li>
                                    <li
                                        class="scroll-item"
                                        @click="toggleSlide(2)"
                                    >
                                        <p>
                                            <span>Company</span>
                                        </p>
                                    </li>
                                    <li
                                        class="scroll-item"
                                        @click="toggleSlide(3)"
                                    >
                                        <p>
                                            <span> Services </span>
                                        </p>
                                    </li>
                                </ul>
                                <template v-if="isAuthReady">
                                    <div v-if="!user">
                                        <AtomButton
                                            class="menu-mobile-btn"
                                            @click.native="logInBtn"
                                        >
                                            Log in
                                        </AtomButton>
                                        <!-- todo: add functionality for sign up -->
                                        <AtomButton class="menu-mobile-btn"
                                            >Sign up</AtomButton
                                        >
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div
                            :class="[
                                'menu-slide',
                                activeSlide === 1 ? 'active-slide' : '',
                            ]"
                        >
                            <div class="slide-header">
                                <i
                                    class="back-button"
                                    @click="backToMainScroll"
                                ></i>
                                <p class="slide-header-title">My Account</p>
                            </div>
                            <div class="scroll-section">
                                <ul class="scroll-items">
                                    <li class="scroll-item">
                                        <p @click="toggleMobileNav">
                                            <router-link
                                                class="nav-link"
                                                :to="{ name: 'editProfile' }"
                                            >
                                                Profile
                                            </router-link>
                                        </p>
                                    </li>
                                    <li class="scroll-item">
                                        <p @click="toggleMobileNav">
                                            <a @click="signout"> Sign Out </a>
                                        </p>
                                    </li>
                                </ul>
                                <template v-if="isAuthReady">
                                    <div v-if="!user">
                                        <AtomButton
                                            class="menu-mobile-btn"
                                            @click.native="logInBtn"
                                        >
                                            Log in
                                        </AtomButton>
                                        <!-- todo: add functionality for sign up -->
                                        <AtomButton class="menu-mobile-btn"
                                            >Sign up</AtomButton
                                        >
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div
                            :class="[
                                'menu-slide',
                                activeSlide === 2 ? 'active-slide' : '',
                            ]"
                        >
                            <div class="slide-header">
                                <i
                                    class="back-button"
                                    @click="backToMainScroll"
                                ></i>
                                <p class="slide-header-title">Company</p>
                            </div>
                            <div class="scroll-section">
                                <ul class="scroll-items">
                                    <li class="scroll-item">
                                        <p @click="toggleMobileNav">
                                            <router-link
                                                class="nav-link"
                                                :to="{ name: 't-about' }"
                                            >
                                                Go to About
                                            </router-link>
                                        </p>
                                    </li>
                                    <li class="scroll-item">
                                        <p @click="toggleMobileNav">
                                            <router-link
                                                class="nav-link"
                                                :to="{ name: 'features' }"
                                            >
                                                Features
                                            </router-link>
                                        </p>
                                    </li>
                                    <li class="scroll-item">
                                        <p @click="toggleMobileNav">
                                            <router-link
                                                class="nav-link"
                                                :to="{ name: 'blog' }"
                                            >
                                                Blogs
                                            </router-link>
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div
                            :class="[
                                'menu-slide',
                                activeSlide === 3 ? 'active-slide' : '',
                            ]"
                        >
                            <div class="slide-header">
                                <i
                                    class="back-button"
                                    @click="backToMainScroll"
                                ></i>
                                <p class="slide-header-title">Services</p>
                            </div>
                            <div class="scroll-section">
                                <ul class="scroll-items">
                                    <li class="scroll-item">
                                        <p @click="toggleMobileNav">
                                            <router-link
                                                class="nav-link"
                                                :to="{ name: 'VOPortal' }"
                                            >
                                                Request Spot
                                            </router-link>
                                        </p>
                                    </li>
                                    <li class="scroll-item">
                                        <p @click="toggleMobileNav">
                                            <router-link
                                                class="nav-link"
                                                :to="{ name: 'SOPortal' }"
                                            >
                                                Register Spot
                                            </router-link>
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <div class="primary-nav-mobile__backdrop"></div>
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
        return {
            showMobileNav: false,
            activeSlide: 0,
        };
    },
    computed: {
        ...mapState('user', {
            user: (state) => state.user,
            isAuthReady: (state) => state.isAuthReady,
        }),
    },
    methods: {
        ...mapMutations('user', {
            updateLoginModal: 'update-login-Modal',
        }),
        ...mapActions('user', {
            logOut: 'logOut',
        }),

        logInBtn() {
            this.updateLoginModal(true);
        },

        signout() {
            this.logOut();
        },

        gotoProfile() {
            this.$router.push({ name: 'editProfile' });
        },
        toggleMobileNav() {
            this.showMobileNav = !this.showMobileNav;
        },
        toggleSlide(slideNo) {
            this.activeSlide = slideNo;
        },
        backToMainScroll() {
            this.activeSlide = 0; // making main slide active
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
.main-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding-right: inherit;
    z-index: 39;
    background-color: #fff;
}

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

            @media only screen and (max-width: 1024px) {
                width: 30px;
                height: 30px;
            }
        }
        .ps-text {
            width: auto;
            height: 36px;

            @media only screen and (max-width: 1024px) {
                width: auto;
                height: 30px;
            }

            @media only screen and (max-width: 680px) {
                display: none;
            }
        }
    }
}

.menu-wrapper {
    display: flex;
}

.menu-wrapper-left {
    display: flex;
    flex-grow: 1;

    @media only screen and (max-width: 750px) {
        display: none;
    }

    .menu-item {
        margin-right: 1.875rem;
        position: relative;

        &:hover {
            .menu-item-dropdown {
                opacity: 1;
                visibility: visible;
                transition: opacity 0.2s ease-in-out,
                    visibility 0.2s ease-in-out, transform 0.2s ease-in-out,
                    -webkit-transform 0.2s ease-in-out;
            }
        }

        &:after {
            content: '';
            width: 100%;
            height: 1.25rem;
            position: absolute;
            top: 100%;
            left: 0;
        }

        .menu-title {
            font-weight: 500;

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
            border: 1px solid var(--primary-color);
            border-radius: var(--border-default);
            width: 11rem;
            transform: translateY(5px);
            opacity: 0;
            visibility: hidden;

            &:before {
                content: '';
                position: absolute;
                top: -0.5625rem;
                left: 1rem;
                background: #fff;
                border-left: 1px solid var(--primary-color);
                border-top: 1px solid var(--primary-color);
                width: 1rem;
                height: 1rem;
                -webkit-transform: rotate(45deg);
                transform: rotate(45deg);
            }

            ul {
                padding: 1.5625rem 1.875rem;

                li {
                    font-size: 1.0625rem;
                    line-height: 1.4375rem;
                    margin-bottom: 1.0625rem;

                    a {
                        color: #555;
                        font-weight: 500;
                    }

                    a:hover {
                        color: #0085ad;
                    }
                }
            }
        }
    }
}

.menu-wrapper-right {
    display: flex;
    align-items: center;
    margin: 0 1.25rem 0 0;

    p {
        margin: 0 1.25rem 0 0;
        a {
            color: #555;
        }

        @media only screen and (max-width: 1024px) {
            display: none;
        }
    }

    .login-btn {
        margin: 0 0.625rem 0 0;
        font-weight: bold;
    }

    .button {
        @media only screen and (max-width: 750px) {
            display: none;
        }
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
    transform: scale(0);
    transform-origin: calc(100vw - 25px) 0;
    transition: transform 0.5s cubic-bezier(1, 0.07, 0.11, 1);
}

.primary-nav-mobile__backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 29;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s cubic-bezier(1, 0.07, 0.11, 1),
        visibility 0.5s cubic-bezier(1, 0.07, 0.11, 1);
}

.primary-nav-mobile--open {
    transform: scale(1);

    & + .primary-nav-mobile__backdrop {
        opacity: 1;
        visibility: visible;
    }
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
    height: 350px;
    max-height: calc(100vh - 20px);
    transition: height 0.3s ease-in-out;
    border-radius: var(--border-default);
}

.close-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 3.375rem;
    height: 4.0625rem;
    z-index: 1;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.menu-slide {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;

    .slide-header {
        padding: 0 1.25rem;
        height: 4.0625rem;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-shrink: 0;

        .slide-header-title {
            font-size: 1.225rem;
            line-height: 1.4375rem;
            font-weight: 500;
        }

        .back-button {
            font-size: 0.9375rem;
            line-height: 3.125rem;
            height: 3.125rem;
            padding: 0 0.9375rem 0 1.25rem;
            cursor: pointer;
            margin-left: -1.25rem;

            &:before {
                content: '↩';
                font-size: 2rem;
            }
        }
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
            position: relative;

            &:after {
                content: '\2794';
                position: absolute;
                top: calc(50% - 5px);
                right: 0;
                font-size: 1.25rem;
                line-height: 0.625rem;
                pointer-events: none;
            }

            p {
                display: block;
                width: 100%;
                text-align: left;
                font-weight: 400;
                padding: 0.875rem 0;

                .nav-link {
                    display: block;
                }
            }
        }
    }
}

.menu-mobile-btn {
    width: 100%;
    margin-bottom: 1rem;
}

.active-slide {
    transform: translateX(0);
}

.user-profile {
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

    &:hover {
        .user-dropdown {
            opacity: 1;
            visibility: visible;
            transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out,
                transform 0.2s ease-in-out, -webkit-transform 0.2s ease-in-out;
        }
    }

    .user-dropdown {
        position: absolute;
        top: 2.75rem;
        left: -6.5rem;
        background: #fff;
        border: 1px solid var(--primary-color);
        border-radius: var(--border-default);
        width: 10rem;
        transform: translateY(5px);
        opacity: 0;
        visibility: hidden;

        &:before {
            content: '';
            position: absolute;
            top: -0.5625rem;
            left: 7.25rem;
            background: #fff;
            border-left: 1px solid var(--primary-color);
            border-top: 1px solid var(--primary-color);
            width: 1rem;
            height: 1rem;
            transform: rotate(45deg);
        }

        ul {
            padding: 1.5625rem 1.875rem;

            li {
                font-size: 1.0625rem;
                line-height: 1.4375rem;
                margin-bottom: 1.0625rem;

                a {
                    color: #555;
                    font-weight: 500;
                }

                a:hover {
                    color: #0085ad;
                }
            }
        }
    }

    .user-pic-wrapper {
        margin: 0;
        padding: 0;
        height: 36px;
        width: 36px;
        background-color: transparent;
        border-radius: 100%;
        cursor: pointer;

        .user-pic {
            margin: 0;
            padding: 0;
            border-radius: 100%;
            height: 36px;
            width: 36px;
        }
    }
}

.mobile-phone-link {
    display: none;
    margin: 0 auto;
    a {
        font-size: 1.25rem;
        font-weight: 500;
        color: #555;
        border-bottom: 2px solid var(--primary-color);
    }

    @media only screen and (max-width: 750px) {
        display: block;
    }
}

.login-options {
    @media only screen and (max-width: 1024px) {
        display: none;
    }
}
</style>
