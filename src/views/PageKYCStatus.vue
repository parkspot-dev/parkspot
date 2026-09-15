<template>
    <div class="kyc-status-portal-root">
        <!-- Search Bar -->
        <div class="search-control">
            <MoleculeSearchBox
                :initial-value="searchMobile"
                placeholder="Mobile"
                @clear-input="onClearMobileInput"
                @on-search="searchUsersWithMobile"
            ></MoleculeSearchBox>
        </div>

        <!-- Loader -->
        <LoaderModal v-if="isLoading"></LoaderModal>

        <!-- KYC Status Table -->
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
            class="table"
            height="700"
        >
            <b-table-column
                field="FullName"
                label="Full Name"
                cell-class="has-text-left"
            >
                <template #default="props">
                    <div>{{ props.row?.User?.FullName }}</div>
                </template>
            </b-table-column>

            <b-table-column
                field="Mobile"
                label="Mobile"
                searchable
                cell-class="has-text-left"
            >
                <template #default="props">
                    <div>{{ props.row?.User?.Mobile }}</div>
                </template>
            </b-table-column>

            <b-table-column
                field="VehicleNumber"
                label="Vehicle Number"
                cell-class="has-text-left"
            >
                <template #default="props">
                    <div>{{ props.row?.User?.VehicleNumber }}</div>
                </template>
            </b-table-column>

            <b-table-column
                field="IDProofDocument"
                label="ID Proof Document View"
                cell-class="has-text-left"
            >
                <template #default="props">
                    <div class="documents-preview">
                        <div
                            v-if="
                                (props.row?.IdentityDocument &&
                                    props.row.IdentityDocument.length > 0) ||
                                props.row?.IDVerifiedDetails
                            "
                            class="tag"
                            @click="openDetailsModal(props.row, 'id')"
                        >
                            Document
                        </div>
                        <div
                            v-else
                            class="no-doc-text"
                            @click="openDetailsModal(props.row, 'id')"
                        >
                            No Document Present
                        </div>
                    </div>
                </template>
            </b-table-column>

            <b-table-column
                field="OwnershipProofDocument"
                label="Ownership Proof Document View"
                cell-class="has-text-left"
            >
                <template #default="props">
                    <div class="documents-preview">
                        <div
                            v-if="
                                (props.row?.OwnershipDocument &&
                                    props.row.OwnershipDocument.length > 0) ||
                                props.row?.OwnershipVerifiedDetails
                            "
                            class="tag"
                            @click="openDetailsModal(props.row, 'ownership')"
                        >
                            Document
                        </div>
                        <div
                            v-else
                            class="no-doc-text"
                            @click="openDetailsModal(props.row, 'ownership')"
                        >
                            No Document Present
                        </div>
                    </div>
                </template>
            </b-table-column>

            <!-- Status Column -->
            <b-table-column
                field="KYC Status"
                filter
                label="KYC Status"
                width="150px"
            >
                <template #default="props">
                    <SelectInput
                        :key="
                            props.row?.User?.UserName || props.row?.User?.Mobile
                        "
                        :model-value="
                            getKYCStatusLabel(props.row?.User?.KYCStatus)
                        "
                        :list="KYCStatusLabel"
                        class="select"
                        name="updateKYCStatus"
                        @change="onStatusUpdate(props.row, $event.target.value)"
                    />
                </template>
            </b-table-column>
        </b-table>

        <!-- Details Modal -->
        <b-modal
            v-model="showDetailsModal"
            has-modal-card
            width="720"
            scroll="keep"
        >
            <div class="modal-card kyc-details-modal">
                <header class="modal-card-head">
                    <p class="modal-card-title">
                        {{
                            activeModalType === 'id'
                                ? 'ID Verification Details (Aadhaar)'
                                : 'Ownership Verification Details (RC)'
                        }}
                    </p>
                    <button
                        type="button"
                        class="delete"
                        @click="showDetailsModal = false"
                    />
                </header>
                <section class="modal-card-body" v-if="selectedUserKYC">
                    <!-- User Basic Information Card -->
                    <div class="kyc-card">
                        <div class="card-header-bar">
                            <h3 class="card-title">User Basic Information</h3>
                        </div>
                        <div class="card-grid">
                            <div class="info-item">
                                <span class="info-label">Full Name</span>
                                <span class="info-value">{{
                                    selectedUserKYC.User?.FullName
                                }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Mobile Number</span>
                                <span class="info-value">{{
                                    selectedUserKYC.User?.Mobile
                                }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">ID Type</span>
                                <span class="info-value id-type-badge">
                                    {{
                                        getIDTypeLabel(
                                            activeModalType === 'id'
                                                ? (selectedUserKYC
                                                      .IDVerifiedDetails
                                                      ?.IDType ?? 1)
                                                : (selectedUserKYC
                                                      .OwnershipVerifiedDetails
                                                      ?.IDType ?? 2),
                                        )
                                    }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Cashfree ID Verification Details Card (Aadhaar) -->
                    <div v-if="activeModalType === 'id'" class="kyc-card">
                        <div class="card-header-bar">
                            <h3 class="card-title">
                                Cashfree ID Verification Details (Aadhaar)
                            </h3>
                        </div>
                        <div
                            v-if="selectedUserKYC.IDVerifiedDetails"
                            class="card-grid"
                        >
                            <div class="info-item">
                                <span class="info-label">Name (on ID)</span>
                                <span class="info-value">{{
                                    selectedUserKYC.IDVerifiedDetails?.Name
                                }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Gender</span>
                                <span class="info-value highlight-gender">{{
                                    selectedUserKYC.IDVerifiedDetails?.Gender
                                }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label"
                                    >Date of Birth (DOB)</span
                                >
                                <span class="info-value">{{
                                    selectedUserKYC.IDVerifiedDetails?.DOB
                                }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Masked Aadhaar</span>
                                <span class="info-value">{{
                                    selectedUserKYC.IDVerifiedDetails
                                        ?.MaskedAadhar
                                }}</span>
                            </div>
                            <div class="info-item full-width">
                                <span class="info-label">Address</span>
                                <span class="info-value">{{
                                    selectedUserKYC.IDVerifiedDetails?.Address
                                }}</span>
                            </div>
                        </div>
                        <div v-else class="empty-doc-box">
                            No Cashfree ID Verification Details Available
                        </div>
                    </div>

                    <!-- Manual ID Document Display -->
                    <div v-if="activeModalType === 'id'" class="kyc-card">
                        <div class="card-header-bar">
                            <h3 class="card-title">
                                Uploaded Identity Document Proof
                            </h3>
                        </div>
                        <div
                            v-if="
                                selectedUserKYC.IdentityDocument &&
                                selectedUserKYC.IdentityDocument.length > 0
                            "
                            class="doc-thumbs"
                        >
                            <div
                                v-for="(
                                    imgUrl, idx
                                ) in selectedUserKYC.IdentityDocument"
                                :key="'id-doc-' + idx"
                                class="doc-thumb"
                                @click="openImage(imgUrl)"
                            >
                                <img :src="imgUrl" alt="Identity Document" />
                                <span class="preview-overlay"
                                    >Click to View</span
                                >
                            </div>
                        </div>
                        <div v-else class="empty-doc-box">
                            No ID Photo Uploaded
                        </div>
                    </div>

                    <!-- Cashfree Ownership Verification Details Card (RC) -->
                    <div
                        v-if="activeModalType === 'ownership'"
                        class="kyc-card"
                    >
                        <div class="card-header-bar">
                            <h3 class="card-title">
                                Cashfree Ownership Verification Details (RC)
                            </h3>
                        </div>
                        <div
                            v-if="selectedUserKYC.OwnershipVerifiedDetails"
                            class="card-grid"
                        >
                            <div class="info-item">
                                <span class="info-label">Name (on RC)</span>
                                <span class="info-value">{{
                                    selectedUserKYC.OwnershipVerifiedDetails
                                        ?.Name
                                }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Vehicle Number</span>
                                <span class="info-value">{{
                                    selectedUserKYC.OwnershipVerifiedDetails
                                        ?.VehicleNumber
                                }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Expiry Date</span>
                                <span class="info-value">{{
                                    selectedUserKYC.OwnershipVerifiedDetails
                                        ?.Expiry
                                }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Vehicle Make</span>
                                <span class="info-value">{{
                                    selectedUserKYC.OwnershipVerifiedDetails
                                        ?.Make
                                }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Vehicle Model</span>
                                <span class="info-value">{{
                                    selectedUserKYC.OwnershipVerifiedDetails
                                        ?.Model
                                }}</span>
                            </div>
                            <div class="info-item full-width">
                                <span class="info-label">Address</span>
                                <span class="info-value">{{
                                    selectedUserKYC.OwnershipVerifiedDetails
                                        ?.Address
                                }}</span>
                            </div>
                        </div>
                        <div v-else class="empty-doc-box">
                            No Cashfree Ownership Verification Details Available
                        </div>
                    </div>

                    <!-- Manual Ownership Document Display -->
                    <div
                        v-if="activeModalType === 'ownership'"
                        class="kyc-card"
                    >
                        <div class="card-header-bar">
                            <h3 class="card-title">
                                Uploaded Ownership Document Proof
                            </h3>
                        </div>
                        <div
                            v-if="
                                selectedUserKYC.OwnershipDocument &&
                                selectedUserKYC.OwnershipDocument.length > 0
                            "
                            class="doc-thumbs"
                        >
                            <div
                                v-for="(
                                    imgUrl, idx
                                ) in selectedUserKYC.OwnershipDocument"
                                :key="'own-doc-' + idx"
                                class="doc-thumb"
                                @click="openImage(imgUrl)"
                            >
                                <img :src="imgUrl" alt="Ownership Document" />
                                <span class="preview-overlay"
                                    >Click to View</span
                                >
                            </div>
                        </div>
                        <div v-else class="empty-doc-box">
                            No RC Photo Uploaded
                        </div>
                    </div>
                </section>
            </div>
        </b-modal>

        <!-- Fullscreen Image Preview Modal -->
        <b-modal
            v-model="showImageModal"
            has-modal-card
            full-screen
            scroll="keep"
        >
            <div class="image-preview-modal">
                <img :src="selectedImage" alt="Document Preview" />
            </div>
        </b-modal>
    </div>
</template>

<script>
import {
    getKYCStatusLabel,
    KYCStatusLabel,
    KYCStatus,
    getIDTypeLabel,
} from '@/constant/enums';
import { mapState, mapActions } from 'vuex';
import LoaderModal from '../components/extras/LoaderModal.vue';
import SelectInput from '@/components/global/SelectInput.vue';
import MoleculeSearchBox from '@/components/molecules/MoleculeSearchBox.vue';
import { sanitizeMobile } from '@/utils/sanitizeMobile';

export default {
    name: 'KYCStatusPage',
    components: {
        LoaderModal,
        MoleculeSearchBox,
        SelectInput,
    },
    data() {
        return {
            KYCStatusLabel,
            showImageModal: false,
            selectedImage: null,
            showDetailsModal: false,
            selectedUserKYC: null,
            activeModalType: 'id',
        };
    },
    computed: {
        ...mapState('kycStatusPortal', [
            'isLoading',
            'searchMobile',
            'users',
            'hasError',
            'errorMessage',
        ]),
    },
    watch: {
        hasError(val) {
            if (val) {
                this.alertError(this.errorMessage);
            }
        },
    },
    mounted() {
        this.fetchKycPendingUsers();
    },
    created() {
        const mobile = this.$route.query.mobile;
        this.updateMobileInput(mobile || '');
    },
    methods: {
        ...mapActions('kycStatusPortal', [
            'fetchKycPendingUsers',
            'updateStatus',
            'updateMobileInput',
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
            });
        },

        getKYCStatusLabel(status) {
            return getKYCStatusLabel(status);
        },

        getIDTypeLabel(idType) {
            return getIDTypeLabel(idType);
        },

        openDetailsModal(row, type = 'id') {
            this.selectedUserKYC = row;
            this.activeModalType = type;
            this.showDetailsModal = true;
        },

        openImage(url) {
            this.selectedImage = url;
            this.showImageModal = true;
        },

        async onStatusUpdate(row, newStatus) {
            const labelId = KYCStatus[newStatus];
            if (labelId == null) return;
            if (row && row.User) {
                row.User.KYCStatus = labelId;
            }
            await this.updateStatus({ userData: row });
            await this.fetchKycPendingUsers();
            this.$buefy.toast.open({
                message: `KYC Status updated to ${getKYCStatusLabel(labelId)}`,
                type: 'is-success',
            });
        },

        async searchUsersWithMobile(userMobile) {
            if (userMobile) {
                const sanitized = sanitizeMobile(userMobile);
                if (sanitized) {
                    this.updateMobileInput(sanitized);
                    await this.fetchKycPendingUsers();
                    this.$router.push({
                        path: this.$route.path,
                        query: { mobile: sanitized },
                    });
                }
            }
        },

        async onClearMobileInput() {
            if (this.$route.query.mobile) {
                this.updateMobileInput('');
                await this.fetchKycPendingUsers();
                this.$router.push({ name: 'kyc-status' });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
$portal-font-size: 12px;

.kyc-status-portal-root {
    background: var(--parkspot-white);
    padding: 16px;
    text-align: center;

    h1 {
        font-size: 24px;
        margin-bottom: 12px;
    }
}

.table {
    margin-top: 32px;
}

.column-width {
    width: 100px;

    @media only screen and (max-width: 1024px) {
        width: 152px;
    }
}

.documents-preview {
    display: flex;
    gap: 12px;

    .tag {
        background-color: var(--primary-color);
        border-radius: 8px;
        border: 1px dashed var(--parkspot-black);
        color: var(--parkspot-black);
        cursor: pointer;
        padding: 12px 12px;
        text-align: center;
    }
}

.no-doc-text {
    font-size: 12px;
    color: var(--parkspot-muted-black);
    font-style: italic;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
        color: var(--parkspot-red);
    }
}

.select {
    margin-top: 4px;
    padding-bottom: 0px !important;
}

.image-preview-modal {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    width: 100%;
}

.image-preview-modal img {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    max-height: 92vh;
    max-width: 100%;
    object-fit: contain;
    z-index: 999;
}

.kyc-details-modal {
    text-align: left;

    .modal-card-body {
        background-color: var(--parkspot-white);
        padding: 20px;
    }

    .kyc-card {
        background: var(--parkspot-white);
        border: 1px solid var(--grey-shade);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;

        .card-header-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--grey-shade);
            padding-bottom: 12px;
            margin-bottom: 16px;

            .card-title {
                font-size: 16px;
                font-weight: 700;
                color: var(--parkspot-black);
                margin: 0;
            }
        }

        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
        }

        .info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;

            &.full-width {
                grid-column: 1 / -1;
            }

            .info-label {
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--parkspot-muted-black);
            }

            .info-value {
                font-size: 16px;
                font-weight: 500;
                color: var(--parkspot-black);

                &.highlight-gender {
                    font-weight: 600;
                    color: var(--secondary-color);
                }
            }
        }

        .id-type-badge {
            color: var(--secondary-color) !important;
            font-weight: 700 !important;
        }

        .empty-doc-box {
            background-color: var(--parkspot-white);
            border: 1px dashed var(--parkspot-red);
            color: var(--parkspot-red);
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 12px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .doc-thumbs {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            margin-top: 4px;
        }

        .doc-thumb {
            position: relative;
            width: 140px;
            height: 100px;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid var(--grey-shade);
            cursor: pointer;
            transition: all 0.2s ease-in-out;

            &:hover {
                transform: translateY(-4px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .preview-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.7);
                color: var(--parkspot-white);
                font-size: 12px;
                text-align: center;
                padding: 4px 0;
                font-weight: 500;
            }
        }
    }
}
</style>
