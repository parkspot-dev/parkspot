<template>
    <section>
        <!-- payment link button -->
        <div class="payment-link-btn-wrapper">
            <AtomButton @click="getPaymentLink">
                Generate Payment Link
            </AtomButton>
        </div>
        <div v-if="paymentDetails" class="payment-link-detail-container">
            <p>
                {{ paymentDetails.PayUrl }}
            </p>
            <AtomTooltip :label="toolTipLabel">
                <AtomIcon
                    class="copy-icon"
                    :icon="'content-copy'"
                    @click="copyUrl"
                ></AtomIcon>
            </AtomTooltip>
        </div>
        <!---  Booking details-->
        <div class="booking-card">
            <div class="card-top">
                <h3 class="sub-heading">Booking Details</h3>
                <div class="action-group">
                    <span
                        class="edit-icon"
                        :class="{
                            disabled:
                                editField !== null &&
                                editField !== 'Booking Details',
                        }"
                    >
                        <AtomIcon
                            :icon="'pencil'"
                            size=""
                            @click="enableEdit('Booking Details')"
                        >
                        </AtomIcon>
                    </span>
                    <span
                        class="save-icon"
                        :class="{ disabled: editField !== 'Booking Details' }"
                    >
                        <AtomIcon
                            :icon="'content-save-outline'"
                            size=""
                            @click="
                                editField === 'Booking Details' && saveField()
                            "
                        >
                        </AtomIcon>
                    </span>
                    <span
                        class="cancel-icon"
                        :class="{ disabled: editField !== 'Booking Details' }"
                    >
                        <AtomIcon
                            :icon="'close'"
                            size=""
                            @click="
                                editField === 'Booking Details' && cancelField()
                            "
                        >
                        </AtomIcon>
                    </span>
                </div>
            </div>
            <div class="card-body">
                <div class="col-wrapper">
                    <div class="field-col">
                        <p>
                            <strong> Booking ID: </strong>
                        </p>
                        <p>
                            <strong> Site ID:</strong>
                        </p>
                        <p>
                            <strong> Status:</strong>
                        </p>

                        <p>
                            <strong> Remark:</strong>
                        </p>
                    </div>
                    <div class="value-col">
                        <p>
                            {{ currBookingDetails.Booking.ID }}
                        </p>
                        <a :href="sdpURL" target="_blank">
                            <p>
                                {{ currBookingDetails.Booking.SiteID }}
                            </p>
                        </a>
                        <div
                            v-if="editField === 'Booking Details'"
                            class="select"
                        >
                            <select v-model="currBookingDetails.Booking.Status">
                                <option
                                    v-for="(
                                        label, index
                                    ) in bookingStatusLabels"
                                    :key="label"
                                    :value="index"
                                >
                                    {{ label }}
                                </option>
                            </select>
                        </div>
                        <p v-else>
                            {{
                                getBookingStatusLabel(
                                    currBookingDetails.Booking.Status,
                                )
                            }}
                        </p>
                        <span
                            v-if="editField === 'Booking Details'"
                            class="input-field"
                        >
                            <AtomInput
                                v-model="currBookingDetails.Booking.Remark"
                                :size="'is-small'"
                                type="text"
                            >
                            </AtomInput>
                        </span>
                        <p v-else>
                            {{ currBookingDetails.Booking.Remark }}
                        </p>
                    </div>
                </div>

                <div class="col-wrapper">
                    <div class="field-col">
                        <p>
                            <strong> Created At:</strong>
                        </p>

                        <p>
                            <strong> Started At:</strong>
                        </p>

                        <p>
                            <strong> End Date:</strong>
                        </p>

                        <p><strong> Agent </strong></p>
                    </div>
                    <div class="value-col">
                        <p>
                            {{
                                getFormattedDate(
                                    currBookingDetails.Booking.CreatedAt,
                                )
                            }}
                        </p>
                        <div
                            v-if="editField === 'Booking Details'"
                            class="input-field"
                        >
                            <AtomDatePicker
                                :size="'is-small'"
                                :assigned-date="
                                    currBookingDetails.Booking.StartTime
                                "
                                class="column-width"
                                @changed="onStartDateUpdate"
                            >
                            </AtomDatePicker>
                        </div>
                        <p v-else>
                            {{
                                getFormattedDate(
                                    currBookingDetails.Booking.StartTime,
                                )
                            }}
                        </p>
                        <div
                            v-if="editField === 'Booking Details'"
                            class="input-field"
                        >
                            <AtomDatePicker
                                :size="'is-small'"
                                :assigned-date="
                                    currBookingDetails.Booking.EndTime
                                "
                                class="column-width"
                                @changed="onEndDateUpdate"
                            >
                            </AtomDatePicker>
                        </div>
                        <p v-else>
                            {{
                                getFormattedDate(
                                    currBookingDetails.Booking.EndTime,
                                )
                            }}
                        </p>

                        <div
                            v-if="editField === 'Booking Details'"
                            class="select"
                        >
                            <select v-model="selectedAgent">
                                <option disabled value="">Select agent</option>
                                <option
                                    v-for="(label, index) in agents"
                                    :key="label.UserName"
                                    :value="index"
                                >
                                    {{ label.FullName.split(' ')[0] }}
                                </option>
                            </select>
                        </div>
                        <p v-else>
                            {{
                                getAgentName(
                                    agents,
                                    currBookingDetails.Booking.AgentUserName,
                                )
                            }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- rent details-->
        <div class="booking-card">
            <div class="card-top">
                <h3 class="sub-heading">Rent Details</h3>
                <div class="action-group">
                    <span
                        class="edit-icon"
                        :class="{
                            disabled:
                                editField !== null &&
                                editField !== 'Rent Details',
                        }"
                    >
                        <AtomIcon
                            :icon="'pencil'"
                            size=""
                            @click="enableEdit('Rent Details')"
                        >
                        </AtomIcon>
                    </span>

                    <span
                        class="save-icon"
                        :class="{ disabled: editField !== 'Rent Details' }"
                    >
                        <AtomIcon
                            :icon="'content-save-outline'"
                            size=""
                            @click="editField === 'Rent Details' && saveField()"
                        >
                        </AtomIcon>
                    </span>

                    <span
                        class="cancel-icon"
                        :class="{ disabled: editField !== 'Rent Details' }"
                    >
                        <AtomIcon :icon="'close'" size="" @click="cancelField">
                        </AtomIcon>
                    </span>
                </div>
            </div>
            <div class="card-body">
                <div class="col-wrapper">
                    <div class="field-col">
                        <p>
                            <strong> Rent: </strong>
                        </p>
                        <p>
                            <strong> SO Charges: </strong>
                        </p>
                        <p><strong> Priodicity: </strong></p>
                    </div>
                    <div class="value-col">
                        <div
                            v-if="editField === 'Rent Details'"
                            class="input-field"
                        >
                            <AtomInput
                                v-model.number="currBookingDetails.Booking.Rent"
                                :size="'is-small'"
                                type="number"
                                :class="{ 'is-danger': rentValidationError }"
                                @input="validateRentInput"
                            ></AtomInput>
                            <p
                                v-if="rentValidationError"
                                class="validation-error"
                            >
                                {{ rentValidationError }}
                            </p>
                        </div>
                        <p v-else>
                            {{ currBookingDetails.Booking.Rent }}
                        </p>
                        <div
                            v-if="editField === 'Rent Details'"
                            class="input-field"
                        >
                            <AtomInput
                                v-model.number="
                                    currBookingDetails.Booking.BaseAmount
                                "
                                :size="'is-small'"
                                type="number"
                                :class="{
                                    'is-danger': soChargesValidationError,
                                }"
                                @input="validateSOChargesInput"
                            ></AtomInput>
                            <p
                                v-if="soChargesValidationError"
                                class="validation-error"
                            >
                                {{ soChargesValidationError }}
                            </p>
                        </div>
                        <p v-else>
                            {{ currBookingDetails.Booking.BaseAmount }}
                        </p>
                        <div
                            v-if="editField === 'Rent Details'"
                            class="input-field"
                        >
                            <select
                                v-model="
                                    currBookingDetails.Booking.PaymentPeriod
                                "
                            >
                                <option
                                    v-for="(
                                        label, index
                                    ) in paymentPeriodicityLabels"
                                    :key="label"
                                    :value="index"
                                >
                                    {{ label }}
                                </option>
                            </select>
                        </div>
                        <p v-else>
                            {{
                                getPaymentPeriodicityLabel(
                                    currBookingDetails.Booking.PaymentPeriod,
                                )
                            }}
                        </p>
                    </div>
                </div>
                <div class="col-wrapper">
                    <div class="field-col">
                        <p>
                            <strong> ConvenienceFee: </strong>
                        </p>
                        <p>
                            <strong> Security Deposit: </strong>
                        </p>
                        <p>
                            <strong> Rent Cycle: </strong>
                        </p>
                    </div>
                    <div class="value-col">
                        <div
                            v-if="editField === 'Rent Details'"
                            class="input-field"
                        >
                            <AtomInput
                                v-model.number="
                                    currBookingDetails.Booking.ConvenienceFee
                                "
                                :size="'is-small'"
                                type="number"
                            ></AtomInput>
                        </div>
                        <p v-else>
                            {{ currBookingDetails.Booking.ConvenienceFee }}
                        </p>
                        <div
                            v-if="editField === 'Rent Details'"
                            class="input-field"
                        >
                            <AtomInput
                                v-model.number="
                                    currBookingDetails.Booking.SecurityDeposit
                                "
                                :size="'is-small'"
                                type="number"
                            ></AtomInput>
                        </div>
                        <p v-else>
                            {{ currBookingDetails.Booking.SecurityDeposit }}
                        </p>
                        <div
                            v-if="editField === 'Rent Details'"
                            class="input-field"
                        >
                            <AtomInput
                                v-model.number="
                                    currBookingDetails.Booking.RentCycle
                                "
                                :size="'is-small'"
                                type="number"
                            ></AtomInput>
                        </div>
                        <p v-else>
                            {{ currBookingDetails.Booking.RentCycle }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- VO details-->
        <div class="booking-card">
            <h3 class="sub-heading">VO Details</h3>
            <div class="card-body">
                <div class="col-wrapper">
                    <div class="field-col">
                        <p>
                            <strong> UserName: </strong>
                        </p>
                        <p>
                            <strong> Full Name: </strong>
                        </p>
                        <p>
                            <strong> Mobile: </strong>
                        </p>
                    </div>
                    <div class="value-col">
                        <p>
                            {{ currBookingDetails.Booking.UserName }}
                        </p>
                        <p>
                            {{ currBookingDetails.Booking.Name }}
                        </p>
                        <p>
                            <a
                                :href="parkingRequestSearchUrl"
                                target="_blank"
                                class="mobile-link"
                            >
                                {{ currBookingDetails.Booking.Mobile }}
                            </a>
                        </p>
                    </div>
                </div>
                <div class="col-wrapper">
                    <div class="field-col">
                        <p>
                            <strong> Vehicle Number:</strong>
                        </p>
                        <p>
                            <strong> Email: </strong>
                        </p>
                        <p>
                            <strong> KYC Status: </strong>
                        </p>
                    </div>
                    <div class="value-col">
                        <p>
                            {{ currBookingDetails.Booking.VehicleNumber }}
                        </p>
                        <p>
                            {{ currBookingDetails.Booking.EmailID }}
                        </p>
                        <p>
                            <span class="kyc-status-text">
                                {{
                                    getKYCStatusLabel(
                                        currBookingDetails.Booking.VOKYCStatus,
                                    )
                                }}
                            </span>

                            <a
                                v-if="
                                    currBookingDetails.Booking.VOKYCStatus !==
                                        KYCStatus.NotSet && kycStatusUrl !== '#'
                                "
                                :href="kycStatusUrl"
                                target="_blank"
                                class="kyc-link"
                            >
                                View KYC
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <hr />
        <!-- Payments-->
        <div class="payment-history-container">
            <h3 class="sub-heading">Payment Details</h3>
            <div class="table">
                <div class="row header">
                    <div class="cell"><strong> Payment ID </strong></div>
                    <div class="cell"><strong> CreatedAt </strong></div>
                    <div class="cell"><strong> ReceivedAt </strong></div>
                    <div class="cell"><strong> TransferredAt </strong></div>
                    <div class="cell"><strong> Payment Type </strong></div>
                    <div class="cell"><strong> Status </strong></div>
                    <div class="cell"><strong> Amount </strong></div>
                    <div class="cell"><strong> Amount ToSo </strong></div>
                    <div v-if="isAdmin" class="cell">
                        <strong> Refund </strong>
                    </div>
                </div>
                <div v-if="currBookingDetails?.Booking.Payments">
                    <div
                        v-for="payment in currBookingDetails?.Booking.Payments"
                        :key="payment.PaymentID"
                        class="row"
                    >
                        <div class="cell">{{ payment.PaymentID }}</div>
                        <div class="cell">
                            {{ getFormattedDate(payment.CreatedAt) }}
                        </div>
                        <div class="cell">
                            {{ getFormattedDate(payment.SucceededAt) }}
                        </div>
                        <div class="cell">
                            {{ getFormattedDate(payment.TransferredAt) }}
                        </div>
                        <div v-if="isAdmin" class="update-payment">
                            <SelectInput
                                :model-value="getPaymentTypeLabel(payment.Type)"
                                :list="paymentTypeLabels"
                                name="updatePayment"
                                @update:model-value="
                                    updatePaymentType($event, payment.PaymentID)
                                "
                            />
                        </div>
                        <div v-else class="cell">
                            {{ getPaymentTypeLabel(payment.Type) }}
                        </div>
                        <div class="cell">
                            <div
                                class="status-indicator"
                                :class="getPaymentClass(payment.Status)"
                            >
                                <span class="status-label">
                                    {{ getPaymentStatusLabel(payment.Status) }}
                                </span>
                                <AtomIcon
                                    v-if="
                                        getPaymentClass(payment.Status) ==
                                        'payment-pending'
                                    "
                                    :icon="'refresh'"
                                    type="primary"
                                    size="is-small"
                                    @click="
                                        refreshPaymentStatus(payment.PaymentID)
                                    "
                                >
                                </AtomIcon>
                            </div>
                        </div>
                        <div class="cell">₹ {{ payment.Amount }}</div>
                        <div class="cell">₹ {{ payment.AmountToSo }}</div>
                        <div v-if="isAdmin" class="cell">
                            <div class="icon-cell">
                                <img
                                    v-if="
                                        getPaymentClass(payment.Status) ===
                                        'payment-success'
                                    "
                                    alt="Refund Icon"
                                    class="refund-icon"
                                    :src="RefundIcon"
                                    @click="
                                        openRefundDialog(
                                            payment.PaymentID,
                                            payment.Amount,
                                        )
                                    "
                                />
                            </div>
                        </div>
                        <RefundDialog
                            v-if="refundDialogVisible"
                            :payment-amount="selectedPaymentAmount"
                            :visible="refundDialogVisible"
                            @cancel="closeRefundDialog"
                            @confirm="handleRefundConfirm"
                        />
                    </div>
                </div>
                <div v-else>No payment history found.</div>
            </div>
        </div>
    </section>
</template>

<script>
import { cloneDeep } from 'lodash';
import { mapActions, mapState } from 'vuex';
import RefundIcon from '/assets/refund.png';
import {
    BookingStatusLabels,
    getBookingStatusLabel,
    getKYCStatusLabel,
    getPaymentPeriodicityLabel,
    getPaymentStatusLabel,
    getPaymentTypeLabel,
    getUserTypeLabel,
    KYCStatus,
    PaymentPeriodicityLabels,
    PaymentStatus,
    PaymentTypeLabels,
} from '@/constant/enums';
import AtomButton from '@/components/atoms/AtomButton.vue';
import AtomIcon from '@/components/atoms/AtomIcon.vue';
import AtomTooltip from '@/components/atoms/AtomTooltip.vue';
import AtomDatePicker from '@/components/atoms/AtomDatePicker.vue';
import AtomInput from '@/components/atoms/AtomInput.vue';
import moment from 'moment';
import RefundDialog from '@/components/global/RefundDialog.vue';
import SelectInput from '@/components/global/SelectInput.vue';

export default {
    name: 'TemplateBookingPortal',
    components: {
        AtomButton,
        AtomIcon,
        AtomTooltip,
        AtomDatePicker,
        AtomInput,
        RefundDialog,
        SelectInput,
    },
    emits: ['payment-link', 'refresh-payment-status', 'update-booking-details'],
    setup() {
        return { RefundIcon };
    },
    data() {
        return {
            bookingStatusLabels: BookingStatusLabels,
            currBookingDetails: null,
            editField: null,
            paymentID: null,
            paymentPeriodicityLabels: PaymentPeriodicityLabels,
            paymentTypeLabels: PaymentTypeLabels,
            refundDialogVisible: false,
            selectedPaymentAmount: null,
            toolTipLabel: 'Copy payment url!',
            rentValidationError: '',
            soChargesValidationError: '',
            KYCStatus,
        };
    },
    computed: {
        ...mapState('bookingPortal', [
            'bookingDetails',
            'initialActiveBookingDetails',
            'isFieldUpdated',
            'paymentDetails',
            'status',
            'statusMessage',
            'successMessage',
            'updatedFields',
        ]),
        ...mapState('user', ['isAdmin']),
        ...mapState('app', ['agents']),
        sdpURL() {
            return this.$router.resolve({
                name: 'spot-detail',
                params: {
                    spotId: this.currBookingDetails.Booking.SiteID,
                },
            }).href;
        },

        parkingRequestSearchUrl() {
            const mobile = this.currBookingDetails?.Booking?.Mobile;
            return mobile
                ? `https://www.parkspot.in/internal/search-portal?tab=parking-request&mobile=${mobile}`
                : '#';
        },

        kycStatusUrl() {
            const mobile = this.currBookingDetails?.Booking?.Mobile;
            return mobile
                ? `https://www.parkspot.in/internal/users/kyc-status?mobile=${mobile}`
                : '#';
        },

        selectedAgent: {
            get() {
                const index = this.agents.findIndex(
                    (item) =>
                        item.UserName ===
                        this.currBookingDetails.Booking.AgentUserName,
                );
                return index >= 0 ? index : '';
            },
            set(value) {
                this.currBookingDetails.Booking.AgentUserName =
                    this.agents[value].UserName;
            },
        },
        isRentValid() {
            const rent = this.currBookingDetails?.Booking?.Rent;
            return rent && rent > 0;
        },
    },
    watch: {
        '$store.state.bookingPortal.bookingDetails'(val) {
            this.currBookingDetails = cloneDeep(val); // make a local copy of bookingDetails
        },
        '$store.state.bookingPortal.successMessage'(message) {
            if (message) {
                this.showSuccessMessage();
                setTimeout(() => {
                    this.$store.commit('bookingPortal/set-isField-updated', '');
                }, 2000);
            }
        },
        'status'(newStatus) {
            if (newStatus === 'error') {
                this.alertError(this.statusMessage);
            } else if (newStatus === 'success') {
                this.alertSuccess(this.statusMessage);
            }
        },
    },
    beforeMount() {
        this.currBookingDetails = cloneDeep(this.bookingDetails); // make a local copy of bookingDetails
    },
    mounted() {
        this.getUserProfile();
    },
    methods: {
        ...mapActions('bookingPortal', [
            'createRefund',
            'setUpdatedFields',
            'changePaymentType',
        ]),
        ...mapActions('user', ['getUserProfile']),

        getPaymentStatusLabel(paymentStatus) {
            return getPaymentStatusLabel(paymentStatus);
        },
        getPaymentPeriodicityLabel(paymentPeriodicity) {
            return getPaymentPeriodicityLabel(paymentPeriodicity);
        },
        getBookingStatusLabel(bookingStatus) {
            return getBookingStatusLabel(bookingStatus);
        },
        getPaymentTypeLabel(paymentType) {
            return getPaymentTypeLabel(paymentType);
        },
        getUserTypeLabel(userType) {
            return getUserTypeLabel(userType);
        },
        getAgentName(agents, agentUserName) {
            if (!agentUserName) {
                return 'Agent not assigned';
            }

            const agent = agents.find(
                (item) => item.UserName === agentUserName,
            );

            // if agent full name is available, return the username
            if (agent && agent.FullName) {
                return agent.FullName.split(' ')[0];
            }

            return agentUserName;
        },

        getPaymentClass(status) {
            if (
                status == PaymentStatus.PaymentSuccess ||
                status == PaymentStatus.PaymentTransferred
            ) {
                return 'payment-success';
            } else if (
                status == PaymentStatus.PaymentPending ||
                status == PaymentStatus.PaymentIncomplete
            ) {
                return 'payment-pending';
            }
            return 'payment-failed';
        },

        getPaymentLink() {
            this.toolTipLabel = 'Copy payment url!';
            const reqBody = {
                BookingID: this.currBookingDetails.Booking.ID.toString(),
                Discount: 0.0,
                Promocode: '',
            };

            this.$emit('payment-link', reqBody);
        },

        refreshPaymentStatus(paymentId) {
            this.$emit('refresh-payment-status', paymentId);
        },

        copyUrl() {
            navigator.clipboard
                .writeText(this.paymentDetails.PayUrl)
                .then(function () {
                    alert('Payment Url copied to clipboard');
                })
                .catch(function (error) {
                    console.error('Failed to copy text: ', error);
                });

            this.toolTipLabel = 'Copied!!';
        },

        getFormattedDate(date) {
            if (date == '0001-01-01T00:00:00Z') {
                return '--';
            }
            return moment(date).format('MMM Do YYYY');
        },

        enableEdit(fieldName) {
            this.editField = fieldName;
        },

        saveField() {
            this.rentValidationError = '';
            this.soChargesValidationError = '';

            if (this.editField === 'Rent Details') {
                const rent = this.currBookingDetails?.Booking?.Rent;
                const soCharges = this.currBookingDetails?.Booking?.BaseAmount;

                if (!rent || rent <= 0) {
                    this.rentValidationError = 'Rent must be greater than zero';
                    this.alertError(
                        'Rent cannot be zero or empty. Please enter a valid rent amount.',
                    );
                    return;
                }

                if (!soCharges || soCharges <= 0) {
                    this.soChargesValidationError =
                        'SO Charges must be greater than zero';
                    this.alertError(
                        'SO Charges cannot be zero or empty. Please enter a valid amount.',
                    );
                    return;
                }

                if (soCharges > rent) {
                    this.soChargesValidationError =
                        'SO Charges cannot be greater than Rent amount';
                    this.alertError(
                        'SO Charges cannot be greater than the Rent amount.',
                    );
                    return;
                }
            }

            const updatedArray = [];
            const initialData = cloneDeep(this.initialActiveBookingDetails);
            delete initialData.Payments;

            for (const key in initialData) {
                if (
                    !this.onCompare(
                        initialData[key],
                        this.currBookingDetails.Booking[key],
                    )
                ) {
                    updatedArray.push(key);
                }
            }

            if (updatedArray.length > 0) {
                this.setUpdatedFields(updatedArray);
                this.$emit(
                    'update-booking-details',
                    this.currBookingDetails.Booking,
                );
            }

            this.editField = null;
        },

        cancelField() {
            this.editField = null;
            this.rentValidationError = '';
            this.soChargesValidationError = '';
            this.currBookingDetails = cloneDeep(this.bookingDetails);
        },

        onStartDateUpdate(updatedDate) {
            this.currBookingDetails.Booking.StartTime = updatedDate;
        },

        onEndDateUpdate(updatedEndDate) {
            this.currBookingDetails.Booking.EndTime = updatedEndDate;
        },
        // Function to compare initial value and current value
        onCompare(initialValue, currentValue) {
            if (Array.isArray(initialValue) && Array.isArray(currentValue)) {
                return (
                    JSON.stringify(initialValue) ===
                    JSON.stringify(currentValue)
                );
            } else {
                return initialValue === currentValue;
            }
        },

        updatePaymentType(value, paymentId) {
            const paymentType = this.paymentTypeLabels.indexOf(value);
            this.changePaymentType({ paymentID: paymentId, paymentType });
        },

        showSuccessMessage() {
            this.$buefy.toast.open({
                message: this.successMessage,
                type: 'is-success',
                duration: 2000,
            });
        },
        openRefundDialog(paymentID, paymentAmount) {
            this.selectedPaymentAmount = paymentAmount;
            this.paymentID = paymentID;
            this.refundDialogVisible = true;
        },
        closeRefundDialog() {
            this.refundDialogVisible = false;
        },
        handleRefundConfirm(refundData) {
            this.refundDialogVisible = false;
            const refundRequest = {
                PaymentID: this.paymentID,
                Amount: parseFloat(refundData.refundAmount),
                IsRefundingSecurity: refundData.isSecurityDeposit,
            };
            this.createRefund(refundRequest);
        },
        alertError(msg) {
            this.$buefy.dialog.alert({
                ariaModal: true,
                ariaRole: 'alertdialog',
                hasIcon: true,
                icon: 'alert-circle',
                message: msg,
                title: 'Error',
                type: 'is-danger',
            });
        },
        alertSuccess(msg) {
            this.$buefy.dialog.alert({
                ariaModal: true,
                ariaRole: 'alertdialog',
                hasIcon: true,
                icon: 'check-circle',
                message: msg,
                title: 'Success',
                type: 'is-success',
            });
        },
        validateRentInput() {
            const rent = this.currBookingDetails?.Booking?.Rent;
            if (!rent || rent <= 0) {
                this.rentValidationError = 'Rent must be greater than zero';
            } else {
                this.rentValidationError = '';
            }
        },
        validateSOChargesInput() {
            const soCharges = this.currBookingDetails?.Booking?.BaseAmount;
            const rent = this.currBookingDetails?.Booking?.Rent;

            if (!soCharges || soCharges <= 0) {
                this.soChargesValidationError =
                    'SO Charges must be greater than zero';
            } else if (rent && soCharges > rent) {
                this.soChargesValidationError =
                    'SO Charges cannot be greater than Rent amount';
            } else {
                this.soChargesValidationError = '';
            }
        },
        getKYCStatusLabel(kycStatus) {
            return getKYCStatusLabel(kycStatus);
        },
    },
};
</script>

<style lang="scss" scoped>
.sub-heading {
    margin-bottom: 24px;
    color: var(--secondary-color);
}

.payment-link-btn-wrapper {
    margin-bottom: 24px;
}

.payment-link-detail-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 20px;
    border: 1px solid #cccccc;
    border-radius: 5px;
    flex-direction: column;
    background: var(--parkspot-white);

    .copy-icon {
        cursor: pointer;
        width: 50px;
        height: 50px;
        background: transparent;

        &:hover {
            border-radius: 50%;
            background: var(--primary-color);
        }
    }
}

.booking-card {
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #cccccc;
    border-radius: 5px;
    background: var(--parkspot-white);

    .card-top {
        position: relative;

        .action-group {
            position: absolute;
            top: 0;
            right: 0;

            span {
                margin-left: 12px;
                cursor: pointer;
            }

            .edit-icon {
                color: var(--secondary-color);
            }

            .save-icon {
                color: var(--parkspot-green);
            }

            .cancel-icon {
                color: var(--parkspot-red);
            }
        }
    }

    .card-body {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        @media only screen and (max-width: 1024px) {
            flex-direction: column;
        }

        .input-field {
            margin-bottom: 6px;
        }
    }

    .col-wrapper {
        display: flex;
        justify-content: space-between;
        width: 50%;

        @media only screen and (max-width: 1024px) {
            width: 100%;
        }
    }

    .field-col {
        width: 30%;
        text-align: left;

        p {
            margin-bottom: 16px;
            min-height: 22px;
            display: flex;
            align-items: center;
        }
    }

    .value-col {
        width: 70%;
        text-align: left;

        p {
            margin-bottom: 16px;
            min-height: 22px;
            display: flex;
            align-items: center;
        }
    }

    .edit-col {
        width: 50%;
        text-align: left;

        p {
            margin-bottom: 16px;
        }

        span {
            margin-left: 12px;
            cursor: pointer;
        }

        .edit-icon {
            color: var(--primary-color);
        }

        .save-icon {
            color: var(--parkspot-green);
        }

        .cancel-icon {
            color: var(--parkspot-red);
        }
    }
}

.payment-history-container {
    .table {
        display: flex;
        flex-direction: column;
    }

    .header {
        background-color: #ebebfb;
    }

    .row {
        display: flex;
    }

    .cell {
        flex: 1;
        padding: 10px;
        border-bottom: 1px solid #eeeeee;
    }

    .status-indicator {
        display: inline-block;
        padding: 5px 10px;
        border-radius: 5px;
        min-width: 108px;
    }

    .status-label {
        font-weight: 500;
        color: var(--parkspot-white);
    }

    /* Define different styles for different status labels */
    .payment-success {
        background-color: #b5fca1;
        min-width: 132px;

        .status-label {
            color: green;
        }
    }

    .payment-failed {
        background-color: #ffa5a5;
        min-width: 132px;

        .status-label {
            color: red;
        }
    }

    .payment-pending {
        background-color: #fce2c3;
        min-width: 132px;

        .status-label {
            color: orange;
        }
    }
}

.refund-icon {
    cursor: pointer;
    height: 28px;
    width: 28px;
}

.update-payment {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.validation-error {
    color: var(--parkspot-red, #ff3860);
    font-size: 12px;
    margin-top: 4px;
    margin-bottom: 8px;
}
.input-field {
    margin-bottom: 6px;

    .is-danger {
        border-color: var(--parkspot-red, #ff3860);
    }
}
.disabled {
    cursor: not-allowed;
    color: var(--parkspot-grey) !important;
    opacity: 0.5;
}

.disabled * {
    fill: var(--parkspot-grey) !important;
}
.field-col p,
.value-col p,
.value-col div {
    min-height: 20px;
}

.kyc-row {
    display: flex;
    align-items: center;
    min-height: 20px;
}

.kyc-status-text {
    font-weight: 600;
    margin-right: 12px;
    line-height: 1.2;
}

.kyc-link {
    text-decoration: none;
}
</style>
