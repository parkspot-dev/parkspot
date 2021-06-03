<template>
  <section class="t_contact section">
    <div class="container">
      <atom-b-title class="is-size-3-mobile is-size-2 mb-5 has-text-centered" :text="title" />
      <div class="columns">
        <o-contact-left class="column" />
        <o-contact-right class="column" />
      </div>
    </div>
  </section>
</template>

<script>
import AtomBTitle from "@/components/atoms/atom-text/atom-b-title.vue";
import oContactLeft from "@/components/organisms/o-contact-left.vue";
import OContactRight from "@/components/organisms/o-contact-right.vue";
export default {
  components: { oContactLeft, OContactRight, AtomBTitle },
  name: "t-contact",
  data() {
    return {
      title: "Have Some Questions?",
    };
  },
};
</script>

<style scoped>
.ps_title {
  font-size: 30px;
}
</style>