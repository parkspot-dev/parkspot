<template>
  <TemplateThankYou @homeBtn="homeBtn" :msg="msg"></TemplateThankYou>
</template>

<script>
import TemplateThankYou from '../components/templates/TemplateThankYou.vue';
export default {
  name: 'PageThankYou',
  components: {
    TemplateThankYou,
  },
  data() {
    return {
      msg: '',
    };
  },
  mounted() {
    this.getMsg();
  },
  methods: {
    homeBtn() {
      this.$router.push({ name: 'Home' });
    },

    getMsg() {
      this.msg = this.$route.params.msg;
    },
  },
};
</script>

<style></style>
