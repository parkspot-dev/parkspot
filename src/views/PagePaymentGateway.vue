<template>
    <div class="custom-bg">
        <div class="bg-decor"></div>

        <TemplatePaymentGateway
            :booking-details="bookingDetails"
            :payment-mode="paymentMode"
            :status="status"
        >
        </TemplatePaymentGateway>
    </div>
</template>
<script>
import TemplatePaymentGateway from '../components/templates/TemplatePaymentGateway.vue';
import { PAGE_TITLE } from '@/constant/constant';
import { PaymentType } from '@/constant/enums';
import { track, EVENTS } from '@/lib/analytics';

// Phase 2.5 booking funnel: dedup `purchase` events on `transaction_id`.
// Cashfree retries, browser back-button revisits, and any client-side
// double-fire all hit the same `?p=` parameter — a sessionStorage set
// keyed on it keeps the conversion stream clean. SSR-safe try/catch
// because Safari ITP / private mode can throw on storage access.
const FIRED_PURCHASES_KEY = 'parkspot_fired_purchases';

function readFiredPurchases() {
    if (typeof window === 'undefined') return new Set();
    try {
        const raw = window.sessionStorage.getItem(FIRED_PURCHASES_KEY);
        if (!raw) return new Set();
        const parsed = JSON.parse(raw);
        return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
        return new Set();
    }
}

function writeFiredPurchases(set) {
    if (typeof window === 'undefined') return;
    try {
        window.sessionStorage.setItem(
            FIRED_PURCHASES_KEY,
            JSON.stringify(Array.from(set)),
        );
    } catch {
        // Non-fatal — dedup is defense, not a guarantee.
    }
}

function markPurchaseFired(transactionId) {
    if (!transactionId) return false;
    const set = readFiredPurchases();
    if (set.has(transactionId)) return false;
    set.add(transactionId);
    writeFiredPurchases(set);
    return true;
}

function normalizeE164(raw) {
    if (!raw) return '';
    const trimmed = String(raw).trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('+')) return trimmed.replace(/\s+/g, '');
    const digits = trimmed.replace(/\D+/g, '');
    if (!digits) return '';
    if (digits.startsWith('91') && digits.length > 10) return `+${digits}`;
    const local = digits.replace(/^0+/, '');
    return `+91${local}`;
}

export default {
    name: 'PagePaymentGateway',
    components: {
        TemplatePaymentGateway,
    },
    metaInfo() {
        return {
            title: PAGE_TITLE.PAYMENT,
            titleTemplate: PAGE_TITLE.TITLE_TEMPLATE + '%s',
        };
    },
    data() {
        return {
            bookingDetails: {},
            paymentMode: {},
            status: false,
            // Captured during getBookingDetails so the `purchase`
            // event in getStatus has spot/user info without an extra
            // backend round-trip.
            lastBookingInfo: null,
            lastPaymentInfo: null,
        };
    },
    mounted() {
        const statusURL = /status|order_id/;
        const paymentURL = /payment|validate|p|h/;
        if (statusURL.test(this.$route.params.pathMatch)) {
            this.status = !this.status;
            this.getStatus();
        } else if (paymentURL.test(this.$route.params.pathMatch)) {
            this.getBookingDetails();
        }
    },
    methods: {
        async getBookingDetails() {
            const p = this.$route.query.p;
            const h = this.$route.query.h;
            try {
                const response = await fetch(
                    `https://maya-in.parkspot.in/payment/validate?p=${p}&h=${h}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                            'flavour': 'this.flavour',
                        },
                    },
                );
                if (!response.ok) {
                    throw new Error(response);
                } else {
                    const data = await response.json();
                    if (
                        Object.prototype.hasOwnProperty.call(data, 'ErrorCode')
                    ) {
                        this.status = !this.status;
                        if (data.ErrorCode === 5) {
                            this.$router.push({
                                name: 'thankYou',
                                params: { msg: data.DisplayMsg },
                            });
                        } else {
                            this.$router.push({
                                name: 'error',
                                params: {
                                    msg: data.DisplayMsg,
                                },
                            });
                        }
                    } else {
                        this.bookingDetails = {
                            name: data.BookingInfo.Name,
                            dueDate: data.DueDate,
                            amount: data.PaymentInfo.Amount,
                            discount: data.PaymentInfo.Discount,
                            baseAmount: data.BookingInfo.Rent,
                            convenienceFee: 0,
                        };
                        // Show convenience fee only if payment amount includes convenience fee.
                        if (
                            data.PaymentInfo.Type ==
                                PaymentType.ConvenienceFee ||
                            data.PaymentInfo.Type ==
                                PaymentType.MonthlyRentWithConvenienceFeeAndSecurityDeposit
                        ) {
                            this.bookingDetails.convenienceFee =
                                data.BookingInfo.ConvenienceFee;
                        }
                        this.paymentMode = { ...data.Payment };

                        // Stash booking + payment context so the
                        // success path of getStatus() (which is
                        // invoked from a different URL after the
                        // Cashfree round-trip) can emit a complete
                        // `purchase` payload without re-fetching.
                        this.lastBookingInfo = data.BookingInfo;
                        this.lastPaymentInfo = data.PaymentInfo;

                        // Booking-funnel step 9: payment_initiated. The
                        // user has landed on /payment/... and the
                        // booking row has been validated server-side —
                        // they are about to click Pay Now and be
                        // redirected to Cashfree. `transaction_id` is
                        // parkspot's `payments` PK exposed as `?p=`.
                        track(EVENTS.PAYMENT_INITIATED, {
                            funnel_name: 'booking',
                            step_index: 9,
                            payment_provider: 'cashfree',
                            value: data.PaymentInfo.Amount,
                            currency: 'INR',
                            transaction_id: String(p),
                        });
                    }
                }
            } catch {
                this.status = !this.status;
                this.getStatus();
            }
        },
        async getStatus() {
            const o = this.$route.query.order_id;
            const response = await fetch(
                `https://maya-in.parkspot.in/payment/status?order_id=${o}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                        'flavour': 'this.flavour',
                    },
                },
            );
            const data = await response.json();
            if (data.Status === 'PAID') {
                // Booking-funnel step 10: `purchase`. Secondary GA4 key
                // event — present in reports but excluded from the Ads
                // bidding column to avoid double-counting against the
                // primary tentative-booking conversion.
                //
                // `transaction_id` is parkspot's `payments` PK from the
                // `?p=` query (preferred) — fall back to Cashfree's
                // `order_id` only if `?p=` is absent. The dedup set
                // (sessionStorage.parkspot_fired_purchases) keys on
                // this id so retries / back-button revisits no-op.
                const transactionId = this.$route.query.p
                    ? String(this.$route.query.p)
                    : o
                      ? String(o)
                      : '';
                if (transactionId && markPurchaseFired(transactionId)) {
                    const bookingInfo =
                        this.lastBookingInfo ||
                        data?.BookingInfo ||
                        null;
                    const paymentInfo =
                        this.lastPaymentInfo ||
                        data?.PaymentInfo ||
                        null;
                    const value =
                        paymentInfo?.Amount ??
                        this.bookingDetails?.amount ??
                        0;
                    const items = bookingInfo
                        ? [
                              {
                                  item_id:
                                      bookingInfo.SiteID ||
                                      bookingInfo.BookingID ||
                                      transactionId,
                                  item_name:
                                      bookingInfo.SiteName ||
                                      bookingInfo.Name ||
                                      '',
                                  price:
                                      bookingInfo.Rent ??
                                      paymentInfo?.Amount ??
                                      0,
                              },
                          ]
                        : [
                              {
                                  item_id: transactionId,
                                  item_name: this.bookingDetails?.name || '',
                                  price:
                                      this.bookingDetails?.baseAmount ?? 0,
                              },
                          ];
                    track(EVENTS.PURCHASE, {
                        funnel_name: 'booking',
                        step_index: 10,
                        transaction_id: transactionId,
                        value,
                        currency: 'INR',
                        items,
                        enhanced_conversion_data: {
                            email_address:
                                bookingInfo?.EmailID ||
                                bookingInfo?.Email ||
                                '',
                            phone_number: normalizeE164(
                                bookingInfo?.Mobile ||
                                    bookingInfo?.PhoneNumber ||
                                    '',
                            ),
                        },
                    });
                }

                // Redirect to thank-you with `from=booking` (so
                // PageThankYou fires `purchase_confirmed`) and `t=`
                // carrying the transaction id so the confirmation
                // event can join back to the same booking row.
                this.$router.push({
                    name: 'thankYou',
                    params: { msg: 'You have paid the amount.' },
                    query: {
                        from: 'booking',
                        ...(transactionId ? { t: transactionId } : {}),
                    },
                });
                return;
            } else if (data.Status === 'ACTIVE') {
                this.$router.push({
                    name: 'error',
                    params: { msg: 'Your order is still pending!' },
                });
            } else if (data.ErrorCode > 0) {
                this.$router.push({
                    name: 'error',
                    params: { msg: data.DisplayMsg },
                });
            } else {
                this.$router.push({
                    name: 'error',
                });
            }
        },
    },
};
</script>
<style scoped></style>
