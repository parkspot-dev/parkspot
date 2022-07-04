<template>
  <section>
    <TemplateSOPortal @finalSubmit="onFinalSubmit"></TemplateSOPortal>
  </section>
</template>

<script>
import TemplateSOPortal from "../components/templates/TemplateSOPortal.vue";
import { mapActions } from "vuex";
export default {
  name: "PageSOPortal",
  components: {
    TemplateSOPortal,
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      register: "soportal/register",
      login: "soportal/login",
      kyc: "soportal/kyc",
      contact: "soportal/contact",
    }),
    async onFinalSubmit() {
      try {
        await this.register();
        await this.login();
        await this.kyc();
        await this.contact(); // todo contact can be fired in parallel
      } catch (error) {
        console.error({ error });
      }
    },
  },
};
</script>

<!-- <style scoped>
.ps_thank {
  text-align: center;
  padding: 50px;
}

/* new CSS */
.ps-so-portal-section {
  /* padding: 9.6rem auto; */
  background-color: #fffcee;
  padding: 9.6rem 0;
}
</style>  -->
