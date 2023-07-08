<template>
    <div>
        <!---  Booking details-->
        <atom-heading level="h3" class="sub-heading">
            Booking Details</atom-heading
        >
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
        <atom-heading level="h3" class="sub-heading"> VO Details</atom-heading>
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
                <strong> UserName: </strong
                >{{ bookingDetails.Booking.UserName }}
            </span>

            <span class="column is-3">
                <strong> Email: </strong>{{ bookingDetails.Booking.EmailID }}
            </span>
        </div>
        <hr />
        <!-- rent details-->
        <atom-heading level="h3" class="sub-heading">
            Rent Details</atom-heading
        >
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
                <strong> Priodicity: </strong
                >{{ bookingDetails.Booking.PaymentPeriod }}
            </span>
        </div>
        <hr />
        <!-- Payments-->
        <atom-heading level="h3" class="sub-heading">
            Payment Details</atom-heading
        >
        <div
            v-for="payment in bookingDetails.Payments"
            :key="payment.PaymentID"
        >
            <div class="columns">
                <span class="column is-2">
                    <strong> Payment ID:</strong> {{ payment.PaymentID }}
                </span>
                <span class="column is-2">
                    <strong> Date: </strong
                    >{{ payment.UpdatedAt.split('T')[0] }}
                </span>
                <span class="column is-2">
                    <strong> Amount: </strong>{{ payment.Amount }}
                </span>

                <span class="column is-2">
                    <strong> Status: </strong>{{ payment.Status }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import AtomHeading from '../atoms/AtomHeading.vue';
export default {
    name: 'TemplateBookingPortal',
    components: { AtomHeading },
    computed: {
        ...mapState('bookingPortal', {
            bookingDetails: (state) => state.bookingDetails,
        }),
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
}
</style>
