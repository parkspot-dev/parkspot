<template>
    <b-tabs v-model="activeTab">
        <b-tab-item label="Parking Request (VO/SO)">
            <TemplateSearchPortal
                :parkingRequests="parkingRequests"
                :isLoading="isLoading"
                :isSummary="true"
                @updateRequest="updateRequest"
                @toSrp="toSrp"
            ></TemplateSearchPortal>
        </b-tab-item>

        <b-tab-item label="Interested Request(VO)">
            <div class="request-search-control">
                <p></p>
                <AtomInput v-model="SOLatLngInput"> </AtomInput>
                <AtomButton @click.native="getInterestedVO">Search</AtomButton>
            </div>
            <TemplateSearchPortal
                :parkingRequests="intrestedVOList"
                :isLoading="isLoading"
                @updateRequest="updateRequest"
                @toSrp="toSrp"
            ></TemplateSearchPortal>
        </b-tab-item>
    </b-tabs>
</template>
<script>
import TemplateSearchPortal from '../components/templates/TemplateSearchPortal.vue';
import { PAGE_TITLE } from '@/constant/constant';
import AtomInput from '../components/atoms/AtomInput.vue';
import AtomButton from '../components/atoms/AtomButton.vue';
import { mayaClient } from '@/services/api';

export default {
    name: 'PageSearchPortal',
    components: {
        TemplateSearchPortal,
        AtomInput,
        AtomButton,
    },
    metaInfo() {
        return {
            title: PAGE_TITLE.SEARCH_PORTAL,
            titleTemplate: PAGE_TITLE.TITLE_TEMPLATE + '%s',
        };
    },
    data() {
        return {
            parkingRequests: [],
            isLoading: false,
            activeTab: 0,
            intrestedVOList: [],
            SOLatLngInput: '',
        };
    },
    created() {
        this.getParkingRequests();
    },
    methods: {
        async getParkingRequests() {
            this.isLoading = true;
            const parkingRequestList = await mayaClient.get(
                '/internal/parking-requests',
            );
            this.parkingRequests = parkingRequestList;
            this.isLoading = false;
        },
        async getInterestedVO() {
            this.isLoading = true;
            const location = this.SOLatLngInput.trim().split(',');
            const lat = location[0].trim();
            const lng = location[1].trim();
            const parkingRequestList = await mayaClient.get(
                `/search-requests?lat=${lat}&long=${lng}`,
            );
            this.intrestedVOList = parkingRequestList;
            this.isLoading = false;
        },
        async updateRequest(request) {
            try {
                this.isLoading = true;
                const res = await fetch(
                    'https://maya.parkspot.in/owner/request-comments',
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(request),
                    },
                );

                await res.json();

                this.$buefy.toast.open({
                    message: `Sucessfully updated!`,
                    type: 'is-success',
                    duration: 2000,
                });
            } catch (error) {
                console.error({ error });

                this.$buefy.toast.open({
                    message: `Something went wrong!`,
                    type: 'is-danger',
                    duration: 2000,
                });
            }

            this.isLoading = false;
        },
        toSrp(lat, lng) {
            const latlng = [lat, lng].toString();
            const routeData = this.$router.resolve({
                name: 'srp',
                query: {
                    latlng,
                },
            });
            window.open(routeData.href, '_blank');
        },
    },
};
</script>

<style lang="scss" scoped>
.tab-item {
    .request-search-control {
        display: flex;
        justify-content: center;
        gap: 10px;
    }
}
</style>
