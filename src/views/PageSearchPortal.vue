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
import { getActiveTabStatusLabel } from '../constant/enums';

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
            'parkingRequests',
            'interestedVOList',
            'loading',
            'errorMessage',
            'hasError',
        ]),
        activeTabView: {
            get() {
                return this.activeTab;
            },
            set(tabNo) {
                // Update activeTab with the selected tab number.
                // Clear the input field if it contains any value.
                this.updateActiveTab(tabNo);
                this.updateMobileInput('');
                this.updateSOLatLngInput('');
                this.$router.push({
                    path: this.$route.path,
                    query: { tab: getActiveTabStatusLabel(this.activeTab) },
                });
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
        const tab = this.$route.query['tab'];
        if (tab) {
            if (tab === 'interested-request') {
                this.updateActiveTab(1);
                if (this.$route.query['latlng']) {
                    const latlng = this.$route.query['latlng'];
                    this.updateSOLatLngInput(latlng);
                    this.getInterestedVO(this.SOLatLngInput);
                } else {
                    this.getParkingRequests();
                }
            } else {
                this.updateActiveTab(0);
                const mobile = this.$route.query['mobile'];
                if (mobile) {
                    this.updateMobileInput(mobile);
                    this.getParkingRequests();
                } else {
                    this.getParkingRequests();
                }
            }
        } else {
            this.updateActiveTab(0);
            this.$router.push({
                path: this.$route.fullPath,
                query: { tab: getActiveTabStatusLabel(this.activeTab) },
            });
            this.getParkingRequests();
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
                onConfirm: this.handleConfirm,
            });
        },
        async searchRequestWithMobile(voMobile) {
            if (voMobile != '') {
                // Sanitize Mobile Number
                const sanitizeMobileNumber = this.sanitizeMobile(voMobile);

                if (!sanitizeMobileNumber) {
                }
                // Update Search Text with voMobile
                this.updateMobileInput(voMobile);
                this.$router.push({
                    path: this.$route.fullPath,
                    query: { mobile: voMobile },
                });
            }
        },
        async searchRequestWithLatLng(latlng) {
            this.updateSOLatLngInput(latlng);
            this.$router.push({
                path: this.$route.fullPath,
                query: { latlng: latlng },
            });
        },
        // Clear Mobile Input
        async onClearMobileInput() {
            if (this.$route.query.mobile) {
                this.updateMobileInput('');
                this.$router.push({
                    name: 'SearchPortal',
                    query: { tab: getActiveTabStatusLabel(this.activeTab) },
                });
            }
        },
        // Clear LatLng Input
        async onClearLatLngInput() {
            if (this.$route.query['latlng']) {
                this.updateSOLatLngInput('');
                this.$router.push({
                    name: 'SearchPortal',
                    query: { tab: getActiveTabStatusLabel(this.activeTab) },
                });
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
        handleConfirm() {
            // Make Mobile Input Empty
            if (this.searchMobile) {
                this.updateMobileInput('');
            }
            // Make LatLngInput to empty
            if (this.SOLatLngInput) {
                this.updateSOLatLngInput('');
            }
            // Reset Error
            this.resetError();
            // Push Back
            this.$router.push({
                name: 'SearchPortal',
                query: { tab: getActiveTabStatusLabel(this.activeTab) },
            });
        },

        // Sanitize mobile number
        sanitizeMobile(input) {
            console.log('Before sanitize:', input);

            // filter all non-digints characters
            let sanitized = input.replace(/[^\d]/g, '');
            console.log('After filterd', sanitized);
            // if this constains extra 91 (Country code)
            if (sanitized.length > 10 && sanitized.startsWith('91')) {
                sanitized = sanitized.slice(2);
                console.log('After removing 91', sanitized);
            }

            if (sanitized.length !== 10) {
                return null;
            }
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
