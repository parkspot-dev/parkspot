<template>
    <div class="page-my-bookings">
        <h1 class="page-title">My Bookings</h1>

        <div class="booking-layout">
            <!-- Sidebar -->
            <BookingSidebar
                :activebookings="activeBookings"
                :pastbookings="pastBookings"
                :requestbookings="requestedBookings"
                :selected-booking="selectedBooking"
                @select-booking="onSelectBooking"
                @update-query="onQueryUpdate"
                @tab-change="onTabChange"
            />

            <!-- Detail Empty State -->
            <div class="booking-details-container">
                <BookingDetails
                    v-if="selectedBooking"
                    :booking="selectedBooking"
                    :active-tab="activeTab"
                />

                <div v-else class="empty-state">
                    <img src="/public/assets/about.svg" alt="No bookings" />
                    <p class="empty-text">{{ emptyTabTitle }}</p>
                    <p class="empty-subtext">{{ emptyTabSubtitle }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BookingSidebar from '@/components/my-bookings/BookingSidebar.vue';
import BookingDetails from '@/components/my-bookings/BookingDetails.vue';
import { mapActions, mapState } from 'vuex';

export default {
    name: 'PageMyBooking',
    components: { BookingSidebar, BookingDetails },

    data() {
        return {
            selectedBooking: null,
            activeTab: 'Active',
            emptyTabTitle: '',
            emptyTabSubtitle: '',
        };
    },

    computed: {
        ...mapState('myBookings', [
            'isLoading',
            'hasError',
            'errorMessage',
            'activeBookings',
            'pastBookings',
            'requestedBookings',
        ]),
    },

    methods: {
        ...mapActions('myBookings', ['fetchUserBookings']),
        onSelectBooking(booking) {
            this.selectedBooking = booking;
            this.emptyTabTitle = '';
            this.emptyTabSubtitle = '';
        },

        onTabChange(tab) {
            this.activeTab = tab;
            const list = this.getListForTab(tab);
            if (!list || list.length === 0) {
                this.selectedBooking = null;
                this.setEmptyMessage(tab);
            } else {
                this.selectedBooking = list[0];
                this.emptyTabTitle = '';
                this.emptyTabSubtitle = '';
            }
        },

        getListForTab(tab) {
            if (tab === 'Active') return this.activeBookings;
            if (tab === 'Past') return this.pastBookings;
            if (tab === 'Request') return this.requestedBookings;
            return [];
        },

        setEmptyMessage(tab) {
            if (tab === 'Active') {
                this.emptyTabTitle =
                    'Oops! You don’t have any active bookings.';
                this.emptyTabSubtitle =
                    'Start exploring spots and reserve your parking now!';
            } else if (tab === 'Past') {
                this.emptyTabTitle = 'No past bookings found.';
                this.emptyTabSubtitle =
                    'Book parking to see your history here.';
            } else if (tab === 'Request') {
                this.emptyTabTitle = 'No booking requests submitted.';
                this.emptyTabSubtitle =
                    'Submit a request to reserve your parking spot.';
            }
        },

        onQueryUpdate(query) {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', query.tab);

            if (query.bookingId)
                url.searchParams.set('bookingId', query.bookingId);
            else url.searchParams.delete('bookingId');

            window.history.replaceState({}, '', url.toString());
        },

        restoreSelectionFromUrl() {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get('tab') || 'Active';
            const bookingId = params.get('bookingId');

            const list = this.getListForTab(tab);

            if (!list || list.length === 0) {
                this.selectedBooking = null;
                return;
            }

            const booking =
                list.find((b) => b.BookingID == bookingId) || list[0];
            this.selectedBooking = booking;
        },
    },

    mounted() {
        this.fetchUserBookings().then(() => {
            this.restoreSelectionFromUrl();
            this.onTabChange(this.activeTab);
        });
    },
};
</script>
<style scoped lang="scss">
.page-my-bookings {
    background: #f5f5fb;
    min-height: 100vh;
    padding: 20px;

    .page-title {
        font-size: 24px;
        font-weight: 700;
        color: var(--parkspot-black);
        margin-bottom: 20px;
    }

    .booking-layout {
        align-items: flex-start;
        display: flex;
        gap: 20px;

        > *:first-child {
            flex-shrink: 0;
            width: 320px;
        }

        > *:last-child {
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        @media (max-width: 992px) {
            flex-direction: column;
            > *:first-child {
                width: 100%;
            }
        }
    }

    .booking-details-container {
        display: flex;
        flex-direction: column;
        flex: 1;

        .empty-state {
            align-items: center;
            background: var(--parkspot-white);
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            flex: 1;
            height: 85vh;
            justify-content: center;
            padding: 88px;
            text-align: center;

            img {
                margin-bottom: 20px;
                max-width: 300px;
            }

            .empty-text {
                color: #1e293b;
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 8px;
            }

            .empty-subtext {
                color: var(--grey-shade);
                font-size: 14px;
            }
            @media (max-width: 992px) {
                height: 70vh;
                padding: 40px;

                img {
                    max-width: 200px;
                }

                .empty-text {
                    font-size: 16px;
                }

                .empty-subtext {
                    font-size: 12px;
                }
            }

            @media (max-width: 576px) {
                height: 60vh;
                padding: 24px;

                img {
                    max-width: 150px;
                }

                .empty-text {
                    font-size: 12px;
                }

                .empty-subtext {
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
