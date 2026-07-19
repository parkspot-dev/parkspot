<template>
    <section class="">
        <TemplateVOPortal @submit="onSubmit"></TemplateVOPortal>
        <LoaderModal v-if="isLoading"></LoaderModal>
    </section>
</template>

<script>
import TemplateVOPortal from '../components/templates/TemplateVOPortal.vue';
import LoaderModal from '../components/extras/LoaderModal.vue';
import { mapActions, mapState } from 'vuex';
import { PAGE_TITLE } from '@/constant/constant';
import { track, EVENTS, LEAD_TYPES } from '@/lib/analytics';

// Normalize an Indian phone into E.164. parkspot stores numbers without
// the country code in most flows, so prepend +91 when the leading "+" is
// absent. This is the conversion-time format Google Ads expects for
// Enhanced Conversions.
function toE164India(raw) {
    if (!raw) return '';
    const trimmed = String(raw).trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('+')) return trimmed.replace(/[^\d+]/g, '');
    const digits = trimmed.replace(/\D/g, '');
    return digits ? `+91${digits}` : '';
}

export default {
    name: 'PageVOPortal',
    components: {
        TemplateVOPortal,
        LoaderModal,
    },
    metaInfo() {
        return {
            title: PAGE_TITLE.VO_PORTAL,
            titleTemplate: PAGE_TITLE.TITLE_TEMPLATE + '%s',
        };
    },
    data() {
        return {
            isLoading: false,
        };
    },
    computed: {
        // The form mutates `user/contactForm` in the store via
        // `update-contact` before emitting `onSubmit`, so the latest
        // email + phone values are always readable here at conversion
        // time. Keeping this as a computed (not a prop) avoids drilling
        // user data through the template layer.
        ...mapState('user', ['contactForm']),
    },
    methods: {
        ...mapActions({
            requestSpot: 'user/requestSpot',
        }),
        async onSubmit() {
            try {
                this.isLoading = true;
                await this.requestSpot();
                this.isLoading = false;
                // Step 5 — Funnel A conversion event. `enhanced_conversion_data`
                // carries plain email/phone; GTM hashes them client-side via
                // the Google Ads conversion tag's user-provided-data field.
                track(EVENTS.GENERATE_LEAD, {
                    funnel_name: 'vo_lead',
                    step_index: 5,
                    lead_type: LEAD_TYPES.PARKING_SEEKER,
                    value: 500,
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
                    query: { from: 'vo' },
                });
            } catch (error) {
                console.error({ error });
                this.$buefy.toast.open({
                    message: `Something went wrong!`,
                    type: 'is-danger',
                    duration: 2000,
                });
                this.$router.push({
                    name: 'error',
                    params: { msg: error.DisplayMsg },
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.custom-bg {
    background-color: var(--bg-color-tertiary);
}

.bg-decor {
    position: absolute;
    top: calc(0% - 7px);
    left: 0;
    clip-path: polygon(-54% 0, 184% 0, 50% 100%);
    width: 100%;
    height: 526px;
    background-color: var(--parkspot-white);
}
</style>
