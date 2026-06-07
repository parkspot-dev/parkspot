<template>
    <TemplateThankYou :msg="msg" @home-btn="homeBtn"></TemplateThankYou>
</template>

<script>
import TemplateThankYou from '../components/templates/TemplateThankYou.vue';
import { PAGE_TITLE } from '@/constant/constant';
import { track, EVENTS } from '@/lib/analytics';

// Maps the upstream `?from=` query into the funnel_name used by the
// Phase-1 spec. `from=booking` is wired up in PR-5; missing/unknown
// values fall through to a dev warning and skip the event (per plan
// §2.6 — `lead_confirmed` is a sanity check, not a conversion, so a
// drop here does not affect Ads counts).
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
        this.fireLeadConfirmed();
    },
    methods: {
        homeBtn() {
            this.$router.push({ name: 'Home' });
        },

        getMsg() {
            this.msg = this.$route.params.msg;
        },

        fireLeadConfirmed() {
            const from = this.$route?.query?.from;
            const funnelName = from ? FROM_TO_FUNNEL[from] : undefined;
            if (!funnelName) {
                if (
                    typeof import.meta !== 'undefined' &&
                    import.meta.env &&
                    import.meta.env.DEV
                ) {

                    console.warn(
                        `[PageThankYou] missing or unknown ?from= query (got ${JSON.stringify(from)}); skipping lead_confirmed`,
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
