<template>
    <TemplateNearBy
        :nearByLocation="nearByLocation"
        :spots="spots"
        @details="spotDetails"
    ></TemplateNearBy>
</template>

<script>
import { firebase, getDatabase, ref, get, child } from '../firebase';
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
        this.nearByLocation = this.$route.params.pathMatch.split('/')[0].trim();
        this.getPageData();
        this.title = this.nearByLocation;
    },
    methods: {
        async getPageData() {
            const db = getDatabase(firebase);
            const dbref = ref(db);
            // console.log(check)
            // seo-pages database
            const pageData = await get(
                child(dbref, `seo-pages/${this.nearByLocation}`),
            )
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        return snapshot.val();
                    } else {
                        console.log('No data available');
                        this.show = !this.show;
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            this.spots = [...pageData.Sites];
            console.log(pageData);
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
