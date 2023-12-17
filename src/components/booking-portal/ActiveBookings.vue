<template>
    <div class="root">
        <b-table
            :paginated="true"
            :per-page="20"
            :data="activeBookings"
            :bordered="true"
            :hoverable="true"
            :focusable="true"
            :mobile-cards="true"
            :narrowed="true"
            :sticky-header="true"
            height="500"
        >
            <b-table-column
                field="ID"
                label="ID"
                width="40"
                numeric
                v-slot="props"
                sortable
            >
                <div>
                    <a :href="bookingDetailsURL(props.row.ID)">
                        <div>
                            {{ props.row.ID }}
                        </div>
                    </a>
                </div>
            </b-table-column>

            <b-table-column
                cell-class="has-text-left"
                field="Name"
                label="VO Name"
                width="40"
                v-slot="props"
                sortable
            >
                <div>
                    {{ props.row.Name }}
                </div>
            </b-table-column>

            <b-table-column
                cell-class="has-text-left"
                field="SiteID"
                label="SiteID"
                width="40"
                v-slot="props"
                sortable
            >
                <div>
                    <a :href="sdpURL(props.row.SiteID)" target="_blank">
                        <div>
                            {{ props.row.SiteID }}
                        </div>
                    </a>
                </div>
            </b-table-column>

            <b-table-column
                field="Rent"
                label="Rent"
                width="40"
                numeric
                v-slot="props"
                sortable
            >
                <div>
                    {{ props.row.Rent }}
                </div>
            </b-table-column>
            <b-table-column
                cell-class="has-text-left"
                field="PaymentPeriod"
                label="Periodicity"
                width="40"
                v-slot="props"
                sortable
            >
                <div>
                    {{ getPaymentPeriodicityLabel(props.row.PaymentPeriod) }}
                </div>
            </b-table-column>
        </b-table>
    </div>
</template>

<script>
import { getPaymentPeriodicityLabel } from '@/constant/enums';
export default {
    props: {
        activeBookings: Array,
    },
    methods: {
        sdpURL(siteId) {
            return this.$router.resolve({
                name: 'spot-detail',
                params: {
                    spotId: siteId,
                },
            }).href;
        },
        bookingDetailsURL(bookingId) {
            return this.$router.resolve({
                name: 'booking-portal',
                query: {
                    bookingId: bookingId,
                },
            }).href;
        },
        getPaymentPeriodicityLabel(paymentPeriodicity) {
            return getPaymentPeriodicityLabel(paymentPeriodicity);
        },
    },
};
</script>

<style lang="scss">
.root {
    padding: 16px;
}
.header-row {
    justify-content: center;
    text-align: center;
}
</style>
