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
                    Blog
                </b-navbar-item>
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
            </template>
        </b-navbar>
    </header>
</template>

<script>
export default {
    name: 'NavbarBody',
    data() {
        return {
            parkspotIcon: require('@/assets/pstopmini.png'),
            parkspotText: require('@/assets/pstoptext.png'),
        };
    },
};
</script>

<style >
.custom-navpad {
    padding: 0.25rem 2rem;
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
