<template>
    <div class="spot-requests-root">
        <!-- Search Bar -->
        <div class="search-control">
            <MoleculeSearchBox placeholder="Request ID" @on-search="searchSpotRequest"></MoleculeSearchBox>
            <!-- Loading modal displayed during data fetch -->
            <LoaderModal v-if="isLoading"></LoaderModal>
        </div>

        <!-- Buefy Table for spot requests with pagination -->
        <b-table :data="spotRequests" :paginated="true" :per-page="10" :bordered="true" :hoverable="true"
            :focusable="true" :mobile-cards="true" :narrowed="true" :sticky-header="true" height="500">
            <b-table-column field="ID" label="Request ID" sortable cell-class="has-text-left" width="20">
                <template v-slot="props">
                    <a :href="RequestDetailURL(props.row.ID)">
                        <div>{{ props.row.ID }}</div>
                    </a>
                </template>
            </b-table-column>

            <b-table-column field="Name" label="Name" sortable cell-class="has-text-left">
                <template v-slot="props">
                    <div>
                        {{ props.row.Name }}
                    </div>
                </template>
            </b-table-column>

            <b-table-column field="Address" label="Address" sortable cell-class="has-text-left">
                <template v-slot="props">
                    <div>
                        {{ props.row.Address }}
                    </div>
                </template>
            </b-table-column>

            <!-- Status Column -->
            <b-table-column field="Status" label="Status" width="150px">
                <template v-slot="props">
                    <div class="status-column">
                        <div class="status-part">
                            <span class="tag my-status">
                                {{ getSpotRequestStatusLabel(props.row.Status) }}
                            </span>
                        </div>
                    </div>
                </template>
            </b-table-column>

            <b-table-column field="Remark" label="Remark" sortable cell-class="has-text-left">
                <template v-slot="props">
                    <div>
                        {{ props.row.Remark }}
                    </div>
                </template>
            </b-table-column>

            <b-table-column field="LastCallDate" label="Last Call Date" sortable cell-class="has-text-left">
                <template v-slot="props">
                    <div>
                        {{ props.row.LastCallDate}}
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

export default {
    name: 'SpotRequestsPage',
    components: {
        LoaderModal,
        MoleculeSearchBox,
    },
    computed: {
        // Map Vuex state for loading status and data for spot requests
        ...mapState('spotRequests', [
            'isLoading',
            'hasError',
            'errorMessage',
            'spotRequests',
        ]),
    },
    
    mounted() {
        // Fetch initial spot requests data on component mount
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
            // Update route with search parameter for Request ID
            this.$router.push({
                path: this.$route.path,
                query: { requestId: requestId },
            });
        },

        // Generate detail URL for a specific Request ID 
        // Not working properly
        RequestDetailURL(requestId) {
            return this.$router.resolve({
                name: 'spot-requests',
                query: { requestId },
            }).href;
        },

        // Format date strings to locale-specific format
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString();
        },

        // Get label for status based on the enum value
        getSpotRequestStatusLabel(spotRequestStatus){
            return getSpotRequestStatusLabel(spotRequestStatus)
        },

        // Display error message in a modal dialog
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
        // Watch for errors and display alert if an error occurs
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