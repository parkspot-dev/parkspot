<template>
    <TemplateSpotDetail></TemplateSpotDetail>
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
            spotDetails: null,
        };
    },
    mounted() {
        this.getSpotDetails();
    },
    methods: {
        async getSpotDetails() {
            const res = await mayaClient.get(
                '/site?siteID=BLR%23RTNAGAR%23HANIELEGANC&getOwnerInfo=false',
            );
            this.spotDetails = res;
            console.log(this.spotDetails);
        },
    },
};
</script>