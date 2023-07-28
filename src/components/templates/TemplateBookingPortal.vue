<template>
    <section>
        <!-- payment link button -->
        <div class="payment-link-btn-wrapper">
            <AtomButton @click.native="onClick">
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
                            :icon="'file-edit-outline'"
                        >
                        </AtomIcon>
                    </span>
                    <span class="save-icon">
                        <AtomIcon
                            @click.native="saveField"
                            :icon="'content-save-outline'"
                        >
                        </AtomIcon>
                    </span>
                    <span class="cancel-icon">
                        <AtomIcon @click.native="cancelField" :icon="'close'">
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
                    </div>
                    <div class="value-col">
                        <p>
                            {{ bookingDetails.Booking.ID }}
                        </p>
                        <p>
                            {{ bookingDetails.Booking.SiteID }}
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
                    </div>
                    <div class="value-col">
                        <p>
                            {{
                                getFormattedDate(
                                    bookingDetails.Booking.CreatedAt,
                                )
                            }}
                        </p>
                        <div
                            class="input-field"
                            v-if="editField === 'Booking Details'"
                        >
                            <AtomDatePicker
                                :size="'is-small'"
                                class="column-width"
                                @changed="onStartDateUpdate"
                            >
                            </AtomDatePicker>
                        </div>
                        <p v-else>
                            {{
                                getFormattedDate(
                                    bookingDetails.Booking.StartTime,
                                )
                            }}
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
                            {{ bookingDetails.Booking.UserName }}
                        </p>
                        <p>
                            {{ bookingDetails.Booking.Name }}
                        </p>
                        <p>
                            {{ bookingDetails.Booking.Mobile }}
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
                            {{ bookingDetails.Booking.VehicleNumber }}
                        </p>
                        <p>
                            {{ bookingDetails.Booking.EmailID }}
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
                            :icon="'file-edit-outline'"
                        >
                        </AtomIcon>
                    </span>
                    <span class="save-icon">
                        <AtomIcon
                            @click.native="saveField"
                            :icon="'content-save-outline'"
                        >
                        </AtomIcon>
                    </span>
                    <span class="cancel-icon">
                        <AtomIcon @click.native="cancelField" :icon="'close'">
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
                                :value="bookingDetails.Booking.Rent"
                                @input="onRentUpdate"
                            ></AtomInput>
                        </div>
                        <p v-else>
                            {{ bookingDetails.Booking.Rent }}
                        </p>
                        <div
                            class="input-field"
                            v-if="editField === 'Rent Details'"
                        >
                            <AtomInput
                                :size="'is-small'"
                                :value="bookingDetails.Booking.BaseAmount"
                                @input="onBaseAmtUpdate"
                            ></AtomInput>
                        </div>
                        <p v-else>
                            {{ bookingDetails.Booking.BaseAmount }}
                        </p>
                        <div
                            class="input-field"
                            v-if="editField === 'Rent Details'"
                        >
                            <AtomInput
                                :size="'is-small'"
                                :value="bookingDetails.Booking.PaymentPeriod"
                                @input="onPeriodicityUpdate"
                            ></AtomInput>
                        </div>
                        <p v-else>
                            {{ bookingDetails.Booking.PaymentPeriod }}
                        </p>
                    </div>
                </div>
                <div class="col-wrapper">
                    <div class="field-col">
                        <p>
                            <strong> ConvenienceFee: </strong>
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
                                :value="bookingDetails.Booking.ConvenienceFee"
                                @input="onConvFeeUpdate"
                            ></AtomInput>
                        </div>
                        <p v-else>
                            {{ bookingDetails.Booking.ConvenienceFee }}
                        </p>
                        <div
                            class="input-field"
                            v-if="editField === 'Rent Details'"
                        >
                            <AtomInput
                                :size="'is-small'"
                                :value="bookingDetails.Booking.RentCycle"
                                @input="onRentCycleUpdate"
                            ></AtomInput>
                        </div>
                        <p v-else>
                            {{ bookingDetails.Booking.RentCycle }}
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
                <div v-if="bookingDetails.Payments">
                    <div
                        v-for="payment in bookingDetails.Payments"
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
import { PaymentStatus, getPaymentStatusLabel } from '@/constant/enums';
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
            startDate: '',
            rent: '',
            convFee: '',
            baseAmt: '',
            rentCycle: '',
            periodicity: '',
        };
    },

    computed: {
        ...mapState('bookingPortal', ['bookingDetails', 'paymentDetails']),
    },

    methods: {
        getPaymentStatusLabel(paymentStatus) {
            return getPaymentStatusLabel(paymentStatus);
        },

        getPaymentClass(status) {
            if (status == PaymentStatus.PaymentSuccess) {
                return 'payment-success';
            } else if (
                status == PaymentStatus.PaymentPending ||
                status == PaymentStatus.PaymentIncomplete
            ) {
                return 'payment-pending';
            }
            return 'payment-failed';
        },

        onClick() {
            this.toolTipLabel = 'Copy payment url!';
            const reqBody = {
                BookingID: this.bookingDetails.Booking.ID.toString(),
                Discount: 0.0,
                Promocode: '',
            };

            this.$emit('payment-link', reqBody);
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
            console.log('edit', fieldName);
            this.editField = fieldName;
        },

        saveField() {
            this.editField = null;
            const reqBody = {
                ID: this.bookingDetails.Booking.ID,
                // Status: 3,
                Rent: this.rent ? Number(this.rent) : this.bookingDetails.rent,
                BaseAmount: this.baseAmt
                    ? Number(this.baseAmt)
                    : this.bookingDetails.BaseAmount,
                ConvenienceFee: this.convFee
                    ? Number(this.convFee)
                    : this.bookingDetails.ConvenienceFee,
                RentCycle: this.rentCycle
                    ? Number(this.rentCycle)
                    : this.bookingDetails.RentCycle,
                StartTime: this.startDate
                    ? this.startDate
                    : this.bookingDetails.StartTime, // 2023-06-04T00:00:00.000Z
            };

            this.$emit('update-booking-details', reqBody);
        },

        cancelField() {
            this.editField = null;
        },

        onStartDateUpdate(updatedDate) {
            this.startDate = updatedDate;
        },

        onRentUpdate(updatedRent) {
            this.rent = updatedRent;
        },

        onBaseAmtUpdate(updatedBaseAmt) {
            this.baseAmt = updatedBaseAmt;
        },

        onPeriodicityUpdate(updatedPeriodicity) {
            this.periodicity = updatedPeriodicity;
        },

        onConvFeeUpdate(updatedConvFee) {
            this.convFee = updatedConvFee;
        },

        onRentCycleUpdate(updatedRentCycle) {
            this.rentCycle = updatedRentCycle;
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
        width: 50%;
        text-align: left;

        p {
            margin-bottom: 16px;
        }
    }
    .value-col {
        width: 50%;
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
    }

    .status-label {
        font-weight: 500;
        color: var(--parkspot-white);
    }

    /* Define different styles for different status labels */
    .payment-success {
        background-color: #b5fca1;

        .status-label {
            color: green;
        }
    }

    .payment-failed {
        background-color: #ffa5a5;
        .status-label {
            color: red;
        }
    }

    .payment-pending {
        background-color: #fce2c3;
        .status-label {
            color: orange;
        }
    }
}
</style>
