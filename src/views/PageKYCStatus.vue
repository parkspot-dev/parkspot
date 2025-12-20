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
            class="table"
            height="700"
        >
            <b-table-column
                field="FullName"
                label="Full Name"
                cell-class="has-text-left"
            >
                <template #default="props">
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
                <template #default="props">
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
                <template #default="props">
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
                <template #default="props">
                    <div
                        v-if="props.row.IDProofURLs.length > 0"
                        class="documents-preview"
                    >
                        <div
                            class="tag"
                            @click="openImage(props.row.IDProofURLs[0])"
                        >
                            Front
                        </div>

                        <div
                            v-if="props.row.IDProofURLs[1]"
                            class="tag"
                            @click="openImage(props.row.IDProofURLs[1])"
                        >
                            Back
                        </div>
                    </div>
                    <div v-else>No Document Present</div>
                </template>
            </b-table-column>

            <b-table-column
                field="OwnershipDocument"
                label="Ownership Document"
                cell-class="has-text-left"
            >
                <template #default="props">
                    <div>
                        {{ props.row.OwnershipDocument }}
                    </div>
                </template>
            </b-table-column>

            <b-table-column
                field="Ownership Proof Document"
                label="Ownership Proof Document View"
                cell-class="has-text-left"
            >
                <template #default="props">
                    <div
                        v-if="props.row.OwnershipProofURLs.length > 0"
                        class="documents-preview"
                    >
                        <div
                            class="tag"
                            @click="openImage(props.row.OwnershipProofURLs[0])"
                        >
                            Front
                        </div>
                        <div
                            v-if="props.row.OwnershipProofURLs[1]"
                            class="tag"
                            @click="openImage(props.row.OwnershipProofURLs[1])"
                        >
                            Back
                        </div>
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
                <template #default="props">
                    <SelectInput
                        :key="props.row.ID"
                        :default-value="getKYCStatusLabel(props.row.KYCStatus)"
                        :list="KYCStatusLabel"
                        class="select"
                        name="updateKYCStatus"
                        @change="onStatusUpdate(props.row, $event.target.value)"
                    />
                </template>
            </b-table-column>
        </b-table>
    </div>
    <b-modal v-model="showImageModal" has-modal-card full-screen scroll="keep">
        <div class="image-preview-modal">
            <img :src="selectedImage" alt="Document Preview" />
        </div>
    </b-modal>
</template>

<script>
import { getKYCStatusLabel, KYCStatusLabel, KYCStatus } from '@/constant/enums';
import { mapState, mapActions } from 'vuex';
// import AtomSelectInput from '../components/atoms/AtomSelectInput.vue';
import LoaderModal from '../components/extras/LoaderModal.vue';
import SelectInput from '@/components/global/SelectInput.vue';
import MoleculeSearchBox from '@/components/molecules/MoleculeSearchBox.vue';

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
            KYCStatus,
            showImageModal: false,
            selectedImage: null,
        };
    },
    computed: {
        ...mapState('kycStatusPortal', [
            'isLoading',
            'hasError',
            'errorMessage',
            'users',
            'searchMobile',
        ]),
    },
    watch: {
        hasError(error) {
            if (error) {
                this.alertError(this.errorMessage);
            }
        },
    },
    mounted() {
        this.fetchKycPendingUsers();
    },
    created() {
        const mobile = this.$route.query.mobile;
        if (mobile) {
            this.updateMobileInput(mobile);
        } else {
            this.updateMobileInput('');
        }
    },

    methods: {
        ...mapActions('kycStatusPortal', [
            'fetchKycPendingUsers',
            'updateStatus',
            'updateMobileInput',
        ]),
        

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
            const labelId = KYCStatus[newStatus];
            if (labelId != null) {
                row['KYCStatus'] = labelId;
                await this.updateStatus({ userData: row });
                this.$buefy.toast.open({
                    message: `KYC Status updated to ${getKYCStatusLabel(labelId)}`,
                    type: 'is-success',
                    duration: 3000,
                });
            } else {
                this.alertError('Invalid status selected.');
            }
        },

        async searchUsersWithMobile(userMobile) {
            if (userMobile != '') {
                // Sanitize Mobile Number
                const sanitizeMobileNumber = this.sanitizeMobile(userMobile);
                if (!sanitizeMobileNumber) {
                    this.$buefy.dialog.alert({
                        title: 'Error',
                        message: 'Invalid Mobile Number',
                        type: 'is-danger',
                        hasIcon: true,
                        icon: 'alert-circle',
                        ariaRole: 'alertdialog',
                        ariaModal: true,
                    });
                } else {
                    // Update Search Text with voMobile
                    this.updateMobileInput(sanitizeMobileNumber);
                    this.$router.push({
                        path: this.$route.path,
                        query: {
                            mobile: sanitizeMobileNumber,
                        },
                    });
                }
            }
        },

        // Clear Mobile Input
        async onClearMobileInput() {
            if (this.$route.query.mobile) {
                this.updateMobileInput('');
                this.$router.push({
                    name: 'kyc-status',
                });
            }
        },

        // Sanitize mobile number
        sanitizeMobile(input) {
            // filter all non-digints characters
            let sanitized = input.replace(/[^\d]/g, '');
            // if this constains extra 91 (Country code)
            if (sanitized.length > 10 && sanitized.startsWith('91')) {
                sanitized = sanitized.slice(2);
            }

            if (sanitized.length !== 10) {
                return null;
            }

            return sanitized;
        },

        openImage(url) {
            this.selectedImage = url;
            this.showImageModal = true;
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
    margin-top: 32px;
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
    max-height: 90vh;
    max-width: 100%;
    object-fit: contain;
    z-index: 999;
}
</style>
