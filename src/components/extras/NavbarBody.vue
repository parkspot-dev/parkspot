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
                        <a href="tel:+91 80929 96057">
                            <b-icon icon="phone" size="is-small"> </b-icon>
                            +91 809-299-6057
                        </a>
                    </p>
                </div>
                <!-- login buttons -->
                <div class="menu-wrapper-right">
                    <ul>
                        <li>
                            <p>
                                <a href="tel:+91 80929 96057">
                                    <b-icon icon="phone" size="is-small">
                                    </b-icon>
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
                            <AtomButton class="signup-btn" :outlined="true">
                                Sign up
                            </AtomButton>
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
                        <!-- main slide -->
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
                                        <b-icon icon="chevron-right"> </b-icon>
                                    </li>
                                    <li
                                        class="scroll-item"
                                        @click="toggleSlide(2)"
                                    >
                                        <p>
                                            <span>Company</span>
                                        </p>
                                        <b-icon icon="chevron-right"> </b-icon>
                                    </li>
                                    <li
                                        class="scroll-item"
                                        @click="toggleSlide(3)"
                                    >
                                        <p>
                                            <span> Services </span>
                                        </p>
                                        <b-icon icon="chevron-right"> </b-icon>
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
                                        <AtomButton class="menu-mobile-btn">
                                            Sign up
                                        </AtomButton>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <!-- my account slide -->
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
                                >
                                    <b-icon icon="arrow-left"> </b-icon>
                                </i>
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
                                        <AtomButton class="menu-mobile-btn">
                                            Sign up
                                        </AtomButton>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <!-- company slide -->
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
                                >
                                    <b-icon icon="arrow-left"> </b-icon>
                                </i>
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
                        <!-- service slide -->
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
                                >
                                    <b-icon icon="arrow-left"> </b-icon>
                                </i>
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
        <div class="primary-nav-mobile-backdrop"></div>
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

<style lang="scss" src="./navbar.scss"></style>
