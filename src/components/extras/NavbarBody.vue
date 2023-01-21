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
                <b-navbar-item tag="div" v-if="loggedIn">
                    <div class="buttons">
                        <!-- <a class="button is-primary">
                            <strong>Sign up</strong>
                        </a>
                        <a class="button is-light"> Log in </a> -->
                        <AtomButton @click.native="logIn">Log in</AtomButton>
                        <AtomButton>Sign up</AtomButton>
                    </div>
                </b-navbar-item>
                <b-navbar-item tag="div" v-if="!loggedIn">
                    <div id="photo-container">
                        <img id="photo" />
                    </div>
                </b-navbar-item>
            </template>
        </b-navbar>
    </header>
</template>

<script>
import AtomButton from '../atoms/AtomButton.vue';
import { authInstance } from '../../firebase.js';
export default {
    name: 'NavbarBody',
    components: {
        AtomButton,
    },
    data() {
        return {
            parkspotIcon: require('@/assets/pstopmini.png'),
            parkspotText: require('@/assets/pstoptext.png'),
            loggedIn: true,
        };
    },
    mounted() {
        authInstance.onAuthStateChanged(function (user) {
            //   document.getElementById('loading').style.display = 'none';
            //   document.getElementById('loaded').style.display = 'block';
            // console.log('hello')
            user ? handleSignedInUser(user) : handleSignedOutUser();
            // console.log(user);
        });
    },
    methods: {
        logIn() {
            this.$router.push({
                name: 'Login',
            });
        },

        handleSignedOutUser() {
            this.loggedIn = true;
        },

        handleSignedInUser(user) {
            // document.getElementById('user-signed-in').style.display = 'block';
            // document.getElementById('user-signed-out').style.display = 'none';
            // document.getElementById('name').textContent = user.displayName;
            // document.getElementById('email').textContent = user.email;
            // document.getElementById('phone').textContent = user.phoneNumber;
            // if (user.photoURL) {
            //     let photoURL = user.photoURL;
            //     // Append size to the photo URL for Google hosted images to avoid requesting
            //     // the image with its original resolution (using more bandwidth than needed)
            //     // when it is going to be presented in smaller size.
            //     if (
            //         photoURL.indexOf('googleusercontent.com') != -1 ||
            //         photoURL.indexOf('ggpht.com') != -1
            //     ) {
            //         photoURL =
            //             photoURL +
            //             '?sz=' +
            //             document.getElementById('photo').clientHeight;
            //     }
            //     document.getElementById('photo').src = photoURL;
            //     document.getElementById('photo').style.display = 'block';
            // } else {
            //     document.getElementById('photo').style.display = 'none';
            // }
            console.log('logged in ', user);
        },
    },
};
</script>

<style >
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
</style>
