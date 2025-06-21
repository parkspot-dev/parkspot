<template>
    <div class="spot-requests-root">
        <!-- Search Bar -->
        <div class="search-control">
            <MoleculeSearchBox
                placeholder="Request ID"
                @on-search="searchSpotRequest"
            ></MoleculeSearchBox>
        </div>
        <div class="header">
            <div class="summary" v-if="isSummary">
                <div class="so-btn">
                    <AtomButton
                        @click.native="showSummary"
                        v-show="!summary.show"
                    >
                        {{ summary.btn }} Summary
                    </AtomButton>
                </div>
                <br />
                <div class="so-summary" v-show="summary.show">
                    <span class="close-button">
                        <AtomIcon
                            @click.native="showSummary"
                            :icon="'close'"
                            size=""
                        >
                        </AtomIcon>
                    </span>
                    <p class="so-total">Summary</p>
                    <hr />
                    <div class="so-status">
                        <p>
                            <span>Registered :</span>
                            <span>{{ summary.status[1] || 0 }}</span>
                        </p>
                        <p>
                            <span>Processing :</span>
                            <span>{{ summary.status[2] || 0 }}</span>
                        </p>
                        <p>
                            <span>Verified :</span>
                            <span>{{ summary.status[4] || 0 }}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading modal displayed during data fetch -->
        <LoaderModal v-if="isLoading"></LoaderModal>
        <!-- Buefy Table for spot requests with pagination -->
        <b-table
            :data="spotRequests"
            :paginated="true"
            :per-page="16"
            :bordered="true"
            :hoverable="true"
            :focusable="true"
            :mobile-cards="true"
            :narrowed="true"
            :sticky-header="true"
            height="700"
        >
            <b-table-column
                field="ID"
                label="ID"
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
                searchable
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
                searchable
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
                        {{
                            props.row.LastCallDate
                                ? formatDate(props.row.LastCallDate)
                                : 'N/A'
                        }}
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
import AtomButton from '@/components/atoms/AtomButton.vue';
import AtomIcon from '@/components/atoms/AtomIcon.vue';

export default {
    name: 'SpotRequestsPage',
    components: {
        AtomSelectInput,
        LoaderModal,
        MoleculeSearchBox,
        AtomButton,
        AtomIcon,
    },

    props: {
        isSummary: {
            type: Boolean,
            default: true,
        },
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
            summary: {
                btn: 'Show',
                show: false,
                status: [0, 0, 0, 0, 0, 0], // Array to hold counts for each status
            },
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
            return `${this.$route.path}/?requestId=${requestId}`;
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

        showSummary() {
            this.summary.show = !this.summary.show;
            if (this.summary.show) {
                this.summary.btn = 'Hide';
            } else {
                this.summary.btn = 'Show';
            }
        },

        updateSummary(requests) {
            this.summary.status = [0, 0, 0, 0, 0, 0];
            requests.forEach((request) => {
                if (request.Status >= 0 && request.Status <= 5) {
                    this.summary.status[request.Status]++;
                }
            });
        },
    },
    watch: {
        spotRequests(newRequests) {
            if (newRequests && newRequests.length > 0) {
                this.updateSummary(newRequests);
            }
        },
        hasError(error) {
            if (error) {
                this.alertError(this.errorMessage);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
$portal-font-size: 13px;

.header {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    margin-bottom: 20px;
}

.title h1 {
    font-size: 24px;
    margin: 0;
}

.summary {
    .so-btn {
        text-align: right;
    }

    .so-summary {
        position: absolute;
        top: 120px;
        right: 12px;
        z-index: 9999;
        padding: 1.25rem;
        max-width: 430px;
        border: 1px solid var(--parkspot-black);
        background-color: #f5f5dc;
        .close-button {
            background: none;
            border: none;
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
        }

        .so-total {
            font-size: 16px;
            font-weight: 600;
            font-weight: var(--semi-bold-font);
            text-align: center;
        }

        .so-status {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2.5rem;

            p {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: $portal-font-size;
                gap: 5px;
            }
        }
    }
}

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

.search-control {
    margin-bottom: 20px;
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
    color: black;
}

.column-width {
    width: 100px;

    @media only screen and (max-width: 1024px) {
        width: 150px;
    }
}
</style>
