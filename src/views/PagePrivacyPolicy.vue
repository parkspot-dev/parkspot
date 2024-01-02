<template>
    <TemplatePrivacyPolicy></TemplatePrivacyPolicy>
</template>
<script>
import TemplatePrivacyPolicy from '../components/templates/TemplatePrivacyPolicy.vue';
import { PAGE_TITLE } from '@/constant/constant';
export default {
    name: 'PagePrivacyPolicy',
    components: {
        TemplatePrivacyPolicy,
    },
    metaInfo() {
        return {
            title: PAGE_TITLE.PRIVACY,
            titleTemplate: PAGE_TITLE.TITLE_TEMPLATE + '%s',
        };
    },
};
</script>
<style></style>
