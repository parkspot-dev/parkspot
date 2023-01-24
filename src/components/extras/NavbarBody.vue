<template>
    <header>
        <b-navbar class="has-shadow custom-navpad" fixed-top>
            <template #brand>
                <b-navbar-item tag="router-link" :to="{ path: '/' }">
                    <img :src="parkspotIcon" alt="parkspot icon" />
                    <img :src="parkspotText" alt="parkspot text" />
                </b-navbar-item>
            </template>

            <template #end>
                <b-navbar-dropdown label="Company" hoverable>
                    <b-navbar-item tag="router-link" :to="{ name: 'Home' }">
                        Home
                    </b-navbar-item>
                    <b-navbar-item tag="router-link" :to="{ name: 't-about' }">
                        About
                    </b-navbar-item>
                    <b-navbar-item tag="router-link" :to="{ name: 'features' }">
                        Features
                    </b-navbar-item>
                    <b-navbar-item tag="router-link" :to="{ name: 'blog' }">
                        Blogs
                    </b-navbar-item>
                </b-navbar-dropdown>
                <b-navbar-dropdown label="Services" hoverable>
                    <b-navbar-item tag="router-link" :to="{ name: 'VOPortal' }">
                        Request Spot
                    </b-navbar-item>
                    <b-navbar-item tag="router-link" :to="{ name: 'SOPortal' }">
                        Register Spot
                    </b-navbar-item>
                </b-navbar-dropdown>
                <b-navbar-item tag="router-link" :to="{ name: 'Faq' }">
                    Faq
                </b-navbar-item>

                <template v-if="isAuthReady">
                    <!-- user logged out -->
                    <b-navbar-item tag="div" v-if="!user">
                        <div class="buttons">
                            <AtomButton @click.native="logInBtn"
                                >Log in</AtomButton
                            >
                            <AtomButton>Sign up</AtomButton>
                        </div>
                    </b-navbar-item>

                    <!-- user logged in -->
                    <b-navbar-item tag="div" v-if="user">
                        <div class="user-profile">
                            <img
                                class="user-pic"
                                :src="user.photoURL"
                                alt="profile image"
                            />
                            <!-- user profile dropdown -->
                            <ul class="user-dropdown">
                                <li class="dropdown-list"><a> Profile </a></li>
                                <li class="dropdown-list">
                                    <a> Edit Profile </a>
                                </li>
                                <li class="dropdown-list">
                                    <a @click="signout"> Sign Out </a>
                                </li>
                            </ul>
                        </div>
                    </b-navbar-item>
                </template>
            </template>
        </b-navbar>
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
            parkspotIcon: require('@/assets/pstopmini.png'),
            parkspotText: require('@/assets/pstoptext.png'),
        };
    },
    computed: {
        ...mapState('user', {
            user: (state) => state.user,
            isAuthReady: (state) => state.isAuthReady,
        }),
    },
    mounted() {
        console.log(this.isLogIn);
    },
    methods: {
        ...mapMutations('user', {
            updateLoginModal: 'update-login-Modal',
        }),
        ...mapActions('user', {
            goodBye: 'goodBye',
        }),

        logInBtn() {
            this.updateLoginModal(true);
        },

        signout() {
            this.goodBye();
        },
    },
};
</script>

<style lang="scss">
.custom-navpad {
    padding: 0.25rem 6rem;
}

@media only screen and (max-width: 1024px) {
    .custom-navpad {
        padding: 0.25rem 0;
    }
}

.navbar-item img {
    max-height: 2rem;
}

.navbar-end .navbar-item:hover {
    color: var(--secondary-color);
}

.navbar-end .navbar-item:active {
    color: var(--secondary-color);
}

.router-link-exact-active:visited {
    color: var(--secondary-color);
}

.navbar-item.router-link-exact-active.router-link-active {
    color: var(--secondary-color);
}

.navbar-item .navbar-link:hover {
    color: var(--secondary-color);
}

.navbar-item .navbar-link.is-active {
    color: var(--secondary-color);
}

.navbar-item .navbar-link:not(.is-arrowless)::after {
    border-color: var(--secondary-color);
}

.navbar-item.has-dropdown.is-hoverable.is-active .navbar-link {
    color: var(--secondary-color);
}

/* user profile css */
.user-profile {
    position: relative;
    display: inline-block;

    &:hover {
        .user-dropdown {
            visibility: visible;
        }
    }

    .user-pic {
        border-radius: 100%;
    }

    .user-dropdown {
        visibility: hidden;
        position: absolute;
        background-color: #fff;
        min-width: 160px;
        box-shadow: 0px 10px 50px rgb(0 0 0 / 10%);
        z-index: 1;
        padding: 32px 0;
        top: 90%;
        left: -200%;
        border-radius: 8px;

        .dropdown-list {
            display: flex;
            align-items: center;

            a {
                display: flex;
                align-items: center;
                width: 100%;
                padding: 8px 32px;
                color: var(--primary-text);
            }
        }
    }
}
</style>
