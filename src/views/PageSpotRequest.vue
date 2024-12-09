<template>
    <div class="spot-requests-root">
        <!-- Search Bar -->
        <div class="search-control">
            <MoleculeSearchBox
                placeholder="Request ID"
                @on-search="searchSpotRequest"
            ></MoleculeSearchBox>
        </div>
        <!-- Loading modal displayed during data fetch -->
        <LoaderModal v-if="isLoading"></LoaderModal>
        <!-- Buefy Table for spot requests with pagination -->
        <b-table
            :data="spotRequests"
            :paginated="true"
            :per-page="10"
            :bordered="true"
            :hoverable="true"
            :focusable="true"
            :mobile-cards="true"
            :narrowed="true"
            :sticky-header="true"
            height="500"
        >
            <b-table-column
                field="ID"
                label="Request ID"
                sortable
                cell-class="has-text-left"
                width="20"
            >
                <template v-slot="props">
                    <a :href="RequestDetailURL(props.row.ID)">
                        <div>{{ props.row.ID }}</div>
                    </a>
                </template>
            </b-table-column>


            <b-table-column
                field="Name"
                label="Name"
                sortable
                cell-class="has-text-left"
            >
                <template v-slot="props">
                    <div>
                        {{ props.row.Name }}
                    </div>
                </template>
            </b-table-column>


            <b-table-column
                field="Address"
                label="Address"
                sortable
                cell-class="has-text-left"
            >
                <template v-slot="props">
                    <div>
                        {{ props.row.Address }}
                    </div>
                </template>
            </b-table-column>


            <!-- Status Column -->
            <b-table-column
                field="Status"
                filter
                label="Status"
                width="150px"
                sortable
                searchable
            >
                <template #searchable="props">
                    <AtomSelectInput
                        :size="'is-small'"
                        :list="spotRequestStatusList"
                        class="column-width"
                        v-model="props.filters['Status']"
                    >
                    </AtomSelectInput>
                </template>
                <template v-slot="props">
                    <div class="status-column">
                        <div class="status-part">
                            <span
                                class="tag"
                                :class="{
                                    'is-info': props.row.Status === 0,
                                    'is-success': props.row.Status === 4,
                                    'my-status':
                                        props.row.Status === 1 || 2 || 3,
                                    'is-danger': props.row.Status === 5,
                                }"
                            >
                                {{
                                    getSpotRequestStatusLabel(props.row.Status)
                                }}
                            </span>
                        </div>
                    </div>
                </template>
            </b-table-column>


            <b-table-column
                field="Remark"
                label="Remark"
                sortable
                cell-class="has-text-left"
            >
                <template v-slot="props">
                    <div>
                        {{ props.row.Remark }}
                    </div>
                </template>
            </b-table-column>


            <b-table-column
                field="LastCallDate"
                label="Last Call Date"
                sortable
                cell-class="has-text-left"
            >
                <template v-slot="props">
                    <div>
                        {{ props.row.LastCallDate ? formatDate(props.row.LastCallDate) : 'N/A' }}
                    </div>
                </template>
            </b-table-column>
        </b-table>
    </div>
</template>


<script>
import { mapState, mapActions } from 'vuex';
import LoaderModal from '../components/extras/LoaderModal.vue';
import MoleculeSearchBox from '../components/molecules/MoleculeSearchBox.vue';
import { getSpotRequestStatusLabel } from '../constant/enums';
import AtomSelectInput from '../components/atoms/AtomSelectInput.vue';


export default {
    name: 'SpotRequestsPage',
    components: {
        AtomSelectInput,
        LoaderModal,
        MoleculeSearchBox,
    },


    data() {
        return {
            spotRequestStatusList: [
                { id: 0, name: 'Not Set' },
                { id: 1, name: 'Registered' },
                { id: 2, name: 'Processing' },
                { id: 3, name: 'Requested Modification' },
                { id: 4, name: 'Verified' },
                { id: 5, name: 'Denied' },
            ],
        };
    },
    computed: {
        ...mapState('spotRequests', [
            'isLoading',
            'hasError',
            'errorMessage',
            'spotRequests',
        ]),
    },


    mounted() {
        this.fetchSpotRequests();
    },
    methods: {
        ...mapActions('spotRequests', ['fetchSpotRequests']),


        // Search by Request ID with validation for numeric input
        searchSpotRequest(requestId) {
            const isValidRequestId = /^[0-9]+$/.test(requestId);
            if (!isValidRequestId) {
                this.alertError('Please enter a valid numeric Request ID.');
                return;
            }
            this.$router.push({
                path: this.$route.path,
                query: { requestId: requestId },
            });
        },


        // Generate detail URL for a specific Request ID
        RequestDetailURL(requestId) {
            const detailURL = `${this.$route.path}/?requestId=${requestId}`;
            return detailURL;
        },


        // Format date strings to locale-specific format
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString();
        },


        // Get label for status based on the enum value
        getSpotRequestStatusLabel(spotRequestStatus) {
            return getSpotRequestStatusLabel(spotRequestStatus);
        },


        alertError(msg) {
            this.$buefy.dialog.alert({
                title: 'Error',
                message: msg,
                type: 'is-danger',
                hasIcon: true,
                icon: 'alert-circle',
                ariaRole: 'alertdialog',
                ariaModal: true,
            });
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


<style lang="scss">
$portal-font-size: 13px;


.column-padding {
    padding: 10px 20px;
}


.spot-requests-root {
    background: #f5f5fb;
    padding: 16px;
    text-align: center;


    h1 {
        font-size: 24px;
        margin-bottom: 10px;
    }
}


.status-column {
    font-size: $portal-font-size;


    .status-part {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
    }


    .next-call-part {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
}


.table {
    margin-top: 20px;
}


.tag:not(body) {
    background-color: var(--primary-color);
}
</style>
