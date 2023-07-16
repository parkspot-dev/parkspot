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
            <h3 class="sub-heading">Booking Details</h3>
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
                            <!-- {{ bookingDetails.Booking.CreatedAt.split('T')[0] }} -->
                            {{
                                getFormattedDate(
                                    bookingDetails.Booking.CreatedAt,
                                )
                            }}
                        </p>
                        <p>
                            <!-- {{ bookingDetails.Booking.StartTime.split('T')[0] }} -->
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
            <h3 class="sub-heading">Rent Details</h3>
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
                        <p>
                            {{ bookingDetails.Booking.Rent }}
                        </p>
                        <p>
                            {{ bookingDetails.Booking.BaseAmount }}
                        </p>
                        <p>
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
                        <p>
                            {{ bookingDetails.Booking.ConvenienceFee }}
                        </p>
                        <p>
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
                <div v-if="bookingDetails.payments">
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
// import BodyWrapper from '../extras/BodyWrapper.vue';
import moment from 'moment';
export default {
    components: { AtomButton, AtomIcon, AtomTooltip },
    name: 'TemplateBookingPortal',
    computed: {
        ...mapState('bookingPortal', ['bookingDetails', 'paymentDetails']),
    },
    data() {
        return {
            toolTipLabel: 'Copy payment url!',
        };
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
            console.log(moment(date).format('MMMM Do YYYY, h:mm:ss a'));
            return moment(date).format('MMMM Do YYYY');
        },
    },
};
</script>

<style lang="scss" scoped>
.sub-heading {
    color: var(--secondary-color);
    margin-bottom: 24px;
}
.payment-link-btn-wrapper {
    margin-bottom: 24px;
}

.payment-link-detail-container {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;

    .copy-icon {
        cursor: pointer;
        width: 50px;
        height: 50px;
        background: transparent;

        &:hover {
            background: var(--primary-color);
            border-radius: 50%;
        }
    }
}

.booking-card {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 20px;

    .card-body {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        @media only screen and (max-width: 1024px) {
            flex-direction: column;
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
}

.payment-history-container {
    .table {
        display: flex;
        flex-direction: column;
    }

    .header {
        background-color: #f5f5fb;
    }

    .row {
        display: flex;
    }

    .cell {
        flex: 1;
        padding: 10px;
        border-bottom: 1px solid #eee;
    }

    .status-indicator {
        display: inline-block;
        padding: 5px 10px;
        border-radius: 5px;
    }

    .status-label {
        color: white;
        font-weight: 500;
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
