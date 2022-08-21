<template>
    <div class="bg-wrap">
        <TemplateContactUs @contactUs="fireContact"></TemplateContactUs>
        <LoaderModal :isLoading="isLoading"></LoaderModal>
    </div>
</template>

<script>
import TemplateContactUs from '../components/templates/TemplateContactUs.vue';
import LoaderModal from '../components/extras/LoaderModal.vue';
import { mapActions } from 'vuex';
export default {
    name: 'PageContactUs',
    components: {
        TemplateContactUs,
        LoaderModal,
    },
    data() {
        return {
            isLoading: false,
        };
    },
    methods: {
        ...mapActions({
            onlyContact: 'user/onlyContact',
        }),
        async fireContact() {
            try {
                this.isLoading = true;

                await this.onlyContact();

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

                this.$router.push({ name: 'Home' });
            }
            this.isLoading = false;
        },
    },
};
</script>

<style scoped>
.bg-wrap {
    background-color: var(--bg-color-secondary);
    padding: 2.5rem 0;
    position: relative;
}

.bg-wrap::before {
    background-color: var(--bg-color-tertiary);
    clip-path: polygon(300px 0, 100% 0, 100% 100%, 0 100%);
    content: '';
    display: block;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    width: calc(50vw + 150px);
}

@media only screen and (max-width: 760px) {
    .bg-wrap::before {
        clip-path: polygon(300px 70%, 100% 33%, 100% 100%, 0% 100%);
        width: calc(50vw + 360px);
    }
}
</style>
