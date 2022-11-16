<template>
    <TemplateSpotDetail :spotDetails="spotDetails"></TemplateSpotDetail>
</template>

<script>
import TemplateSpotDetail from '../components/templates/TemplateSpotDetail.vue';
import { mayaClient } from '@/services/api';

export default {
    name: 'PageSpotDetail',
    components: {
        TemplateSpotDetail,
    },
    data() {
        return {
            spotId: null,
            spotDetails: null,
        };
    },
    mounted() {
        this.spotId = this.$route.params.spotId;
        this.getSpotDetails();
    },
    methods: {
        async getSpotDetails() {
            const res = await mayaClient.get(
                `/site?siteID=${this.spotId}&getOwnerInfo=false`,
            );
            this.spotDetails = res.Site;
            console.log(this.spotDetails);
        },
    },
};
</script>