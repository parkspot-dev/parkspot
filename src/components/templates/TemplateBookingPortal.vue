<template>
    <div>
        <!---  Booking details-->
        <h3 class="sub-heading">Booking Details</h3>
        <div class="columns">
            <span class="column is-2">
                <strong> Booking ID: </strong> {{ bookingDetails.Booking.ID }}
            </span>

            <span class="column is-2">
                <strong> Site ID:</strong> {{ bookingDetails.Booking.SiteID }}
            </span>

            <span class="column is-2">
                <strong> Created At:</strong>
                {{ bookingDetails.Booking.CreatedAt.split('T')[0] }}
            </span>

            <span class="column is-2">
                <strong> Started At:</strong>
                {{ bookingDetails.Booking.StartTime.split('T')[0] }}
            </span>
        </div>
        <hr />
        <!-- VO details-->
        <h3 class="sub-heading">VO Details</h3>
        <div class="columns">
            <span class="column is-2">
                <strong> Full Name: </strong>
                {{ bookingDetails.Booking.Name }}
            </span>

            <span class="column is-2">
                <strong> Mobile: </strong>{{ bookingDetails.Booking.Mobile }}
            </span>

            <span class="column is-2">
                <strong> Vehicle Number:</strong>
                {{ bookingDetails.Booking.VehicleNumber }}
            </span>

            <span class="column is-3">
                <strong> UserName: </strong>
                {{ bookingDetails.Booking.UserName }}
            </span>

            <span class="column is-3">
                <strong> Email: </strong>{{ bookingDetails.Booking.EmailID }}
            </span>
        </div>
        <hr />
        <!-- rent details-->
        <h3 class="sub-heading">Rent Details</h3>
        <div class="columns">
            <span class="column is-2">
                <strong> Rent: </strong>{{ bookingDetails.Booking.Rent }}
            </span>

            <span class="column is-2">
                <strong> Base Amount: </strong>
                {{ bookingDetails.Booking.BaseAmount }}
            </span>

            <span class="column is-2">
                <strong> ConvenienceFee: </strong
                >{{ bookingDetails.Booking.ConvenienceFee }}
            </span>

            <span class="column is-2">
                <strong> Rent Cycle: </strong>
                {{ bookingDetails.Booking.RentCycle }}
            </span>

            <span class="column is-2">
                <strong> Priodicity: </strong>
                {{ bookingDetails.Booking.PaymentPeriod }}
            </span>
        </div>
        <hr />
        <!-- Payments-->
        <h3 class="sub-heading">Payment Details</h3>
        <div
            v-for="payment in bookingDetails.Payments"
            :key="payment.PaymentID"
        >
            <div class="columns">
                <span class="column is-2">
                    <strong> Payment ID:</strong> {{ payment.PaymentID }}
                </span>
                <span class="column is-2">
                    <strong> Date: </strong>
                    {{ payment.UpdatedAt.split('T')[0] }}
                </span>
                <span class="column is-2">
                    <strong> Amount: </strong>{{ payment.Amount }}
                </span>

                <span class="column is-2">
                    <strong> Status: </strong>
                    <span v-bind:class="getPaymentClass(payment.Status)"
                        >{{ getPaymentStatusLabel(payment.Status) }}
                    </span>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { PaymentStatus, getPaymentStatusLabel } from '@/constant/enums';
export default {
    name: 'TemplateBookingPortal',
    computed: {
        ...mapState('bookingPortal', {
            bookingDetails: (state) => state.bookingDetails,
        }),
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
    },
};
</script>

<style>
.columns {
    margin-top: 4px;
}

.column {
    display: flex;
    flex-direction: column;
}

.sub-heading {
    color: var(--secondary-color);
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
</style>
