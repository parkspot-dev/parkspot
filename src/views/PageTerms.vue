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
        return {
            title: PAGE_TITLE.TERMS,
            titleTemplate: PAGE_TITLE.TITLE_TEMPLATE + '%s',
        };
    },
};
</script>
<style></style>
