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
                <strong> UserName: </strong
                >{{ bookingDetails.Booking.UserName }}
            </span>

            <span class="column is-2">
                <strong> Full Name: </strong>
                {{ bookingDetails.Booking.Name }}
            </span>

            <span class="column is-2">
                <strong> Mobile: </strong>{{ bookingDetails.Booking.Mobile }}
            </span>

            <span class="column is-2">
                <strong> Email: </strong>{{ bookingDetails.Booking.EmailID }}
            </span>

            <span class="column is-2">
                <strong> Vehicle Number:</strong>
                {{ bookingDetails.Booking.VehicleNumber }}
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
import AtomHeading from '../atoms/AtomHeading.vue';
export default {
    name: 'TemplateBookingPortal',
    components: { AtomHeading },
    props: {
        // todo: this will come from store.
        bookingDetails: {
            type: Object,
            default() {
                return {
                    Booking: {
                        ID: 1578,
                        CreatedAt: '2023-02-25T08:24:04.5662536Z',
                        UpdatedAt: '2023-05-25T23:04:42.532919+05:30',
                        DeletedAt: null,
                        UserName: 'parkspot',
                        Name: 'Prasanth Raghu Vamsi M',
                        Mobile: '9397111995',
                        EmailID: '',
                        VehicleNumber: 'AP39RD1995',
                        SiteID: 'BLR#JPNagar#SMRCrystal',
                        Site: null,
                        SlotID: '',
                        StartTime: '2022-05-01T00:00:00+05:30',
                        EndTime: '2023-04-30T23:59:00+05:30',
                        Status: 1,
                        Rent: 2300,
                        BaseAmount: 1800,
                        ConvenienceFee: 500,
                        RentCycle: 27,
                        PaymentPeriod: 0,
                    },
                    Payments: [
                        {
                            PaymentID: 756,
                            BookingID: 1578,
                            TransactionID: '',
                            Amount: 3000,
                            Discount: 300,
                            Cashback: 0,
                            Promocode: '',
                            Mode: 6,
                            Status: 1,
                            Booking: null,
                            CreatedAt: '2023-02-25T08:26:00.5131359Z',
                            UpdatedAt: '0001-01-01T00:00:00Z',
                        },
                        {
                            PaymentID: 757,
                            BookingID: 1578,
                            TransactionID: '',
                            Amount: 3000,
                            Discount: 0,
                            Cashback: 0,
                            Promocode: '',
                            Mode: 6,
                            Status: 1,
                            Booking: null,
                            CreatedAt: '2023-02-25T08:26:31.3479901Z',
                            UpdatedAt: '0001-01-01T00:00:00Z',
                        },
                    ],
                };
            },
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
</style>
