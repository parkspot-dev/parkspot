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
            if (this.$route.params.msg) {
                this.msg = this.$route.params.msg
                    .toString()
                    .replace('Error:', '');
            }
        },
    },
};
</script>

<style></style>
