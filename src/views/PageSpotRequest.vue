<template>
    <div class="spot-requests-root">
        <!--- Search Bar-->
        <div class="search-control">
            <MoleculeSearchBox
                placeholder="Request ID"
                @on-search="searchSpotRequest"
            ></MoleculeSearchBox>
            <LoaderModal v-if="isLoading"></LoaderModal>
        </div>

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
                field="requestId"
                label="Request ID"
                sortable
                cell-class="has-text-left"
                width="20"
            >
                <template v-slot="props">
                    <a :href="RequestDetailURL(props.row.id)">
                        <div>{{ props.row.id }}</div>
                    </a>
                </template>
            </b-table-column>

            <b-table-column
                field="name"
                label="Name"
                sortable
                cell-class="has-text-left"
            >
                <template v-slot="props">{{ props.row.name }}</template>
            </b-table-column>

            <b-table-column
                field="email"
                label="Email"
                sortable
                cell-class="has-text-left"
            >
                <template v-slot="props">{{ props.row.email }}</template>
            </b-table-column>

            <b-table-column
                field="contactNumber"
                label="Contact Number"
                sortable
                cell-class="has-text-left"
            >
                <template v-slot="props">{{
                    props.row.contactNumber
                }}</template>
            </b-table-column>

            <b-table-column
                field="parkingType"
                label="Type of Parking"
                sortable
                cell-class="has-text-left"
            >
                <template v-slot="props">{{ props.row.parkingType }}</template>
            </b-table-column>

            <b-table-column
                field="duration"
                label="Duration"
                sortable
                cell-class="has-text-left"
            >
                <template v-slot="props">{{ props.row.duration }}</template>
            </b-table-column>

            <b-table-column
                field="carModel"
                label="Car Model"
                sortable
                cell-class="has-text-left"
            >
                <template v-slot="props">{{ props.row.carModel }}</template>
            </b-table-column>
        </b-table>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import LoaderModal from '../components/extras/LoaderModal.vue';
import MoleculeSearchBox from '../components/molecules/MoleculeSearchBox.vue';

export default {
    name: 'SpotRequestsPage',
    components: {
        MoleculeSearchBox,
        LoaderModal,
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

        searchSpotRequest(requestId) {
            // Request ID Validation
            const isValidRequestId = /^[0-9]+$/.test(requestId);

            if (!isValidRequestId) {
                // Show error if validation fails
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

<style scoped>
.spot-requests-root {
    padding: 16px;
    text-align: center;
    background: #f5f5fb;
}

.spot-requests-root h1 {
    font-size: 24px;
    margin-bottom: 10px;
}

.column-padding {
    padding: 10px 20px;
}

.table {
    margin-top: 20px;
}
</style>
