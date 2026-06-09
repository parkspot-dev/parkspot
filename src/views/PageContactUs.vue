<template>
    <div class="bg-wrap">
        <!--
            Phase 2.5b heading-hygiene follow-up: /contact/ is the only
            route where this template owns the page's primary heading
            ("Got a question?"). Opt back into <h1> here; everywhere
            else the template embeds default to <h2>, keeping the
            page's own <h1> (homepage banner, blog post title, etc.)
            as the single document landmark.
        -->
        <TemplateContactUs
            heading-level="h1"
            @contact-us="fireContact"
        ></TemplateContactUs>
        <LoaderModal v-if="isLoading"></LoaderModal>
    </div>
</template>

<script>
import TemplateContactUs from '../components/templates/TemplateContactUs.vue';
import LoaderModal from '../components/extras/LoaderModal.vue';
import { mapActions, mapState } from 'vuex';
import { PAGE_TITLE } from '@/constant/constant';
import { track, EVENTS, LEAD_TYPES } from '@/lib/analytics';

// Normalize an Indian phone into E.164 for Enhanced Conversions. See
// PageVOPortal.vue for rationale on duplication vs extracting a util.
function toE164India(raw) {
    if (!raw) return '';
    const trimmed = String(raw).trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('+')) return trimmed.replace(/[^\d+]/g, '');
    const digits = trimmed.replace(/\D/g, '');
    return digits ? `+91${digits}` : '';
}
export default {
    name: 'PageContactUs',
    components: {
        TemplateContactUs,
        LoaderModal,
    },
    // Phase 2.5: direct branded title — see PageAbout for rationale.
    metaInfo() {
        return {
            title: this.title,
        };
    },
    data() {
        return {
            isLoading: false,
            title: PAGE_TITLE.CONTACT + PAGE_TITLE.BRAND_SUFFIX,
            PAGE_TITLE,
        };
    },
    computed: {
        // The contact form mutates `user/contactForm` via `update-contact`
        // before emitting submit, so latest email/phone are readable here.
        ...mapState('user', ['contactForm']),
    },
    watch: {
        $route: {
            handler: function (to) {
                if (to.name == 'contactUs') {
                    this.title = PAGE_TITLE.CONTACT + PAGE_TITLE.BRAND_SUFFIX;
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        ...mapActions({
            onlyContact: 'user/onlyContact',
        }),
        async fireContact() {
            try {
                this.isLoading = true;

                await this.onlyContact();

                // Step 5 — Funnel C conversion event. Locked proxy ₹100.
                track(EVENTS.GENERATE_LEAD, {
                    funnel_name: 'contact',
                    step_index: 5,
                    lead_type: LEAD_TYPES.CONTACT,
                    value: 100,
                    currency: 'INR',
                    enhanced_conversion_data: {
                        email_address: this.contactForm?.email || '',
                        phone_number: toE164India(this.contactForm?.cno),
                    },
                });

                this.$buefy.toast.open({
                    message: 'ParkSpot registered successfully!',
                    type: 'is-success',
                    duration: 2000,
                });

                this.$router.push({
                    name: 'thankYou',
                    query: { from: 'contact' },
                });
            } catch (error) {
                console.error({ error });

                this.$buefy.toast.open({
                    message: `Something went wrong!`,
                    type: 'is-danger',
                    duration: 2000,
                });

                this.$router.push({ name: 'Home' });
            }
            this.isLoading = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.bg-wrap {
    position: relative;
    padding: 2.5rem 0;
    background-color: var(--parkspot-white);
}

.bg-wrap::before {
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    clip-path: polygon(300px 0, 100% 0, 100% 100%, 0 100%);
    content: '';
    width: calc(50vw + 150px);
    height: 100%;
    background-color: var(--bg-color-tertiary);
}

@media only screen and (max-width: 760px) {
    .bg-wrap::before {
        clip-path: polygon(300px 70%, 100% 33%, 100% 100%, 0% 100%);
        width: calc(50vw + 360px);
    }
}
</style>
