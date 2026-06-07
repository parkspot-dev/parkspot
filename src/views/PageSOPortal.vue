<template>
    <section class="custom-bg">
        <div class="bg-decor"></div>
        <TemplateSOPortal @final-submit="onFinalSubmit"></TemplateSOPortal>
        <LoaderModal v-if="isLoading"></LoaderModal>
    </section>
</template>
<script>
import TemplateSOPortal from '../components/templates/TemplateSOPortal.vue';
import LoaderModal from '@/components/extras/LoaderModal.vue';
import { mapActions, mapState } from 'vuex';
import { PAGE_TITLE } from '@/constant/constant';
import imageUploadService from '@/services/ImageUploadService';
import { track, EVENTS, LEAD_TYPES } from '@/lib/analytics';

// Normalize an Indian phone into E.164 for Enhanced Conversions. Mirrors
// the helper in PageVOPortal.vue; not extracted because the analytics
// layer's contract is "components hold business logic, the wrapper just
// pushes" — a normalization util living elsewhere would invite drift.
function toE164India(raw) {
    if (!raw) return '';
    const trimmed = String(raw).trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('+')) return trimmed.replace(/[^\d+]/g, '');
    const digits = trimmed.replace(/\D/g, '');
    return digits ? `+91${digits}` : '';
}
export default {
    name: 'PageSOPortal',
    components: {
        TemplateSOPortal,
        LoaderModal,
    },
    metaInfo() {
        return {
            title: PAGE_TITLE.SO_PORTAL,
            titleTemplate: PAGE_TITLE.TITLE_TEMPLATE + '%s',
        };
    },
    data() {
        return {
            isLoading: false,
        };
    },
    computed: {
        ...mapState('user', ['contactForm']),
    },
    methods: {
        ...mapActions({
            register: 'user/register',
            login: 'user/login',
            kyc: 'user/kyc',
            contact: 'user/contact',
            registerSpot: 'user/registerSpot',
            updateImages: 'user/updateImages',
        }),
        async onFinalSubmit() {
            try {
                this.isLoading = true;

                const images = this.contactForm.images || [];
                const imageCount = Array.isArray(images) ? images.length : 0;

                // Step 4a — image upload begins. Funnel B has this extra
                // pair of steps because uploads are the slowest, most
                // failure-prone leg of the SO journey.
                track(EVENTS.IMAGE_UPLOAD_START, {
                    funnel_name: 'so_register',
                    step_index: '4a',
                    image_count: imageCount,
                });
                const uploadStartedAt = Date.now();

                const res = await imageUploadService.uploadImages(
                    images,
                    this.contactForm.cno,
                );

                // Step 4b — upload promise resolved. Fired regardless of
                // success/failure of the *registerSpot* call below; it
                // measures only the upload itself.
                track(EVENTS.IMAGE_UPLOAD_COMPLETE, {
                    funnel_name: 'so_register',
                    step_index: '4b',
                    image_count: imageCount,
                    duration_ms: Date.now() - uploadStartedAt,
                });

                if (res.success) {
                    this.updateImages(res?.urls);
                    await this.registerSpot();
                    // Step 5 — Funnel B conversion. Locked proxy ₹1,000;
                    // expectedRent travels alongside as analytics metadata
                    // (see plan.md §2.4 — not used as the conversion value).
                    track(EVENTS.GENERATE_LEAD, {
                        funnel_name: 'so_register',
                        step_index: 5,
                        lead_type: LEAD_TYPES.PARKING_OWNER,
                        value: 1000,
                        currency: 'INR',
                        expected_rent: this.contactForm?.expectedRent,
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
                        query: { from: 'so' },
                    });
                } else {
                    this.$buefy.toast.open({
                        message: 'Image upload failed!',
                        type: 'is-danger',
                        duration: 2000,
                    });
                }
            } catch (error) {
                console.error({ error });
                this.$buefy.toast.open({
                    message: 'Something went wrong!',
                    type: 'is-danger',
                    duration: 2000,
                });
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.custom-bg {
    padding: 20px;
}

.bg-decor {
    background-color: var(--secondary-color);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 60%, 0 100%);
    height: 120px;
    left: 0;
    opacity: 0.8;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 10;
}
</style>
