/**
 *
 * @param {Array} enumLabels
 * @param {int} enumValue
 * @return {string}: enum label for enum value
 */
function getEnumLabel(enumLabels, enumValue) {
    if (enumValue >= enumLabels.length) {
        ('Undefined enum');
    }
    return enumLabels[enumValue];
}

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
    'Not Defined',
    'Pending',
    'Incomplete',
    'Failed',
    'User Dropped',
    'Flagged',
    'Success',
    'Cancelled',
    'Void',
];

/**
 *
 * @param {int} paymentStatus
 * @return {string}: label for payment Status
 */
export function getPaymentStatusLabel(paymentStatus) {
    return getEnumLabel(PaymentStatusLabel, paymentStatus);
}

export const KYCStatus = Object.freeze({
    // NotSet => KYC information NOT available
    NotSet: 0,
    // Pending => pending for document verification
    Pending: 1,
    // IDVerified => User ID card is successfully verified
    IDVerified: 2,
    // OwnershipVerified => User vehicle/spot ownership (depending on UserType) is successfully verified
    OwnershipVerified: 3,
    // Verified => all documents successfully KYC verified
    Verified: 4,
    // Denied => process started but non of the document was verified
    Denied: 5,
    // NotVerified => KYC process has not even started
    NotVerified: 6,
});

const KYCStatusLabel = [
    'NotSet',
    'Pending',
    'IDVerified',
    'OwnershipVerified',
    'Verified',
    'Denied',
    'NotVerified',
];

/**
 *
 * @param {int} kyStatus
 * @return {string}: label for kyc Status
 */
export function getKYCStatusLabel(kyStatus) {
    return getEnumLabel(KYCStatusLabel, kyStatus);
}
