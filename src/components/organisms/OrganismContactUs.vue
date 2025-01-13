<template>
    <div class="contact-us">
        <div class="contact-us-header mg-large">
            <AtomHeading class="mb-2">Got a question?</AtomHeading>
            <AtomParagraph>
                Fill up the form and our Team will get back to you within 24
                hours.
            </AtomParagraph>
        </div>

        <div>
            <div class="contact-us-options mg-medium">
                <a class="options" :href="helplineRef">
                    <AtomIcon :icon="'phone'"> </AtomIcon>
                    <span> {{ helplineNumber }} </span>
                </a>
                <a class="options" href="mailto:connect@parkspot.in">
                    <AtomIcon :icon="'email'"> </AtomIcon>
                    <span> connect@parkspot.in </span>
                </a>
                <a class="options" :href="gMapLoc" target="_blank">
                    <AtomIcon :icon="'map-marker'"> </AtomIcon>
                    <span>
                        2nd Floor, Nextcoworks BTM Layout, BTM 2nd Stage,
                        Bengaluru, Karnataka 560076
                    </span>
                </a>
            </div>

            <div class="social-groups">
                <a
                    class="social-icon"
                    href="https://www.facebook.com/parkspot.in"
                    target="_blank"
                >
                    <AtomIcon :icon="'facebook'" :size="'is-medium'">
                    </AtomIcon>
                </a>
                <a
                    class="social-icon"
                    href="https://www.instagram.com/parkspot.in/"
                    target="_blank"
                >
                    <AtomIcon
                        :icon="'instagram'"
                        :size="'is-medium'"
                    ></AtomIcon>
                </a>
                <a
                    class="social-icon"
                    href="https://www.linkedin.com/company/parkspot-in/"
                    target="_blank"
                >
                    <AtomIcon :icon="'linkedin'" :size="'is-medium'">
                    </AtomIcon>
                </a>
                <a
                    class="social-icon"
                    href="https://www.youtube.com/@parkspot4468"
                    target="_blank"
                >
                    <AtomIcon :icon="'youtube'" :size="'is-medium'">
                    </AtomIcon>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import AtomHeading from '../atoms/AtomHeading.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
import { mapState } from 'vuex';
export default {
    name: 'OrganismContactUs',
    components: {
        AtomHeading,
        AtomParagraph,
        AtomIcon,
    },
    data() {
        return {
            gMapLoc: `https://www.google.com/maps/dir//Nextcoworks,+Ranka+Colony+Rd,
          +Munivenkatppa+Layout,+Bilekahalli,+Bengaluru,+Karnataka+560076/@12.9035521,
          77.6045287,18.26z/data=!4m16!1m6!3m5!1s0x3bae1503ac2c2bc5:0x8b4a7cefbd0adbfd!
          2sNextcoworks!8m2!3d12.9033359!4d77.6050157!4m8!1m0!1m5!1m1!1s0x3bae1503ac2c2bc5
          :0x8b4a7cefbd0adbfd!2m2!1d77.6050157!2d12.9033359!3e2`,
        };
    },
    computed: {
        ...mapState('config', ['helplineNumber', 'helplineRef']),
    },
};
</script>
<style lang="scss" scoped>
.contact-us {
    padding-right: 12rem;
    padding-left: 4rem;
}

@media only screen and (max-width: 1200px) {
    .contact-us {
        padding-right: 8rem;
        padding-left: 2rem;
    }
}

@media only screen and (max-width: 1000px) {
    .contact-us {
        padding: 2rem;
    }
}

.options {
    display: block;
    margin-bottom: 0.75rem;
    padding: 1rem 0.5rem;
    border: 2px solid transparent;
    border-radius: var(--border-default);
    color: var(--parkspot-black);
    transition: all 0.3s;
}

.options:hover {
    border: 2px solid var(--secondary-color);
}

.mg-large {
    margin-bottom: 5rem;
}

.mg-medium {
    margin-bottom: 3rem;
}

@media only screen and (max-width: 1200px) {
    .mg-large {
        margin-bottom: 3rem;
    }

    .mg-medium {
        margin-bottom: 1rem;
    }
}

.social-groups {
    display: flex;
    gap: 15%;
}

.social-icon {
    position: relative;
    z-index: 1;
    padding: 0.5rem;
    color: var(--parkspot-black);
}

.social-icon:hover {
    color: var(--primary-color);
}

.social-icon:hover::after {
    position: absolute;
    top: -4px;
    left: -5px;
    z-index: -1;
    padding: 1.75rem;
    border-radius: 100%;
    background-color: var(--secondary-color);
    content: '';
}
</style>
