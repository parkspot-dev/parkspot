<template>
    <TemplateError @homeBtn="homeBtn" :msg="msg"></TemplateError>
</template>

<script>
import TemplateError from '../components/templates/TemplateError.vue';
import { PAGE_TITLE } from '@/constant/constant';
export default {
    name: 'PageError',
    components: {
        TemplateError,
    },
    metaInfo() {
        return {
            title: PAGE_TITLE.ERROR,
            titleTemplate: PAGE_TITLE.TITLE_TEMPLATE + '%s',
        };
    },
    data() {
        return {
            msg: 'Something went wrong...!',
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
            if (this.$route.params.msg != null) {
                this.msg = this.$route.params.msg;
            }
        },
    },
};
</script>

<style></style>
