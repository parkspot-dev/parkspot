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
                            {{ bookingDetails.Booking.CreatedAt.split('T')[0] }}
                        </p>
                        <p>
                            {{ bookingDetails.Booking.StartTime.split('T')[0] }}
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
                <div
                    v-for="payment in bookingDetails.Payments"
                    :key="payment.PaymentID"
                    class="row"
                >
                    <div class="cell">{{ payment.PaymentID }}</div>
                    <div class="cell">
                        {{ payment.UpdatedAt.split('T')[0] }}
                    </div>
                    <div
                        class="cell"
                        v-bind:class="getPaymentClass(payment.Status)"
                    >
                        {{ getPaymentStatusLabel(payment.Status) }}
                    </div>
                    <div class="cell">{{ payment.Amount }}</div>
                </div>
            </div>
            <!-- <div
                v-for="payment in bookingDetails.Payments"
                :key="payment.PaymentID"
            >
                <div class="columns">
                    <div class="column is-2">
                        <strong> Payment ID:</strong> {{ payment.PaymentID }}
                    </div>
                    <div class="column is-2">
                        <strong> Date: </strong>
                        {{ payment.UpdatedAt.split('T')[0] }}
                    </div>
                    <div class="column is-2">
                        <strong> Amount: </strong>{{ payment.Amount }}
                    </div>

                    <div class="column is-2">
                        <strong> Status: </strong>
                        <div v-bind:class="getPaymentClass(payment.Status)">
                            {{ getPaymentStatusLabel(payment.Status) }}
                        </div>
                    </div>
                </div>
            </div> -->
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
    },
};
</script>

<style lang="scss" scoped>
.columns {
    margin-top: 4px;
}

.column {
    display: flex;
    flex-direction: column;
}

.sub-heading {
    color: var(--secondary-color);
    margin-bottom: 24px;
}

.payment-success {
    border-color: #78d965;
    color: #78d965;
    box-shadow: 0px 0px 4px 1px #94e185;
    border-style: solid;
    font-weight: 500;
}

.payment-pending {
    border-color: #ffb161;
    color: #ffb161;
    box-shadow: 0px 0px 4px 1px #ffc182;
    border-style: solid;
    font-weight: 500;
}

.payment-failed {
    border-color: #c42c3b;
    color: #c42c3b;
    box-shadow: 0px 0px 4px 1px #c9404d;
    border-style: solid;
    font-weight: 500;
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
    }

    .row {
        display: flex;
    }

    .cell {
        flex: 1;
        padding: 10px;
        border-bottom: 1px solid #ccc;
    }
}
</style>
