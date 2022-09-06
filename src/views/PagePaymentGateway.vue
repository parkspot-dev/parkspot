<template>
    <div class="custom-bg">
        <div class="bg-decor"></div>

        <TemplatePaymentGateway
            :bookingDetails="bookingDetails"
            :paymentMode="paymentMode"
            :status="status"
        >
        </TemplatePaymentGateway>
    </div>
</template>
<script>
import TemplatePaymentGateway from '../components/templates/TemplatePaymentGateway.vue';
export default {
    name: 'PagePaymentGateway',
    components: {
        TemplatePaymentGateway,
    },
    data() {
        return {
            bookingDetails: {},
            paymentMode: {},
            status: false,
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
                    `https://maya.parkspot.in/payment/validate?p=${p}&h=${h}`,
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
                            });
                        }
                    } else {
                        this.bookingDetails = {
                            name: data.BookingInfo.Name,
                            dueDate: data.DueDate,
                            amount: data.PaymentInfo.Amount,
                            discount: data.PaymentInfo.Discount,
                            convenienceFee: data.PaymentInfo.ConvenienceFee,
                            baseAmount: data.PaymentInfo.BaseAmount,
                        };
                        this.paymentMode = { ...data.Payment };
                    }
                }
            } catch (exception) {
                this.status = !this.status;
                this.getStatus();
            }
        },
        async getStatus() {
            const o = this.$route.query.order_id;
            const response = await fetch(
                `https://maya.parkspot.in/payment/status?order_id=${o}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                        'flavour': 'this.flavour',
                    },
                },
            );
            const data = await response.json();
            if (data === 'PAID') {
                this.$router.push({
                    name: 'thankYou',
                    params: { msg: 'You have paid the amount.' },
                });
            } else if (data === 'ACTIVE') {
                this.$router.push({
                    name: 'error',
                    params: { msg: 'Your order is still pending!' },
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
<style scoped>
</style>
