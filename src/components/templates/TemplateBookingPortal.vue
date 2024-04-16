<template>
    <section>
        <!-- payment link button -->
        <div class="payment-link-btn-wrapper">
            <AtomButton @click.native="getPaymentLink">
                Generate Payment Link
            </AtomButton>
        </div>
        <div class="payment-link-detail-container" v-if="paymentDetails">
            <p>
                {{ paymentDetails.PayUrl }}
            </p>
            <AtomTooltip :label="toolTipLabel">
                <AtomIcon
                    class="copy-icon"
                    :icon="'content-copy'"
                    @click.native="copyUrl"
                ></AtomIcon>
            </AtomTooltip>
        </div>
        <!---  Booking details-->
        <div class="booking-card">
            <div class="card-top">
                <h3 class="sub-heading">Booking Details</h3>
                <div class="action-group">
                    <span class="edit-icon">
                        <AtomIcon
                            @click.native="enableEdit('Booking Details')"
                            :icon="'pencil'"
                            size=""
                        >
                        </AtomIcon>
                    </span>
                    <span class="save-icon">
                        <AtomIcon
                            @click.native="saveField"
                            :icon="'content-save-outline'"
                            size=""
                        >
                        </AtomIcon>
                    </span>
                    <span class="cancel-icon">
                        <AtomIcon
                            @click.native="cancelField"
                            :icon="'close'"
                            size=""
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
                            class="input-field"
                            v-if="editField === 'Booking Details'"
                        >
                            <AtomInput
                                :size="'is-small'"
                                type="text"
                                v-model="currBookingDetails.Booking.Remark"
                            ></AtomInput>
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
                            class="input-field"
                            v-if="editField === 'Booking Details'"
                        >
                            <AtomDatePicker
                                :size="'is-small'"
                                :assignedDate="
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
                            class="input-field"
                            v-if="editField === 'Booking Details'"
                        >
                            <AtomDatePicker
                                :size="'is-small'"
                                :assignedDate="
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
                    </div>
                </div>
            </div>
        </div>

        <!-- rent details-->
        <div class="booking-card">
            <div class="card-top">
                <h3 class="sub-heading">Rent Details</h3>
                <div class="action-group">
                    <span class="edit-icon">
                        <AtomIcon
                            @click.native="enableEdit('Rent Details')"
                            :icon="'pencil'"
                            size=""
                        >
                        </AtomIcon>
                    </span>
                    <span class="save-icon">
                        <AtomIcon
                            @click.native="saveField"
                            :icon="'content-save-outline'"
                            size=""
                        >
                        </AtomIcon>
                    </span>
                    <span class="cancel-icon">
                        <AtomIcon
                            @click.native="cancelField"
                            :icon="'close'"
                            size=""
                        >
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
                            <strong> Base Amount: </strong>
                        </p>
                        <p><strong> Priodicity: </strong></p>
                    </div>
                    <div class="value-col">
                        <div
                            class="input-field"
                            v-if="editField === 'Rent Details'"
                        >
                            <AtomInput
                                :size="'is-small'"
                                type="number"
                                v-model.number="currBookingDetails.Booking.Rent"
                            ></AtomInput>
                        </div>
                        <p v-else>
                            {{ currBookingDetails.Booking.Rent }}
                        </p>
                        <div
                            class="input-field"
                            v-if="editField === 'Rent Details'"
                        >
                            <AtomInput
                                :size="'is-small'"
                                type="number"
                                v-model.number="
                                    currBookingDetails.Booking.BaseAmount
                                "
                            ></AtomInput>
                        </div>
                        <p v-else>
                            {{ currBookingDetails.Booking.BaseAmount }}
                        </p>
                        <div
                            class="input-field"
                            v-if="editField === 'Rent Details'"
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
                            class="input-field"
                            v-if="editField === 'Rent Details'"
                        >
                            <AtomInput
                                :size="'is-small'"
                                type="number"
                                v-model.number="
                                    currBookingDetails.Booking.ConvenienceFee
                                "
                            ></AtomInput>
                        </div>
                        <p v-else>
                            {{ currBookingDetails.Booking.ConvenienceFee }}
                        </p>
                        <div
                            class="input-field"
                            v-if="editField === 'Rent Details'"
                        >
                            <AtomInput
                                :size="'is-small'"
                                type="number"
                                v-model.number="
                                    currBookingDetails.Booking.SecurityDeposit
                                "
                            ></AtomInput>
                        </div>
                        <p v-else>
                            {{ currBookingDetails.Booking.SecurityDeposit }}
                        </p>
                        <div
                            class="input-field"
                            v-if="editField === 'Rent Details'"
                        >
                            <AtomInput
                                :size="'is-small'"
                                type="number"
                                v-model.number="
                                    currBookingDetails.Booking.RentCycle
                                "
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
                            {{ currBookingDetails.Booking.Mobile }}
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
                    </div>
                    <div class="value-col">
                        <p>
                            {{ currBookingDetails.Booking.VehicleNumber }}
                        </p>
                        <p>
                            {{ currBookingDetails.Booking.EmailID }}
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
                    <div class="cell"><strong> Date </strong></div>
                    <div class="cell"><strong> Status </strong></div>
                    <div class="cell"><strong> Amount </strong></div>
                </div>
                <div v-if="currBookingDetails.Payments">
                    <div
                        v-for="payment in currBookingDetails.Payments"
                        :key="payment.PaymentID"
                        class="row"
                    >
                        <div class="cell">{{ payment.PaymentID }}</div>
                        <div class="cell">
                            {{ getFormattedDate(payment.UpdatedAt) }}
                        </div>
                        <div class="cell">
                            <div
                                class="status-indicator"
                                v-bind:class="getPaymentClass(payment.Status)"
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
                                    @click.native="
                                        refreshPaymentStatus(payment.PaymentID)
                                    "
                                >
                                </AtomIcon>
                            </div>
                        </div>
                        <div class="cell">₹ {{ payment.Amount }}</div>
                    </div>
                </div>
                <div v-else>No payment history found.</div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapState } from 'vuex';
import {
    PaymentStatus,
    getPaymentStatusLabel,
    getBookingStatusLabel,
    getPaymentPeriodicityLabel,
    BookingStatusLabels,
    PaymentPeriodicityLabels,
} from '@/constant/enums';
import AtomButton from '../atoms/AtomButton.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
import AtomTooltip from '../atoms/AtomTooltip.vue';
import AtomDatePicker from '../atoms/AtomDatePicker.vue';
import AtomInput from '../atoms/AtomInput.vue';
import moment from 'moment';

export default {
    name: 'TemplateBookingPortal',
    components: {
        AtomButton,
        AtomIcon,
        AtomTooltip,
        AtomDatePicker,
        AtomInput,
    },

    data() {
        return {
            toolTipLabel: 'Copy payment url!',
            editField: null,
            currBookingDetails: null,
            bookingStatusLabels: BookingStatusLabels,
            paymentPeriodicityLabels: PaymentPeriodicityLabels,
        };
    },
    beforeMount() {
        this.currBookingDetails = structuredClone(this.bookingDetails); // make a local copy of bookingDetails
    },
    watch: {
        '$store.state.bookingPortal.bookingDetails'(val) {
            this.currBookingDetails = structuredClone(val); // make a local copy of bookingDetails
        },
    },
    computed: {
        ...mapState('bookingPortal', ['bookingDetails', 'paymentDetails']),
        sdpURL() {
            return this.$router.resolve({
                name: 'spot-detail',
                params: {
                    spotId: this.currBookingDetails.Booking.SiteID,
                },
            }).href;
        },
    },

    methods: {
        getPaymentStatusLabel(paymentStatus) {
            return getPaymentStatusLabel(paymentStatus);
        },
        getPaymentPeriodicityLabel(paymentPeriodicity) {
            return getPaymentPeriodicityLabel(paymentPeriodicity);
        },
        getBookingStatusLabel(bookingStatus) {
            return getBookingStatusLabel(bookingStatus);
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
            return moment(date).format('MMMM Do YYYY, hh:mm A');
        },

        enableEdit(fieldName) {
            this.editField = fieldName;
        },

        saveField() {
            this.editField = null;
            this.$emit(
                'update-booking-details',
                this.currBookingDetails.Booking,
            );
        },

        cancelField() {
            this.editField = null;
            this.currBookingDetails = structuredClone(this.bookingDetails);
        },

        onStartDateUpdate(updatedDate) {
            this.currBookingDetails.Booking.StartTime = updatedDate;
        },

        onEndDateUpdate(updatedEndDate) {
            this.currBookingDetails.Booking.EndTime = updatedEndDate;
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
        }
    }
    .value-col {
        width: 70%;
        text-align: left;

        p {
            margin-bottom: 16px;
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
</style>
