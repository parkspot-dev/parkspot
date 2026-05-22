<template>
    <TemplateError :msg="msg" @home-btn="homeBtn"></TemplateError>
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
            title: PAGE_TITLE.ERROR + PAGE_TITLE.BRAND_SUFFIX,
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
            if (
                this.$route.params.msg != null &&
                this.$route.params.msg != ''
            ) {
                this.msg = this.$route.params.msg;
            }
        },
    },
};
</script>

<style></style>
