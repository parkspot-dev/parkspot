export const isInvalidPaymentId = (paymentID) => {
    return paymentID === undefined || paymentID === null || Number.isNaN(paymentID);
};