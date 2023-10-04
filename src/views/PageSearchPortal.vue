<template>
    <b-tabs v-model="activeTabView">
        <b-tab-item label="Parking Request (VO/SO)">
            <div class="request-search-control">
                <AtomInput v-model="VOMobile"> </AtomInput>
                <AtomButton @click.native="getParkingRequests">Search</AtomButton>
            </div>
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
                <AtomInput v-model="SOLatLng"> </AtomInput>
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
import { mapActions, mapState } from 'vuex';

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
            intrestedVOList: [],
            VOMobile:'',
        };
    },
    computed: {
        ...mapState('searchPortal', ['activeTab', 'SOLatLngInput']),
        activeTabView: {
            get() {
                return this.activeTab;
            },
            set(tabNo) {
                this.updateActiveTab(tabNo);
            },
        },
        SOLatLng: {
            get() {
                return this.SOLatLngInput;
            },
            set(LatLng) {
                this.updateSOLatLngInput(LatLng);
            },
        },
    },
    created() {
        this.getParkingRequests();
        if (this.SOLatLngInput) {
            this.getInterestedVO();
        }
    },
    methods: {
        ...mapActions('searchPortal', [
            'updateActiveTab',
            'updateSOLatLngInput',
        ]),
        async getParkingRequests() {
            this.isLoading = true;
            let parkingRequestURL = '/internal/parking-requests';
            if (this.VOMobile != '') {
                parkingRequestURL = parkingRequestURL + `?mobile=${this.VOMobile}`
            }
            this.parkingRequests = await mayaClient.get(
                 parkingRequestURL,
            );
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
