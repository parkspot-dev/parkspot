<template>
    <TemplateThankYou :msg="msg" @home-btn="homeBtn"></TemplateThankYou>
</template>

<script>
import TemplateThankYou from '../components/templates/TemplateThankYou.vue';
import { PAGE_TITLE } from '@/constant/constant';
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
    metaInfo() {
        return {
            title: PAGE_TITLE.THANK,
            titleTemplate: PAGE_TITLE.TITLE_TEMPLATE + '%s',
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
