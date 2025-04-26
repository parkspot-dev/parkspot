<template>
    <section class="custom-bg">
        <div class="bg-decor"></div>
        <TemplateSOPortal @finalSubmit="onFinalSubmit"></TemplateSOPortal>
        <LoaderModal v-if="isLoading"></LoaderModal>
    </section>
</template>
<script>
import TemplateSOPortal from '../components/templates/TemplateSOPortal.vue';
import LoaderModal from '@/components/extras/LoaderModal.vue';
import { mapActions, mapState } from 'vuex';
import { PAGE_TITLE } from '@/constant/constant';
import imageUploadService from '@/services/ImageUploadService';
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
                imageUploadService
                    .uploadImages(this.contactForm.images, this.contactForm.cno)
                    .then((res) => {
                        if (res.success) {
                            this.updateImages(res?.urls);
                            this.registerSpot();
                        }
                    });
                this.isLoading = false;
                this.$buefy.toast.open({
                    message: 'ParkSpot registered successfully!',
                    type: 'is-success',
                    duration: 2000,
                });
                this.$router.push({ name: 'thankYou' });
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
