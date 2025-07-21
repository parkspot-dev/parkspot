<template>
    <div class="spot-requests-root">
        <!-- Loading modal displayed during data fetch -->
        <LoaderModal v-if="isLoading"></LoaderModal>
        <!-- Buefy Table for spot requests with pagination -->
        <b-table
            :data="dummyUsers"
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
                    <a>
                        <div>{{ props.row.ID }}</div>
                    </a>
                </template>
            </b-table-column>

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
                        <a :href="props.row.IDProofURL" target="_blank" >{{ props.row.IdentityDocument }}</a>
                    </div>
                </template>
            </b-table-column>

            <b-table-column
                field="OwnershipDocument"
                label="Ownership Document"
                cell-class="has-text-left"
            >
                <template v-slot="props">
                    <div>
                        <a :href="props.row.OwnershipProofURL" target="_blank" >{{ props.row.OwnershipDocument }}</a>
                    </div>
                </template>
            </b-table-column>

            <!-- Status Column -->
            <b-table-column
                field="KYC Status"
                filter
                label="KYC Status"
                width="150px"
                sortable
                searchable
            >
                <template #searchable="props">
                    <AtomSelectInput
                        :size="'is-small'"
                        :list="kycStatusList"
                        class="column-width"
                    >
                    </AtomSelectInput>
                </template>
                <template v-slot="props">
                     <SelectInput
                        :key="props.row.ID"
                        :defaultValue="
                            getKYCStatusLabel(props.row.KYCStatus)
                        "
                        :list="
                            kycStatusList.map((kycStatus) => kycStatus.name)
                        "
                        @change="onStatusUpdate(props.row, $event.target.value)"
                        name="updateKYCStatus"
                    />
                </template>
            </b-table-column>
        </b-table>
    </div>
</template>

<script>
import { getKYCStatusLabel } from '../constant/enums';
import { mapState, mapActions } from 'vuex';
import AtomSelectInput from '../components/atoms/AtomSelectInput.vue';
import LoaderModal from '../components/extras/LoaderModal.vue';
import SelectInput from '@/components/global/SelectInput.vue';

export default {
    name: 'KYCStatusPage',
    components: {
        AtomSelectInput,
        LoaderModal,
        SelectInput
    },

    data() {
        return {
            kycStatusList: [
                { id: 0, name: 'Not Set' },
                { id: 1, name: 'Pending' },
                { id: 2, name: 'ID Verified' },
                { id: 3, name: 'Ownership Verified' },
                { id: 4, name: 'Denied' },
                { id: 5, name: 'Not Verified' },
            ],

            dummyUsers: [
                {
                    ID: 1,
                    UserName: 'john_doe_123',
                    FullName: 'John Doe',
                    City: 'Mumbai',
                    EmailID: 'john.doe@example.com',
                    Mobile: '9876543210',
                    KYCStatus: 1,
                    IDProofURL: 'https://parkspot.blob.core.windows.net/kyc-documents/Nishanth-ID0.jpg ',
                    OwnershipProofURL: 'https://parkspot.blob.core.windows.net/kyc-documents/Nishanth-ID0.jpg ',
                    IdentityDocument: 'Aadhar Card',
                    OwnershipDocument: 'Electricity Bill',
                    OriginalOwnerName: 'Jane Doe',
                    OriginalOwnerMobile: '9123456780',
                },
                {
                    ID: 2,
                    UserName: 'anita_verma',
                    FullName: 'Anita Verma',
                    City: 'Delhi',
                    EmailID: 'anita.verma@example.com',
                    Mobile: '9823456701',
                    KYCStatus: 1,
                    IDProofURL: 'https://parkspot.blob.core.windows.net/kyc-documents/Nishanth-ID0.jpg ',
                    OwnershipProofURL:
                        'https://parkspot.blob.core.windows.net/kyc-documents/Nishanth-ID0.jpg ',
                    IdentityDocument: 'Voter ID',
                    OwnershipDocument: 'Water Bill',
                    OriginalOwnerName: 'Raj Verma',
                    OriginalOwnerMobile: '9934567812',
                },
                {
                    ID: 3,
                    UserName: 'rahul_mishra',
                    FullName: 'Rahul Mishra',
                    City: 'Bengaluru',
                    EmailID: 'rahul.mishra@example.com',
                    Mobile: '9871234567',
                    KYCStatus: 1,
                    IDProofURL: 'https://parkspot.blob.core.windows.net/kyc-documents/Nishanth-ID0.jpg ',
                    OwnershipProofURL:
                        'https://parkspot.blob.core.windows.net/kyc-documents/Nishanth-ID0.jpg ',
                    IdentityDocument: 'Passport',
                    OwnershipDocument: 'Property Tax',
                    OriginalOwnerName: 'Neha Mishra',
                    OriginalOwnerMobile: '9012345678',
                },
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

        onStatusUpdate(row, newStatus) {
            // const statusId = this.kycStatusList.find(
            //     (status) => status.name === newStatus
            // ).id;
            // this.$store.dispatch('spotRequests/updateKYCStatus', {
            //     id: row.ID,
            //     kycStatus: statusId,
            // });
            console.log(row, newStatus);;
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

.header {
    align-items: flex-start;
    display: flex;
    justify-content: flex-end;
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
        background-color: #f5f5dc;
        border: 1px solid var(--parkspot-black);
        max-width: 430px;
        padding: 1.25rem;
        position: absolute;
        right: 12px;
        top: 120px;
        z-index: 9999;
        .close-button {
            background: none;
            border: none;
            cursor: pointer;
            position: absolute;
            right: 10px;
            top: 10px;
        }

        .so-total {
            font-size: 16px;
            font-weight: 600 !important;
            font-weight: var(--semi-bold-font);
            text-align: center;
        }

        .so-status {
            display: grid;
            gap: 2.5rem;
            grid-template-columns: repeat(3, 1fr);

            p {
                align-items: center;
                display: flex;
                font-size: $portal-font-size;
                gap: 2px;
                justify-content: space-between;
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
}
.is-success {
    background-color: #b5fca1 !important;
    color: #008000 !important;
    font-weight: bold;
}

.column-width {
    width: 100px;

    @media only screen and (max-width: 1024px) {
        width: 150px;
    }
}
</style>
