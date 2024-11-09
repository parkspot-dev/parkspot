<template>
    <b-tabs v-model="activeTabView">
        <b-tab-item label="Parking Request (VO/SO)">
            <div class="request-search-control">
                <MoleculeSearchBox
                    placeholder="Mobile"
                    :initialValue="searchMobile"
                    @on-search="searchRequestWithMobile"
                    @clear-input="onClearMobileInput"
                ></MoleculeSearchBox>
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
            <p></p>
            <MoleculeSearchBox
                placeholder="Lat,Long"
                :initialValue="SOLatLngInput"
                @on-search="getInterestedVO"
                @on-clear="clearLatLngInput"
            ></MoleculeSearchBox>
            <TemplateSearchPortal
                :isLoading="isLoading"
                :parkingRequests="intrestedVOList"
                @toSrp="toSrp"
                @updateRequest="updateRequest"
            ></TemplateSearchPortal>
        </b-tab-item>
    </b-tabs>
</template>
<script>
import TemplateSearchPortal from '../components/templates/TemplateSearchPortal.vue';
import { PAGE_TITLE } from '@/constant/constant';
import { mayaClient } from '@/services/api';
import { mapActions, mapState } from 'vuex';
import MoleculeSearchBox from '../components/molecules/MoleculeSearchBox.vue';

export default {
    name: 'PageSearchPortal',
    components: {
        TemplateSearchPortal,
        MoleculeSearchBox,
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
            VOMobile: this.searchMobile,
        };
    },
    computed: {
        ...mapState('searchPortal', ['activeTab', 'SOLatLngInput', 'searchMobile']),
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
    async created() {
        this.getAgents();
        const mobile = this.$route.query['mobile'];
        if(mobile){
            this.updateMobileInput(mobile)
        }
        else{
            this.updateMobileInput('')
        }
        

        this.getParkingRequests(this.$route.query['mobile']);
        if (this.SOLatLngInput) {
            this.getInterestedVO(this.SOLatLngInput);
        }
    },
    methods: {
        ...mapActions('searchPortal', [
            'updateActiveTab',
            'updateSOLatLngInput',
            'getAgents',
            'updateMobileInput'
        ]),
        alertError(msg) {
            this.$buefy.dialog.alert({
                title: 'Error',
                message: msg,
                type: 'is-danger',
                hasIcon: true,
                icon: 'alert-circle',
                ariaRole: 'alertdialog',
                ariaModal: true,
                // reload page on error
                // This will hamper interested VO section experience,
                // because interested VO does not change the URL and
                // reload the page will take to /search-portal
                // onConfirm: () => location.reload(),
                onConfirm: this.activeTab === 0 ? this.onClearMobileInput : this.clearLatLngInput
            });
        },
        async searchRequestWithMobile(voMobile) {
            if (voMobile != '') {
                // Update Search Text with voMobile 
                this.updateMobileInput(voMobile);

                this.$router.push({
                    path: this.$route.fullPath,
                    query: { mobile: voMobile },
                });
                this.getParkingRequests(voMobile);
            }
        },

         // Clear Mobile Input
         async onClearMobileInput() {
            if (this.$route.query.mobile) {
                this.updateMobileInput('')
                // Navigate to the main booking portal route
                this.$router.push('/search-portal');
                // Fetch the Agents Data
                this.getAgents();
            }
        },

        // Clear latLan Input

        async clearLatLngInput() {
            this.updateSOLatLngInput('')
        },

        async getParkingRequests(voMobile = '') {
            this.isLoading = true;
            let parkingRequestURL = '/internal/parking-requests';
            if (voMobile != '') {
                parkingRequestURL =
                    parkingRequestURL +
                    `?mobile=${voMobile.replace(/\s+/g, '')}`;
            }
            const response = await mayaClient.get(parkingRequestURL);
            this.isLoading = false;
            if (response.ErrorCode) {
                this.alertError(response.DisplayMsg);
                return;
            }
            this.parkingRequests = response;
        },
        async getInterestedVO(latlng) {
            this.isLoading = true;
            const location = latlng.trim().split(',');
            const lat = location[0].trim();
            const lng = location[1].trim();
            const parkingRequestList = await mayaClient.get(
                `/search-requests?lat=${lat}&long=${lng}`,
            );
            this.isLoading = false;
            if (parkingRequestList.ErrorCode) {
                this.alertError(parkingRequestList.DisplayMsg);
                return;
            }
            this.intrestedVOList = parkingRequestList;
        },
        async updateRequest(request) {
            try {
                this.isLoading = true;
                const response = await mayaClient.patch(
                    '/owner/request-comments',
                    request,
                );
                if (response.ErrorCode) {
                    this.alertError(response.DisplayMsg);
                } else {
                    this.$buefy.toast.open({
                        message: `Sucessfully updated!`,
                        type: 'is-success',
                        duration: 2000,
                    });
                }
            } catch (error) {
                console.error({ error });
                this.alertError('Something went wrong!');
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
