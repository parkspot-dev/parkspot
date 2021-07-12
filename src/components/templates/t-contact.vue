<template>
  <section class="t_contact hero is-medium">
    <div class="hero-body">
      <div class="container">
        <atom-b-title
          class="is-size-3-mobile is-size-2 ps_mb has-text-centered"
          :text="title"
        />
        <div class="columns">
          <div class="column is-2"></div>
          <o-contact-left class="column" />
          <o-contact-right class="column" />
          <!-- <div class="column"></div> -->
        </div>
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
.ps_mb {
  margin-bottom: 50px;
}
.t_contact {
  background-color: #ececec;
}

@media only screen and (min-width: 1024px) {
  .ps_mb {
    margin-bottom: 150px;
  }
}
</style>