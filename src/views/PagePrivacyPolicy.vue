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
            title: PAGE_TITLE.PRIVACY + PAGE_TITLE.BRAND_SUFFIX,
        };
    },
};
</script>
<style></style>
