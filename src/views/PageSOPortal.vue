<template>
  <section class="custom-bg">
    <div class="bg-decor"></div>
    <TemplateSOPortal @finalSubmit="onFinalSubmit"></TemplateSOPortal>
    <LoaderModal :isLoading="isLoading"></LoaderModal>
  </section>
</template>

<script>
import TemplateSOPortal from '../components/templates/TemplateSOPortal.vue';
import LoaderModal from '../components/extras/LoaderModal.vue';
import { mapActions } from 'vuex';
export default {
  name: 'PageSOPortal',
  components: {
    TemplateSOPortal,
    LoaderModal,
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
      try {
        this.isLoading = true;
        await this.register();
        await this.login();
        await this.kyc();
        await this.contact(); // todo contact can be fired in parallel
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
        this.$router.push({ name: 'error' });
      }
    },
  },
};
</script>

<style scoped>
.custom-bg {
  background-color: var(--bg-color-tertiary);
}

.bg-decor {
  background-color: #fff;
  clip-path: polygon(-54% 0, 184% 0, 50% 100%);
  height: 526px;
  left: 0;
  position: absolute;
  top: calc(0% - 7px);
  width: 100%;
}
</style>
