<template>
    <div class="kyc-status-portal-root">
        <!-- Loading modal displayed during data fetch -->
        <LoaderModal v-if="isLoading"></LoaderModal>
        <!-- Buefy Table for spot requests with pagination -->
        <b-table
            :data="users"
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
                field="FullName"
                label="Full Name"
                cell-class="has-text-left"
            >
                <template v-slot="props">
                    <div>
                        {{ props.row.FullName }}
                    </div>
                </template>
            </b-table-column>

            <b-table-column
                field="Mobile"
                label="Mobile"
                searchable
                cell-class="has-text-left"
            >
                <template v-slot="props">
                    <div>
                        {{ props.row.Mobile }}
                    </div>
                </template>
            </b-table-column>

            <b-table-column
                field="IdentityDocument"
                label="Identity Document"
                cell-class="has-text-left"
            >
                <template v-slot="props">
                    <div>
                        {{ props.row.IdentityDocument }}
                    </div>
                </template>
            </b-table-column>

            <b-table-column
                field="ID Proof Document"
                label="ID Proof Document View"
                cell-class="has-text-left"
            >
                <template v-slot="props">
                    <div
                        v-if="props.row.IDProofURLs.length > 0"
                        class="documents-preview"
                    >
                        <a :href="props.row.IDProofURLs[0]">
                            <div class="tag">Front</div>
                        </a>
                        <a
                            v-if="props.row.IDProofURLs[1]"
                            :href="props.row.IDProofURLs[1]"
                        >
                            <div class="tag">Back</div>
                        </a>
                    </div>
                    <div v-else>No Document Present</div>
                </template>
            </b-table-column>

            <b-table-column
                field="OwnershipDocument"
                label="Ownership Document"
                cell-class="has-text-left"
            >
                <template v-slot="props">
                    <div>
                        {{ props.row.OwnershipDocument }}
                    </div>
                </template>
            </b-table-column>

            <b-table-column
                field="ID Proof Document"
                label="ID Proof Document View"
                cell-class="has-text-left"
            >
                <template v-slot="props">
                    <div
                        v-if="props.row.OwnershipProofURLs.length > 0"
                        class="documents-preview"
                    >
                        <a :href="props.row.OwnershipProofURLs[0]">
                            <div class="tag">Front</div>
                        </a>
                        <a
                            v-if="props.row.OwnershipProofURLs[1]"
                            :href="props.row.OwnershipProofURLs[1]"
                        >
                            <div class="tag">Back</div>
                        </a>
                    </div>
                    <div v-else>No Document Present</div>
                </template>
            </b-table-column>

            <!-- Status Column -->
            <b-table-column
                field="KYC Status"
                filter
                label="KYC Status"
                width="150px"
            >
                <template v-slot="props">
                    <SelectInput
                        :key="props.row.ID"
                        :defaultValue="getKYCStatusLabel(props.row.KYCStatus)"
                        :list="KYCStatusLabel"
                        @change="onStatusUpdate(props.row, $event.target.value)"
                        name="updateKYCStatus"
                    />
                </template>
            </b-table-column>
        </b-table>
    </div>
</template>

<script>
import { getKYCStatusLabel, KYCStatusLabel, KYCStatus } from '@/constant/enums';
import { mapState, mapActions } from 'vuex';
import AtomSelectInput from '../components/atoms/AtomSelectInput.vue';
import LoaderModal from '../components/extras/LoaderModal.vue';
import SelectInput from '@/components/global/SelectInput.vue';

export default {
    name: 'KYCStatusPage',
    components: {
        AtomSelectInput,
        LoaderModal,
        SelectInput,
    },

    data() {
        return {
            KYCStatusLabel,
            KYCStatus
        };
    },
    computed: {
        ...mapState('kycStatusPortal', [
            'isLoading',
            'hasError',
            'errorMessage',
            'users',
        ]),
    },
    mounted() {
        this.fetchKycPendingUsers();
    },
    methods: {
        ...mapActions('kycStatusPortal', ['fetchKycPendingUsers', 'updateStatus']),

        // Get label for status based on the enum value
        getKYCStatusLabel(spotRequestStatus) {
            return getKYCStatusLabel(spotRequestStatus);
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

        async onStatusUpdate(row, newStatus) {
            console.log(row, newStatus);
            const labelId = KYCStatus[newStatus];
            if (labelId != null) {
                row['KYCStatus'] = labelId;
                await this.updateStatus({userData: row});
                this.$buefy.toast.open({
                    message: `KYC Status updated to ${getKYCStatusLabel(labelId)}`,
                    type: 'is-success',
                    duration: 3000,
                });
            } else {
                this.alertError('Invalid status selected.');
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
$portal-font-size: 13px;

.kyc-status-portal-root {
    background: #f5f5fb;
    padding: 16px;
    text-align: center;

    h1 {
        font-size: 24px;
        margin-bottom: 10px;
    }
}

.table {
    margin-top: 60px;
}

.column-width {
    width: 100px;

    @media only screen and (max-width: 1024px) {
        width: 150px;
    }
}

.documents-preview {
    display: flex;
    gap: 12px;

    .tag {
        background-color: var(--primary-color);
        border-radius: 10px;
        border: 1px dashed var(--parkspot-black);
        color: var(--parkspot-black);
        cursor: pointer;
        padding: 12px 12px;
        text-align: center;
    }
}
</style>
