<template>
    <TemplateThankYou :msg="msg" @home-btn="homeBtn"></TemplateThankYou>
</template>

<script>
import TemplateThankYou from '../components/templates/TemplateThankYou.vue';
import { PAGE_TITLE } from '@/constant/constant';
import { track, EVENTS } from '@/lib/analytics';

// Maps the upstream `?from=` query into the funnel_name used by the
// Phase-1 spec. Lead funnels (vo/so/contact) emit `lead_confirmed`;
// the booking funnel emits `purchase_confirmed` instead and requires
// the `?t=` (transaction_id) param forwarded by PagePaymentGateway on
// the success redirect.
const FROM_TO_FUNNEL = Object.freeze({
    vo: 'vo_lead',
    so: 'so_register',
    contact: 'contact',
});

export default {
    name: 'PageThankYou',
    components: {
        TemplateThankYou,
    },
    data() {
        return {
            msg: '',
        };
    },
    metaInfo() {
        return {
            title: PAGE_TITLE.THANK + PAGE_TITLE.BRAND_SUFFIX,
        };
    },
    mounted() {
        this.getMsg();
        this.fireFunnelConfirmation();
    },
    methods: {
        homeBtn() {
            this.$router.push({ name: 'Home' });
        },

        getMsg() {
            this.msg = this.$route.params.msg;
        },

        fireFunnelConfirmation() {
            const from = this.$route?.query?.from;

            // Booking funnel step 11: `purchase_confirmed` when the
            // payment-success redirect lands here with `?from=booking`.
            // The schema marks `transaction_id` as required on
            // `purchase_confirmed`, so we only fire when `?t=` is
            // present. A missing `?t=` indicates a stale bookmark /
            // direct visit, which we deliberately ignore.
            if (from === 'booking') {
                const t = this.$route?.query?.t;
                if (t) {
                    track(EVENTS.PURCHASE_CONFIRMED, {
                        funnel_name: 'booking',
                        transaction_id: String(t),
                    });
                }
                return;
            }

            // Lead funnels A/B/C — `lead_confirmed` is a sanity check,
            // not a conversion (per plan §2.6), so a drop here does not
            // affect Ads counts.
            const funnelName = from ? FROM_TO_FUNNEL[from] : undefined;
            if (!funnelName) {
                if (
                    typeof import.meta !== 'undefined' &&
                    import.meta.env &&
                    import.meta.env.DEV
                ) {
                    console.warn(
                        `[PageThankYou] missing or unknown ?from= query (got ${JSON.stringify(from)}); skipping confirmation event`,
                    );
                }
                return;
            }
            track(EVENTS.LEAD_CONFIRMED, {
                funnel_name: funnelName,
            });
        },
    },
};
</script>

<style></style>
