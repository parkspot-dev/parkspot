<template>
    <TemplateNearBy
        :nearByLocation="nearByLocation"
        :spots="spots"
        @details="spotDetails"
    ></TemplateNearBy>
</template>

<script>
import { getValueFromFirebase } from '../firebase';
import TemplateNearBy from '../components/templates/TemplateNearBy.vue';
import { PAGE_TITLE } from '@/constant/constant';
export default {
    name: 'PageNearBy',
    components: {
        TemplateNearBy,
    },
    metaInfo() {
        return {
            title: this.title,
            titleTemplate: PAGE_TITLE.DISCOVER + '%s',
        };
    },
    data() {
        return {
            spots: [],
            nearByLocation: '',
            show: false,
            title: undefined,
        };
    },
    mounted() {
        this.nearByLocation = this.$route.params.location.trim();
        this.getPageData();
        this.title = this.nearByLocation;
    },
    methods: {
        async getPageData() {
            const pageData = await getValueFromFirebase(
                `seo-pages/${this.nearByLocation}`,
            );
            if (pageData == null) {
                this.show = !this.show;
                return;
            }
            this.spots = [...pageData.Sites];
        },
        spotDetails(spotID) {
            const route = this.$router.resolve({
                name: 'spot-detail',
                params: {
                    spotId: spotID,
                },
            });
            window.open(route.href);
        },
    },
};
</script>

<style></style>
