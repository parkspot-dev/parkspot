<template>
    <TemplateTerms></TemplateTerms>
</template>
<script>
import TemplateTerms from '../components/templates/TemplateTerms.vue';
import { PAGE_TITLE } from '@/constant/constant';
export default {
    name: 'PageTerms',
    components: {
        TemplateTerms,
    },
    metaInfo() {
        // Phase 2.5: direct branded title; no orphan-prone template.
        return {
            title: PAGE_TITLE.TERMS + PAGE_TITLE.BRAND_SUFFIX,
        };
    },
};
</script>
<style></style>
