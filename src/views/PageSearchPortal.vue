<template>
    <b-tabs v-model="activeTabView">
        <b-tab-item label="Parking Request (VO/SO)">
            <div class="request-search-control">
                <MoleculeSearchBox
                    placeholder="Mobile"
                    @on-search="searchRequestWithMobile"
                ></MoleculeSearchBox>
            </div>
            <TemplateSearchPortal
                :parkingRequests="parkingRequests"
                :isLoading="isLoading || this.loading "
                :isSummary="true"
                @updateRequest="updateRequest"
                @toSrp="toSrp"
            ></TemplateSearchPortal>
        </b-tab-item>

        <b-tab-item label="Interested Request(VO)">
            <p></p>
            <MoleculeSearchBox
                placeholder="Lat,Long"
                @on-search="getInterestedVO"
            ></MoleculeSearchBox>
            <TemplateSearchPortal
                :isLoading="isLoading || loading"
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
            isLoading: false,
            intrestedVOList: [],
            VOMobile: '',
        };
    },
    computed: {
        ...mapState('searchPortal', [
            'activeTab',
            'SOLatLngInput',
            'parkingRequests',
            'loading',
            'errorMessage',
            'hasError',
            'intrestedVOList'
        ]),
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
            'getParkingRequests',
            'resetError',
            'getInterestedVO'
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
                    this.resetError();
                    this.$router.push({ name: 'SearchPortal' });
                },
            });
        },
        async searchRequestWithMobile(voMobile) {
            if (voMobile != '') {
                this.$router.push({
                    path: this.$route.fullPath,
                    query: { mobile: voMobile },
                });
                this.getParkingRequests(voMobile);
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
