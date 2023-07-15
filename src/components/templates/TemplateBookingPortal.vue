<template>
    <div>
        <!-- payment link button -->
        <div class="payment-link-btn-wrapper">
            <AtomButton @click.native="onClick">
                Generate Payment Link
            </AtomButton>
        </div>
        <div class="payment-detail-container" v-if="paymentDetails">
            {{ paymentDetails }}
        </div>
        <!---  Booking details-->
        <div class="booking-card">
            <h3 class="sub-heading">Booking Details</h3>
            <div class="card-body">
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

                <span class="field-col">
                    <p>
                        <strong> Created At:</strong>
                    </p>

                    <p>
                        <strong> Started At:</strong>
                    </p>
                </span>
                <span class="value-col">
                    <p>
                        {{ bookingDetails.Booking.CreatedAt.split('T')[0] }}
                    </p>
                    <p>
                        {{ bookingDetails.Booking.StartTime.split('T')[0] }}
                    </p>
                </span>
            </div>
        </div>
        <!-- VO details-->
        <div class="booking-card">
            <h3 class="sub-heading">VO Details</h3>
            <div class="card-body">
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

        <!-- rent details-->
        <div class="booking-card">
            <h3 class="sub-heading">Rent Details</h3>
            <div class="card-body">
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
        <hr />
        <!-- Payments-->
        <h3 class="sub-heading">Payment Details</h3>
        <div
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
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { PaymentStatus, getPaymentStatusLabel } from '@/constant/enums';
import AtomButton from '../atoms/AtomButton.vue';
export default {
    components: { AtomButton },
    name: 'TemplateBookingPortal',
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
            const reqBody = {
                BookingID: this.bookingDetails.Booking.ID.toString(),
                Discount: 0.0,
                Promocode: '',
            };

            this.$emit('payment-link', reqBody);
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
.booking-card {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 20px;

    .card-body {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
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
</style>
