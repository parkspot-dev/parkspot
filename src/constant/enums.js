export const PaymentStatus = Object.freeze({
    PaymentNotDefined: 0,
    PaymentPending: 1,
    PaymentIncomplete: 2,
    PaymentFailed: 3,
    PaymentUserDropped: 4,
    PaymentFlagged: 5,
    PaymentSuccess: 6,
    PaymentCancelled: 7,
    PaymentVoid: 8,
});

const PaymentStatusLabel = [
    'PaymentNotDefined',
    'PaymentPending',
    'PaymentIncomplete',
    'PaymentFailed',
    'PaymentUserDropped',
    'PaymentFlagged',
    'PaymentSuccess',
    'PaymentCancelled',
    'PaymentVoid',
];

/**
 *
 * @param {int} paymentStatus
 * @return {string}: label for payment Status
 */
export function getPaymentStatusLabel(paymentStatus) {
    if (paymentStatus >= PaymentStatusLabel.length) {
        ('Undefined Payemnt Status');
    }
    return PaymentStatusLabel[paymentStatus];
}
