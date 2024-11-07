<template>
    <div class="spot-requests-root">
        <!-- Search Bar -->
        <div class="search-control">
            <MoleculeSearchBox placeholder="Request ID" @on-search="searchSpotRequest"></MoleculeSearchBox>
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
                <template v-slot="props">{{ props.row.Name }}</template>
            </b-table-column>

            <b-table-column field="Address" label="Address" sortable cell-class="has-text-left">
                <template v-slot="props">{{ props.row.Address }}</template>
            </b-table-column>

            <!-- Status Column with Select Input -->
            <b-table-column field="Status" label="Status" width="150px">
                <template v-slot="props" >
                    <div class="status-column">
                        <div class="status-part">
                            <span class="tag my-status">
                                {{ getStatusText(props.row.Status) }}
                            </span>
                            <AtomSelectInput :size="'is-small'" :list="statusList" v-model="props.row.Status"
                                @change="onStatusUpdate(props.row)" label="" placeholder="Select Status">
                            </AtomSelectInput>
                        </div>
                    </div>
                </template>
            </b-table-column>

            <b-table-column field="Remark" label="Remark" sortable cell-class="has-text-left">
                <template v-slot="props">{{ props.row.Remark }}</template>
            </b-table-column>

            <b-table-column field="LastCallDate" label="Last Call Date" sortable cell-class="has-text-left">

                <template v-slot="props" >
                    <div class="status-column">
                        <div class="status-part">
                            <span class="tag my-status">
                                {{ props.row.LastCallDate }}
                            </span>
                            <AtomDatePicker :size="'is-small'" class="column-width"
                                @changed="onDateUpdate(props.row, ...arguments)">
                            </AtomDatePicker>
                        </div>
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
import AtomSelectInput from '../components/atoms/AtomSelectInput.vue';
import AtomDatePicker from '../components/atoms/AtomDatePicker.vue';

export default {
    name: 'SpotRequestsPage',
    components: {
        AtomDatePicker,
        AtomSelectInput,
        LoaderModal,
        MoleculeSearchBox,
    },
    computed: {
        ...mapState('spotRequests', [
            'isLoading',
            'hasError',
            'errorMessage',
            'spotRequests',
        ]),
    },
    data() {
        return {
            statusList: [
                { id: 0, name: 'Not Set' },
                { id: 1, name: 'Registered' },
                { id: 2, name: 'Processing' },
                { id: 3, name: 'Requested Modification' },
                { id: 4, name: 'Verified' },
                { id: 5, name: 'Promoted' },
                { id: 6, name: 'Denied' },
                { id: 7, name: 'Cancelled' },
                { id: 8, name: 'Duplicate' }
            ],
        };
    },
    mounted() {
        this.fetchSpotRequests();
    },
    methods: {
        ...mapActions('spotRequests', ['fetchSpotRequests']),

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

        RequestDetailURL(requestId) {
            return this.$router.resolve({
                name: 'spot-requests',
                query: { requestId },
            }).href;
        },

        getStatusText(statusCode) {
            const statusMap = {
                0: 'Not Set',
                1: 'Registered',
                2: 'Processing',
                3: 'Requested Modification',
                4: 'Verified',
                5: 'Promoted',
                6: 'Denied',
                7: 'Cancelled',
                8: 'Duplicate'
            };

            return statusMap[statusCode] || 'Unknown Status';
        },

        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString();
        },

        onStatusUpdate(row) {
            console.log('Status updated for row:', row);
            // Additional logic to handle status update, like saving to the backend
        },

        onDateUpdate(row, selectedDate) {
            console.log("Date updated for row", row, "Selected Date", selectedDate);

            // Update the date in backend
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