<template>
    <div class="pending-payments-root">
        <LoaderModal v-if="isLoading"></LoaderModal>
        <div v-if="isAuthReady && isAdmin" class="table-wrapper">
            <div class="search-top">
                <MoleculeSearchBox
                    :initial-value="bookingIdSearch"
                    placeholder="Booking ID"
                    @clear-input="clearBookingIdSearch"
                    @on-search="searchBookingId"
                ></MoleculeSearchBox>
            </div>
            <b-table
                :bordered="true"
                :data="filteredPendingPayments"
                :focusable="true"
                :hoverable="true"
                :mobile-cards="true"
                :narrowed="true"
                :paginated="true"
                :per-page="20"
                :sticky-header="true"
                height="500"
            >
                <b-table-column
                    v-slot="props"
                    field="BookingId"
                    label="Booking ID"
                    searchable
                    sortable
                    width="132"
                >
                    <router-link
                        v-if="String(props.row.BookingId || '').trim() !== ''"
                        :to="getBookingPortalRoute(props.row.BookingId)"
                        class="spot-detail-link"
                    >
                        {{ props.row.BookingId }}
                    </router-link>
                    <div v-else>{{ props.row.BookingId }}</div>
                </b-table-column>

                <b-table-column
                    v-slot="props"
                    field="SiteId"
                    label="Site ID"
                    searchable
                    sortable
                    width="160"
                >
                    <router-link
                        v-if="getSpotId(props.row) !== ''"
                        :to="getSpotDetailRoute(getSpotId(props.row))"
                        class="spot-detail-link"
                    >
                        {{ getSpotId(props.row) }}
                    </router-link>
                    <div v-else>-</div>
                </b-table-column>

                <b-table-column
                    v-slot="props"
                    field="VoName"
                    label="VO Name"
                    searchable
                    sortable
                    width="160"
                >
                    <div>{{ props.row.VoName }}</div>
                </b-table-column>

                <b-table-column
                    v-slot="props"
                    field="VoMobile"
                    label="VO Mobile No"
                    searchable
                    sortable
                    width="140"
                >
                    <div>{{ props.row.VoMobile }}</div>
                </b-table-column>

                <b-table-column
                    v-slot="props"
                    field="SoName"
                    label="SO Name"
                    searchable
                    sortable
                    width="160"
                >
                    <div>{{ props.row.SoName }}</div>
                </b-table-column>

                <b-table-column
                    v-slot="props"
                    field="SoMobile"
                    label="SO Mobile No"
                    searchable
                    sortable
                    width="140"
                >
                    <div>{{ props.row.SoMobile }}</div>
                </b-table-column>

                <b-table-column
                    v-slot="props"
                    field="BaseAmount"
                    label="Transfer"
                    numeric
                    sortable
                    width="120"
                >
                    <div>{{ formatAmount(props.row.BaseAmount) }}</div>
                </b-table-column>

                <b-table-column
                    v-slot="props"
                    field="Amount"
                    label="Received"
                    numeric
                    sortable
                    width="112"
                >
                    <div>{{ formatAmount(props.row.Amount) }}</div>
                </b-table-column>

                <b-table-column
                    v-slot="props"
                    label="Action"
                    centered
                    width="152"
                >
                    <AtomButton
                        class="pay-now-btn"
                        @btn-click="openPaymentModal(props.row)"
                    >
                        Pay Now
                    </AtomButton>
                </b-table-column>
            </b-table>
        </div>

        <b-modal
            v-model="showPaymentModal"
            has-modal-card
            trap-focus
            :destroy-on-hide="false"
        >
            <div v-if="selectedPayment" class="modal-card pending-modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Pending Payment</p>
                </header>
                <section class="modal-card-body">
                    <div class="modal-body-layout">
                        <div class="modal-top-row">
                            <div class="modal-left">
                                <div class="payment-context">
                                    <div class="payment-detail-row">
                                        <span class="payment-detail-key"
                                            >Payment ID:</span
                                        >
                                        <span class="payment-detail-value">{{
                                            selectedPayment.PaymentId
                                        }}</span>
                                    </div>
                                    <div class="payment-detail-row">
                                        <span class="payment-detail-key"
                                            >Booking ID:</span
                                        >
                                        <router-link
                                            v-if="
                                                String(
                                                    selectedPayment.BookingId ||
                                                        '',
                                                ).trim() !== ''
                                            "
                                            :to="
                                                getBookingPortalRoute(
                                                    selectedPayment.BookingId,
                                                )
                                            "
                                            class="payment-detail-value spot-detail-link"
                                        >
                                            {{ selectedPayment.BookingId }}
                                        </router-link>
                                        <span
                                            v-else
                                            class="payment-detail-value"
                                            >{{
                                                selectedPayment.BookingId
                                            }}</span
                                        >
                                    </div>
                                    <div class="payment-detail-row">
                                        <span class="payment-detail-key"
                                            >Site ID:</span
                                        >
                                        <router-link
                                            v-if="
                                                getSpotId(selectedPayment) !== ''
                                            "
                                            :to="
                                                getSpotDetailRoute(
                                                    getSpotId(selectedPayment),
                                                )
                                            "
                                            class="payment-detail-value spot-detail-link"
                                        >
                                            {{ getSpotId(selectedPayment) }}
                                        </router-link>
                                        <span
                                            v-else
                                            class="payment-detail-value"
                                            >-</span
                                        >
                                    </div>
                                    <div class="payment-detail-row">
                                        <span class="payment-detail-key"
                                            >VO Name:</span
                                        >
                                        <span class="payment-detail-value">{{
                                            selectedPayment.VoName
                                        }}</span>
                                    </div>
                                    <div class="payment-detail-row">
                                        <span class="payment-detail-key"
                                            >SO Name:</span
                                        >
                                        <span class="payment-detail-value">{{
                                            resolvedPayeeName
                                        }}</span>
                                    </div>
                                    <div class="payment-detail-row">
                                        <span class="payment-detail-key"
                                            >Received:</span
                                        >
                                        <span class="payment-detail-value">{{
                                            formatAmount(
                                                selectedPayment.Amount,
                                            )
                                        }}</span>
                                    </div>
                                    <div class="amount-inline-row">
                                        <span class="payment-detail-key"
                                            >Transfer:</span
                                        >
                                        <div class="amount-input-wrap">
                                            <b-input
                                                v-model="draftAmountInput"
                                                min="1"
                                                step="0.01"
                                                type="number"
                                            ></b-input>
                                            <div class="amount-edit-actions">
                                                <AtomButton
                                                    outlined
                                                    class="amount-action-btn amount-cancel-btn"
                                                    @btn-click="
                                                        cancelAmountEdit
                                                    "
                                                >
                                                    Cancel
                                                </AtomButton>
                                                <AtomButton
                                                    class="amount-action-btn"
                                                    @btn-click="
                                                        saveAmountEdit
                                                    "
                                                >
                                                    Save
                                                </AtomButton>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="detail-inline-row">
                                        <label class="detail-inline-label"
                                            >Payment App:</label
                                        >
                                        <div class="detail-input-wrap">
                                            <b-input
                                                :value="resolvedPaymentAppLabel"
                                                readonly
                                                placeholder="Payment App"
                                            ></b-input>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="modal-right">
                                <div v-if="upiUrl !== ''" class="qr-card">
                                    <qrcode-vue
                                        :size="220"
                                        :value="upiUrl"
                                        class="qr-image"
                                        level="M"
                                    />
                                </div>

                                <div
                                    v-if="upiUrl === ''"
                                    class="missing-upi-text"
                                >
                                    Payment details are unavailable for this
                                    payment.
                                </div>

                                <div class="account-info-right">
                                    <span class="account-info-label"
                                        >Account Info:</span
                                    >
                                    <span class="account-info-value">{{
                                        resolvedAccountInfo || '-'
                                    }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="remark-inline-row">
                            <label class="remark-inline-label">Remark:</label>
                            <div class="remark-input-wrap">
                                <b-input
                                    ref="remarkInput"
                                    :readonly="!isRemarkEditable"
                                    :value="editableRemark"
                                    @input="onRemarkInput"
                                ></b-input>
                                <button
                                    class="remark-edit-btn"
                                    type="button"
                                    @click="toggleRemarkEdit"
                                >
                                    <b-icon icon="pencil"></b-icon>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot pending-modal-foot">
                    <AtomButton
                        outlined
                        class="pending-cancel-btn"
                        @btn-click="closePaymentModal"
                    >
                        Cancel
                    </AtomButton>
                    <AtomButton @btn-click="openSuccessConfirmation">
                        Record Success
                    </AtomButton>
                </footer>
            </div>
        </b-modal>

        <b-modal
            v-model="showSuccessModal"
            has-modal-card
            trap-focus
            :destroy-on-hide="false"
        >
            <div class="modal-card confirm-modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Payment Confirmation</p>
                </header>
                <section class="modal-card-body">
                    <p>Was payment successful?</p>
                </section>
                <footer class="modal-card-foot pending-modal-foot">
                    <AtomButton
                        outlined
                        class="pending-cancel-btn"
                        @btn-click="closeSuccessModal"
                    >
                        Cancel
                    </AtomButton>
                    <AtomButton @btn-click="recordPaymentSuccess">
                        Record Success
                    </AtomButton>
                </footer>
            </div>
        </b-modal>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AtomButton from '@/components/atoms/AtomButton.vue';
import MoleculeSearchBox from '@/components/molecules/MoleculeSearchBox.vue';
import LoaderModal from '@/components/extras/LoaderModal.vue';
import QrcodeVue from 'qrcode.vue';

export default {
    name: 'PendingPaymentsPortal',
    components: {
        AtomButton,
        MoleculeSearchBox,
        LoaderModal,
        QrcodeVue,
    },
    data() {
        return {
            showPaymentModal: false,
            showSuccessModal: false,
            selectedPayment: null,
            isRemarkEditable: false,
            editableAmount: 0,
            draftAmountInput: '0',
            editableRemark: '',
            bookingIdSearch: '',
        };
    },
    computed: {
        ...mapState('pendingPayments', [
            'pendingPayments',
            'hasError',
            'errorMessage',
            'isLoading',
        ]),
        ...mapState('user', ['isAdmin', 'isAuthReady']),
        filteredPendingPayments() {
            const query = this.bookingIdSearch.trim().toLowerCase();
            if (query === '') {
                return this.pendingPayments;
            }
            return this.pendingPayments.filter((payment) =>
                String(payment.BookingId || '')
                    .toLowerCase()
                    .includes(query),
            );
        },
        accountDetails() {
            return this.selectedPayment?.Account || {};
        },
        resolvedUpiId() {
            const upiId = String(this.accountDetails.UpiId || '').trim();
            if (upiId !== '') {
                return upiId;
            }
            const accountNumber = String(
                this.accountDetails.BankAccountNumber || '',
            ).replace(/\s+/g, '');
            const ifsc = String(this.accountDetails.IfscCode || '')
                .replace(/\s+/g, '')
                .toUpperCase();
            if (accountNumber !== '' && ifsc !== '') {
                return `${accountNumber}@${ifsc}.ifsc.npci`;
            }
            return '';
        },
        resolvedPayeeName() {
            const accountFullName = String(
                this.accountDetails.FullName || '',
            ).trim();
            if (accountFullName !== '') {
                return accountFullName;
            }
            return String(this.selectedPayment?.SoName || '').trim();
        },
        resolvedPaymentAppLabel() {
            return String(this.accountDetails.PaymentAppLabel || '').trim();
        },
        resolvedAccountInfo() {
            const accountNumber = String(
                this.accountDetails.BankAccountNumber || '',
            ).trim();
            const ifscCode = String(this.accountDetails.IfscCode || '')
                .trim()
                .toUpperCase();
            const upiId = String(this.accountDetails.UpiId || '').trim();

            if (accountNumber !== '' && ifscCode !== '') {
                return `${accountNumber} / ${ifscCode}`;
            }
            if (upiId !== '') {
                return upiId;
            }
            return String(this.selectedPayment?.PaymentDetails || '').trim();
        },
        finalAmount() {
            return Number(this.editableAmount);
        },
        upiUrl() {
            if (this.selectedPayment && this.resolvedUpiId !== '') {
                const remark = this.decodeTransactionText(this.editableRemark);
                const transactionReference =
                    remark || `Ref${this.selectedPayment.PaymentId}`;
                const formattedAmount = Number.isFinite(this.finalAmount)
                    ? this.finalAmount.toFixed(2)
                    : '0.00';
                const upiQuery = [
                    `pa=${encodeURIComponent(this.resolvedUpiId)}`,
                    `pn=${encodeURIComponent(this.resolvedPayeeName)}`,
                    `am=${encodeURIComponent(formattedAmount)}`,
                    `tr=${encodeURIComponent(transactionReference)}`,
                    'mc=0000',
                    `tn=${encodeURIComponent(remark)}`,
                    'cu=INR',
                ].join('&');
                return `upi://pay?${upiQuery}`;
            }
            return '';
        },
    },
    watch: {
        isAdmin(isAdmin) {
            this.loadPendingPayments(isAdmin, this.isAuthReady);
        },
        isAuthReady(isAuthReady) {
            this.loadPendingPayments(this.isAdmin, isAuthReady);
        },
        hasError(hasError) {
            if (hasError) {
                this.alertError(this.errorMessage);
            }
        },
    },
    created() {
        this.loadPendingPayments(this.isAdmin, this.isAuthReady);
    },
    methods: {
        ...mapActions('pendingPayments', [
            'getPendingPayments',
            'updateAmountToSO',
        ]),
        loadPendingPayments(isAdmin, isAuthReady) {
            if (isAuthReady && isAdmin) {
                this.getPendingPayments();
            }
        },
        formatAmount(amount) {
            return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
        },
        getSpotId(payment) {
            return String(
                payment?.SiteId ||
                    payment?.SiteID ||
                    payment?.SiteDetails?.SiteID ||
                    '',
            ).trim();
        },
        getSpotDetailRoute(spotId) {
            return {
                name: 'spot-detail',
                params: {
                    spotId,
                },
            };
        },
        getBookingPortalRoute(bookingId) {
            return {
                name: 'booking-portal',
                query: {
                    bookingId: String(bookingId || '').trim(),
                },
            };
        },
        decodeTransactionText(value) {
            const rawText = String(value || '').trim();
            if (rawText === '') {
                return '';
            }
            const plusDecodedText = rawText.replace(/\+/g, ' ');
            try {
                return decodeURIComponent(plusDecodedText);
            } catch {
                return plusDecodedText;
            }
        },
        getDefaultRemark(payment) {
            const decodedRemark = this.decodeTransactionText(payment?.Remark);
            if (decodedRemark !== '') {
                return decodedRemark;
            }
            const decodedVoName = this.decodeTransactionText(payment?.VoName);
            return `Rent(${decodedVoName}, booking id: ${payment.BookingId})`;
        },
        openPaymentModal(payment) {
            this.selectedPayment = payment;
            this.isRemarkEditable = false;
            this.editableAmount = Number(this.selectedPayment.BaseAmount);
            this.draftAmountInput = String(this.editableAmount);
            this.editableRemark = this.getDefaultRemark(this.selectedPayment);
            this.showPaymentModal = true;
        },
        closePaymentModal() {
            this.showPaymentModal = false;
            this.selectedPayment = null;
            this.isRemarkEditable = false;
            this.editableAmount = 0;
            this.draftAmountInput = '0';
            this.editableRemark = '';
        },
        saveAmountEdit() {
            const parsedAmount = Number(this.draftAmountInput);
            if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
                this.alertError('Please enter a valid transfer amount');
                return;
            }
            this.editableAmount = parsedAmount;
        },
        cancelAmountEdit() {
            this.draftAmountInput = String(this.editableAmount);
        },
        toggleRemarkEdit() {
            this.isRemarkEditable = !this.isRemarkEditable;
            if (this.isRemarkEditable) {
                this.focusRemarkInput();
            }
        },
        focusRemarkInput() {
            this.$nextTick(() => {
                const input = this.$refs.remarkInput?.$el?.querySelector('input');
                if (input) {
                    input.focus();
                    input.select();
                }
            });
        },
        onRemarkInput(value) {
            this.editableRemark = value;
        },
        searchBookingId(searchText) {
            this.bookingIdSearch = String(searchText || '').trim();
        },
        clearBookingIdSearch() {
            this.bookingIdSearch = '';
        },
        openSuccessConfirmation() {
            if (Number(this.draftAmountInput) !== Number(this.editableAmount)) {
                this.alertError(
                    'Please save or cancel amount changes before continuing',
                );
                return;
            }
            this.showSuccessModal = true;
        },
        closeSuccessModal() {
            this.showSuccessModal = false;
        },
        async recordPaymentSuccess() {
            if (this.selectedPayment) {
                const selectedPaymentApp =
                    this.selectedPayment?.Account?.PaymentApp ?? 0;
                const payload = {
                    PaymentID: this.selectedPayment.PaymentId,
                    AmountToSO: this.editableAmount,
                    PaymentApp: selectedPaymentApp,
                };
                const response = await this.updateAmountToSO(payload);
                if (response?.Success) {
                    this.showSuccessModal = false;
                    this.closePaymentModal();
                    this.$buefy.toast.open({
                        message: 'Payment recorded successfully',
                        type: 'is-success',
                    });
                    return;
                }
                this.alertError('Failed to record payment');
            }
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
};
</script>

<style lang="scss" scoped>
.amount-inline-row {
    align-items: center;
    color: var(--parkspot-black);
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.amount-input-wrap {
    position: relative;
    width: 160px;
}

.amount-input-wrap :deep(.control) {
    width: 100%;
}

.amount-input-wrap :deep(.input) {
    width: 100%;
}

.amount-edit-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 8px;
}

.amount-action-btn {
    min-width: 72px;
}

.amount-action-btn :deep(.button) {
    color: var(--parkspot-black);
    font-size: 0.8rem;
    font-weight: 600;
    min-width: 72px;
    padding: 4px 10px;
}

.amount-edit-actions :deep(.amount-cancel-btn.button) {
    border-color: var(--parkspot-red, #ff3860);
    background-color: var(--parkspot-white) !important;
    color: var(--parkspot-red, #ff3860);
}

.amount-edit-actions :deep(.amount-cancel-btn.button:hover),
.amount-edit-actions :deep(.amount-cancel-btn.button:focus),
.amount-edit-actions :deep(.amount-cancel-btn.button:active) {
    border-color: var(--parkspot-red, #ff3860);
    background-color: var(--parkspot-white) !important;
    color: var(--parkspot-red, #ff3860);
}

.detail-inline-label {
    color: var(--parkspot-black);
    font-weight: 600;
    white-space: nowrap;
}

.detail-inline-row {
    align-items: center;
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    width: 100%;
}

.detail-input-wrap {
    flex: 1;
}

.detail-input-wrap :deep(.control) {
    width: 100%;
}

.modal-body-layout {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.modal-left {
    flex: 1;
}

.modal-right {
    min-width: 240px;
}

.modal-top-row {
    display: flex;
    gap: 16px;
}

.missing-upi-text {
    border: 1px solid var(--primary-color);
    border-radius: 8px;
    color: var(--parkspot-black);
    font-size: 0.9rem;
    font-weight: 600;
    padding: 12px;
    text-align: left;
}

.pay-now-btn {
    min-width: 112px;
}

.pay-now-btn :deep(.button),
.pending-modal-foot :deep(.button) {
    color: var(--parkspot-black);
}

.pending-modal-foot :deep(.pending-cancel-btn.button) {
    border-color: var(--parkspot-red, #ff3860);
    background-color: var(--parkspot-white) !important;
    color: var(--parkspot-red, #ff3860);
}

.pending-modal-foot :deep(.pending-cancel-btn.button:hover),
.pending-modal-foot :deep(.pending-cancel-btn.button:focus),
.pending-modal-foot :deep(.pending-cancel-btn.button:active) {
    border-color: var(--parkspot-red, #ff3860);
    background-color: var(--parkspot-white) !important;
    color: var(--parkspot-red, #ff3860);
}

.payment-context {
    background: var(--parkspot-white);
    border: 1px solid var(--primary-color);
    border-radius: 8px;
    margin-bottom: 12px;
    padding: 12px;
    text-align: left;
}

.payment-detail-key {
    font-weight: 600;
    padding-right: 8px;
}

.payment-detail-row {
    align-items: center;
    color: var(--parkspot-black);
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.payment-detail-value {
    text-align: right;
}

.pending-modal-card {
    width: 100%;
}

.pending-modal-card .modal-card-title,
.confirm-modal-card .modal-card-title {
    color: var(--secondary-color);
}

.pending-modal-foot {
    justify-content: flex-end;
}

.pending-payments-root {
    background: #f5f5fb;
    min-height: 100vh;
    padding: 16px;
}

.qr-card {
    align-items: center;
    border: 1px solid var(--primary-color);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
}

.qr-image {
    height: 220px;
    width: 220px;
}

.remark-edit-btn {
    align-items: center;
    background: transparent;
    border: 0;
    color: var(--parkspot-black);
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    padding: 0;
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
}

.remark-inline-label {
    color: var(--parkspot-black);
    font-weight: 600;
    white-space: nowrap;
}

.remark-inline-row {
    align-items: center;
    display: flex;
    gap: 8px;
    width: 100%;
}

.remark-input-wrap {
    flex: 1;
    position: relative;
}

.remark-input-wrap :deep(.control) {
    width: 100%;
}

.remark-input-wrap :deep(.input) {
    padding-right: 28px;
    width: 100%;
}

.search-top {
    display: flex;
    justify-content: center;
    margin: 8px 0 12px;
}

.search-top :deep(.search-button) {
    margin-left: 8px;
}

.search-top :deep(.search-button .button) {
    height: 36px;
    padding: 0 12px;
}

.search-top :deep(.search-control) {
    align-items: center;
    display: flex;
    margin: 8px 0;
}

.search-top :deep(.search-input) {
    width: 180px;
}

.search-top :deep(.search-input .field) {
    margin-bottom: 0;
}

.search-top :deep(.search-input .input) {
    font-size: 0.95rem;
    height: 36px;
}

.spot-detail-link {
    color: var(--secondary-color);
    font-weight: 600;
    text-decoration: none;
}

.table-wrapper {
    background: var(--parkspot-white);
    border: 1px solid #d8d8e8;
    border-radius: 8px;
    padding: 12px;
}

.table-wrapper :deep(.table td),
.table-wrapper :deep(.table th) {
    background: var(--parkspot-white);
}

.table-wrapper :deep(.table thead th) {
    background: var(--parkspot-white);
    color: var(--parkspot-black);
    font-weight: 700;
}

.account-info-right {
    border: 1px solid var(--primary-color);
    border-radius: 8px;
    color: var(--parkspot-black);
    margin-top: 8px;
    padding: 12px;
    text-align: left;
}

.account-info-label {
    display: block;
    font-weight: 600;
    margin-bottom: 4px;
}

.account-info-value {
    display: block;
    word-break: break-word;
}

@media screen and (max-width: 920px) {
    .modal-right {
        min-width: 100%;
    }

    .modal-top-row {
        flex-direction: column;
    }

    .qr-card {
        margin-top: 8px;
    }

    .qr-image {
        height: 180px;
        width: 180px;
    }
}
</style>
