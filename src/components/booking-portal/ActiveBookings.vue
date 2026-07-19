<template>
    <div class="root">
        <div class="mobile-search-wrapper">
            <b-field>
                <b-input
                    v-model="mobileSearchQuery"
                    placeholder="Search VO/SO by Name or Mobile"
                    icon="magnify"
                    type="search"
                    clearable
                ></b-input>
            </b-field>
        </div>
        <b-table
            :bordered="true"
            :data="filteredActiveBookings"
            :focusable="true"
            :hoverable="true"
            :mobile-cards="true"
            :narrowed="true"
            :paginated="true"
            :per-page="20"
            :sticky-header="true"
            height="500"
        >
            <b-table-column
                v-slot="props"
                field="ID"
                label="ID"
                numeric
                sortable
                width="56"
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
                v-slot="props"
                cell-class="has-text-left"
                field="Name"
                label="VO Name"
                searchable
                sortable
                width="168"
            >
                <div>
                    {{ props.row.Name }}
                </div>
            </b-table-column>

            <b-table-column
                v-slot="props"
                cell-class="has-text-left"
                field="Mobile"
                label="VO Mobile"
                searchable
                sortable
                width="132"
            >
                <div>
                    {{ props.row.Mobile }}
                </div>
            </b-table-column>

            <b-table-column
                v-slot="props"
                cell-class="has-text-left"
                field="SOContactDetails.FullName"
                label="SO Name"
                searchable
                sortable
                width="112"
            >
                <div>
                    {{ props.row.SOContactDetails.FullName }}
                </div>
            </b-table-column>

            <b-table-column
                v-slot="props"
                cell-class="has-text-left"
                field="SOContactDetails.Mobile"
                label="SO Mobile"
                searchable
                sortable
                width="132"
            >
                <div>
                    {{ props.row.SOContactDetails.Mobile }}
                </div>
            </b-table-column>

            <b-table-column
                v-slot="props"
                cell-class="has-text-left"
                field="SiteID"
                label="SiteID"
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
                v-slot="props"
                cell-class="has-text-left"
                field="Status"
                label="Status"
                sortable
                width="100"
            >
                <div>
                    {{ getBookingStatusLabel(props.row.Status) }}
                </div>
            </b-table-column>

            <b-table-column
                v-slot="props"
                field="Rent"
                label="Rent"
                numeric
                sortable
                width="60"
            >
                <div>
                    {{ props.row.Rent }}
                </div>
            </b-table-column>
            <b-table-column
                v-slot="props"
                cell-class="has-text-left"
                field="PaymentPeriod"
                label="Periodicity"
                sortable
                width="112"
            >
                <div>
                    {{ getPaymentPeriodicityLabel(props.row.PaymentPeriod) }}
                </div>
            </b-table-column>
        </b-table>
    </div>
</template>

<script>
import {
    getPaymentPeriodicityLabel,
    getBookingStatusLabel,
} from '@/constant/enums';
export default {
    props: {
        activeBookings: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            mobileSearchQuery: '',
        };
    },
    computed: {
        filteredActiveBookings() {
            if (!this.mobileSearchQuery) {
                return this.activeBookings;
            }
            const query = this.mobileSearchQuery.toLowerCase().trim();
            return this.activeBookings.filter((booking) => {
                const voName = booking.Name
                    ? String(booking.Name).toLowerCase()
                    : '';
                const voMobile = booking.Mobile
                    ? String(booking.Mobile).toLowerCase()
                    : '';
                const soName =
                    booking.SOContactDetails &&
                    booking.SOContactDetails.FullName
                        ? String(
                              booking.SOContactDetails.FullName,
                          ).toLowerCase()
                        : '';
                const soMobile =
                    booking.SOContactDetails && booking.SOContactDetails.Mobile
                        ? String(booking.SOContactDetails.Mobile).toLowerCase()
                        : '';

                return (
                    voName.includes(query) ||
                    voMobile.includes(query) ||
                    soName.includes(query) ||
                    soMobile.includes(query)
                );
            });
        },
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
        getBookingStatusLabel(bookingStatus) {
            return getBookingStatusLabel(bookingStatus);
        },
    },
};
</script>

<style lang="scss" scoped>
.root {
    padding: 16px;
}
.mobile-search-wrapper {
    display: none;
    margin-bottom: 16px;

    @media screen and (max-width: 1023px) {
        display: block;
    }
}
.header-row {
    justify-content: center;
    text-align: center;
}

@media screen and (max-width: 1023px) {
    .root :deep(.b-table) {
        width: 100% !important;
    }

    .root :deep(.b-table .table-wrapper) {
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: visible !important;
    }

    .root :deep(.b-table .table-wrapper.has-sticky-header) {
        height: auto !important;
        overflow-y: visible !important;
    }

    .root :deep(.b-table .table.has-mobile-cards) {
        width: 100% !important;
        margin: 0 !important;
    }

    .root :deep(.b-table .table.has-mobile-cards td) {
        width: 100% !important;
        word-break: break-all;
    }

    .root :deep(.table-mobile-sort) {
        display: none !important;
    }
}
</style>
