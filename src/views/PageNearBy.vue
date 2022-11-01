<template>
    <TemplateNearBy
        :nearByLocation="nearByLocation"
        :spots="spots"
    ></TemplateNearBy>
</template>

<script>
import { firebase, getDatabase, ref, get, child } from '../firebase';
import TemplateNearBy from '../components/templates/TemplateNearBy.vue';
export default {
    name: 'PageNearBy',
    components: {
        TemplateNearBy,
    },
    data() {
        return {
            spots: [],
            nearByLocation: '',
            show: false,
        };
    },
    mounted() {
        this.nearByLocation = this.$route.params.pathMatch.split('/')[0].trim();
        this.getPageData();
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
    },
};
</script>

<style></style>
