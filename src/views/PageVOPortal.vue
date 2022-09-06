<template>
  <section class="custom-bg">
    <div class="bg-decor"></div>
    <TemplateVOPortal @finalSubmit="onFinalSubmit"></TemplateVOPortal>
    <LoaderModal :isLoading="isLoading"></LoaderModal>
  </section>
</template>

<script>
import TemplateVOPortal from '../components/templates/TemplateVOPortal.vue';
import LoaderModal from '../components/extras/LoaderModal.vue';
import { mapActions } from 'vuex';
export default {
  name: 'PageVOPortal',
  components: {
    TemplateVOPortal,
    LoaderModal,
  },
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    ...mapActions({
      requestSpot: 'user/requestSpot',
    }),
    async onFinalSubmit() {
      try {
        this.isLoading = true;
        await this.requestSpot();
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
