<template>
  <TemplateError @homeBtn="homeBtn" :msg="msg"></TemplateError>
</template>

<script>
import TemplateError from '../components/templates/TemplateError.vue';
export default {
  name: 'PageError',
  components: {
    TemplateError,
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
