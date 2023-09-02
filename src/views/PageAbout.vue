<template>
    <div class="bg-wrap">
        <TemplateAbout></TemplateAbout>
    </div>
</template>

<script>
import TemplateAbout from '../components/templates/TemplateAbout.vue';
import { PAGE_TITLE } from '@/constant/constant';
export default {
    name: 'PageAbout',
    components: {
        TemplateAbout,
    },
    metaInfo() {
        return {
            title: this.title,
            titleTemplate: PAGE_TITLE.TITLE_TEMPLATE + '%s',
        };
    },
    data() {
        return {
            title: undefined,
            PAGE_TITLE,
        };
    },
    watch: {
        $route: {
            handler: function (to) {
                if (to.name == 't-about') {
                    this.title = PAGE_TITLE.ABOUT;
                }
            },
            deep: true,
            immediate: true,
        },
    },
};
</script>

<style scoped>
.bg-wrap {
    background-color: var(--parkspot-white);
}
</style>
