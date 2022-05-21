<template>
  <section class="t_contact section">
    <div class="container">
      <atom-b-title class="mb-6 has-text-centered" :text="title" />
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
  name: "TContact",
  components: { oContactLeft, OContactRight, AtomBTitle },
  data() {
    return {
      title: "Have Some Questions?",
    };
  },
};
</script>

<style scoped>
.t_contact {
  background-color: #ececec;
}
</style>
