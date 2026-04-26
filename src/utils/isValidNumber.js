export const isValidNumber = (paymentID) => {
    return (
        paymentID === undefined || paymentID === null || Number.isNaN(paymentID)
    );
};
