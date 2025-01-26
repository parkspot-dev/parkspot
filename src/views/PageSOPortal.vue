<template>
    <section class="custom-bg">
        <div class="bg-decor"></div>
        <TemplateSOPortal @finalSubmit="onFinalSubmit"></TemplateSOPortal>
        <LoaderModal v-if="isLoading"></LoaderModal>
    </section>
</template>

<script>
import TemplateSOPortal from '../components/templates/TemplateSOPortal.vue';
import LoaderModal from '../components/extras/LoaderModal.vue';
import { mapActions } from 'vuex';
import { PAGE_TITLE } from '@/constant/constant';
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
    methods: {
        ...mapActions({
            register: 'user/register',
            login: 'user/login',
            kyc: 'user/kyc',
            contact: 'user/contact',
        }),
        async onFinalSubmit() {
            console.log("Inside contact..");
            try {
                this.isLoading = true;
                this.contact();
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
