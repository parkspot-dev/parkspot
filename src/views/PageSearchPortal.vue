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
                :isLoading="loading"
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
                @on-search="searchRequestWithLatLng"
                @clear-input="onClearLatLngInput"
            ></MoleculeSearchBox>
            <TemplateSearchPortal
                :isLoading="loading"
                :parkingRequests="interestedVOList"
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
            isLoading: false,
            VOMobile: this.searchMobile,
        };
    },
    computed: {
        ...mapState('searchPortal', [
            'activeTab',
            'SOLatLngInput',
            'searchMobile',
            'totalRequests',
            'parkingRequests',
            'interestedVOList',
            'loading',
            'errorMessage',
            'hasError',
            'isTotalRequestFetched',
        ]),
        activeTabView: {
            get() {
                return this.activeTab;
            },
            set(tabNo) {
                const currentTab =
                    tabNo === 0 ? 'parking-request' : 'interested-request';
                this.$router.push({
                    path: this.$route.path,
                    query: { tab: currentTab },
                });
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
        if (
            !this.isTotalRequestFetched &&
            Object.keys(this.$route.query).length === 1
        ) {
            this.getTotalRequests();
        }
        const tab = this.$route.query['tab'];
        if (tab) {
            if (tab === 'interested-request') {
                this.updateActiveTab(1);
                if (this.$route.query['lat'] && this.$route.query['lng']) {
                    const lat = this.$route.query['lat'];
                    const lng = this.$route.query['lng'];
                    this.updateSOLatLngInput(lat + ',' + lng);
                    this.getInterestedVO(this.SOLatLngInput);
                }
            } else {
                this.updateActiveTab(0);
                const mobile = this.$route.query['mobile'];
                if (mobile) {
                    this.updateMobileInput(mobile);
                }
                this.getParkingRequests(this.$route.query['mobile']);
            }
        } else {
            this.updateActiveTab(0);
            this.$router.push({
                path: this.$route.fullPath,
                query: { tab: 'parking-request' },
            });
        }
        this.getAgents();
    },
    methods: {
        ...mapActions('searchPortal', [
            'updateActiveTab',
            'updateSOLatLngInput',
            'getAgents',
            'updateMobileInput',
            'getParkingRequests',
            'resetError',
            'getInterestedVO',
            'getTotalRequests',
            'resetParkingRequest',
            'resetInterestedVOList',
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
                onConfirm: () => {
                    // Make Mobile Input Empty
                    if (this.searchMobile) {
                        this.updateMobileInput('');
                    }
                    // Make LatLngInput to empty
                    if (this.SOLatLngInput) {
                        this.updateSOLatLngInput('');
                    }
                    // Check for current tab
                    const tab =
                        this.activeTab === 0
                            ? 'parking-request'
                            : 'interested-request';
                    // Reset Error
                    this.resetError();
                    // Push Back
                    this.$router.push({
                        name: 'SearchPortal',
                        query: { tab: tab },
                    });
                },
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
        async searchRequestWithLatLng(latlng) {
            const location = latlng.trim().split(',');
            const lat = location[0].trim();
            const lng = location[1].trim();
            this.$router.push({
                path: this.$route.fullPath,
                query: { lat: lat, lng: lng },
            });
            this.getInterestedVO(lat + ',' + lng);
        },
        // Clear Mobile Input
        async onClearMobileInput() {
            if (this.$route.query.mobile) {
                this.updateMobileInput('');
                this.$router.replace({ name: 'SearchPortal' });
                if (this.totalRequests) {
                    this.resetParkingRequest(this.totalRequests);
                }
            }
        },
        // Clear LatLng Input
        async onClearLatLngInput() {
            if (this.$route.query['lat'] && this.$route.query['lng']) {
                this.updateSOLatLngInput('');
                this.$router.replace({
                    name: 'SearchPortal',
                    query: { tab: 'interested-request' },
                });
                if (this.totalRequests) {
                    this.resetInterestedVOList(this.totalRequests);
                }
            }
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
    watch: {
        hasError(error) {
            if (error) {
                this.alertError(this.errorMessage);
            }
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
