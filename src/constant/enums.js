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
    PaymentTransferred: 9,
    PaymentExpired: 10,
    FullRefund: 11,
    PartialRefund: 12,
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
    'Transferred',
    'Expired',
    'Full Refund',
    'Partial Refund',
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
 * @return {string}: label for kyc status
 */
export function getKYCStatusLabel(kyStatus) {
    return getEnumLabel(KYCStatusLabel, kyStatus);
}

export const BookingStatus = Object.freeze({
    // BookingInitiated => fired tentative, SO not confirmed yet.
    BookingInitiated: 0, // tentative
    BookingConfirmed: 1, // active
    BookingCancelled: 2, // past
    BookingRefunded: 3, // past
    // BookingFailedUnavailiblity => spot NOT available or owner declined.
    BookingFailedUnavailiblity: 4, // tentative
    BookingFailedError: 5,
    // BookingPaymentPending => SO confirmed waiting for payment.
    // only incase when visit is not needed.
    BookingPaymentPending: 6, // active
    // BookingVisiting => VO has paid conv fee. VO will visit/visited the spot.
    BookingVisiting: 7,
    // SO confirmed waiting for payment to schedule visit
    BookingScheduleVisit: 8,
    // Booking in progress but upcoming rent is due.
    BookingRentDue: 9,
});

export const BookingStatusLabels = [
    'Initiated',
    'Confirmed',
    'Cancelled',
    'Refunded',
    'Unavailable',
    'Failed Error',
    'Payment Pending (Rent + Conv fee due)',
    'Visiting (Rent due)',
    'Schedule Visit (Conv fee due)',
    'Rent Due',
];

/**
 *
 * @param {int} bookingStatus
 * @return {string}: label for booking status
 */
export function getBookingStatusLabel(bookingStatus) {
    return getEnumLabel(BookingStatusLabels, bookingStatus);
}

export const PaymentPeriodicity = Object.freeze({
    PeriodicityOnce: 0,
    PeriodicityDaily: 1,
    PeriodicityMonthly: 2,
});

export const PaymentPeriodicityLabels = ['Once', 'Daily', 'Monthly'];

/**
 *
 * @param {int} paymentPeriodicity
 * @return {string}: label for payment periodicity
 */
export function getPaymentPeriodicityLabel(paymentPeriodicity) {
    return getEnumLabel(PaymentPeriodicityLabels, paymentPeriodicity);
}

export const PaymentType = Object.freeze({
    PaymentTypeNotSet: 0,
    ConvenienceFee: 1,
    MonthlyRentWithConvenienceFeeAndSecurityDeposit: 2,
    MonthlyRentAndSecurityDeposit: 3,
    MonthlyRent: 4,
});

export const PaymentTypeLabels = [
    'PaymentTypeNotSet',
    'ConvenienceFee',
    'MonthlyRentWithConvenienceFeeAndSecurityDeposit',
    'MonthlyRentAndSecurityDeposit',
    'MonthlyRent',
];

/**
 *
 * @param {int} paymentType
 * @return {string}: label for payment Type
 */
export function getPaymentTypeLabel(paymentType) {
    return getEnumLabel(PaymentTypeLabels, paymentType);
}
