<template>
    <div class="page-my-booking">
        <h1 class="page-title">My Bookings</h1>

        <div class="booking-layout">
            <!-- Sidebar -->
            <BookingSidebar
                :activebookings="activeBookings"
                :pastbookings="pastBookings"
                :requestbookings="requestedBookings"
                :selectedBooking="selectedBooking"
                @select-booking="onSelectBooking"
                @update-query="onQueryUpdate"
                @tab-change="onTabChange"
            />

            <!-- Detail Empty State -->
            <div class="booking-details-container">
                <BookingDetails
                    v-if="selectedBooking"
                    :booking="selectedBooking"
                />

                <div v-else class="empty-state">
                    <img
                        src="https://www.parkspot.in/assets/about.svg"
                        alt="No bookings"
                    />
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
        ...mapActions('myBookings', ['fetchUsersRequests']),
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

            let list = this.getListForTab(tab);

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
        this.fetchUsersRequests().then(() => {
            this.restoreSelectionFromUrl();
            this.onTabChange(this.activeTab);
        });
    },
};
</script>
<style scoped lang="scss">
.page-my-booking {
    background: #f5f5fb;
    min-height: 100vh;
    padding: 20px;

    .page-title {
        font-size: 24px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 20px;
    }

    .booking-layout {
        display: flex;
        gap: 20px;
        align-items: flex-start;

        > *:first-child {
            width: 320px;
            flex-shrink: 0;
        }

        > *:last-child {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        @media (max-width: 992px) {
            flex-direction: column;
            > *:first-child {
                width: 100%;
            }
        }
    }

    .booking-details-container {
        flex: 1;
        display: flex;
        flex-direction: column;

        .empty-state {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: var(--parkspot-white);
            border-radius: 12px;
            height: 85vh;
            text-align: center;
            padding: 88px;

            img {
                max-width: 300px;
                margin-bottom: 20px;
            }

            .empty-text {
                font-size: 18px;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 8px;
            }

            .empty-subtext {
                font-size: 14px;
                color: #6b7280;
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
                    font-size: 14px;
                }

                .empty-subtext {
                    font-size: 11px;
                }
            }
        }
    }
}
</style>
