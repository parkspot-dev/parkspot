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
    // Phase 2.5: direct branded title. The legacy form orphaned a
    // `'ParkSpot | '` template substitution before the $route watcher
    // had a chance to assign `this.title`. The default now ships the
    // correct value on first read; the watcher exists only to refresh
    // on subsequent in-app navigations into this route.
    metaInfo() {
        return {
            title: this.title,
        };
    },
    data() {
        return {
            title: PAGE_TITLE.ABOUT + PAGE_TITLE.BRAND_SUFFIX,
            PAGE_TITLE,
        };
    },
    watch: {
        $route: {
            handler: function (to) {
                if (to.name == 't-about') {
                    this.title = PAGE_TITLE.ABOUT + PAGE_TITLE.BRAND_SUFFIX;
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
