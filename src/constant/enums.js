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

export const ParkingRequestStatus = Object.freeze({
    RequestStatusNotSet: 0,
    RequestRegistered: 1,
    RequestProcessing: 2,
    RequestSpotSuggested: 3,
    RequestSpotAccepted: 4,
    RequestSpotDenied: 5,
    RequestArchive: 6,
});

const ParkingRequestStatusLabel = [
    'Not Set',
    'Registered',
    'Processing',
    'Spot Suggested',
    'Spot Accepted',
    'Spot Denied',
    'Archive',
];

/**
 *
 * @param {int} parkingRequestStatus
 * @return {string}: label for parking request status
 */
export function getParkingRequestStatus(parkingRequestStatus) {
    return getEnumLabel(ParkingRequestStatusLabel, parkingRequestStatus);
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
    'Payment Pending (Conv Fee + Rent + SD)',
    'Visiting (Rent + SD)',
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
    'Not Set',
    'Conv Fee',
    'Rent + Conv Fee + SD',
    'Rent + SD',
    'Rent',
];

/**
 *
 * @param {int} paymentType
 * @return {string}: label for payment Type
 */
export function getPaymentTypeLabel(paymentType) {
    return getEnumLabel(PaymentTypeLabels, paymentType);
}

export const SpotRequestStatus = Object.freeze({
    "Not Set": 0,
    Registered: 1,
    Processing: 2,
    "Requested Modification": 3,
    Verified: 4,
    Promoted: 5,
    Denied: 6,
    Cancelled: 7,
    Duplicate: 8,
});
const SpotRequestStatusLabels = [
    'Not Set',
    'Registered',
    'Processing',
    'Requested Modification',
    'Verified',
    'Promoted',
    'Denied',
    'Cancelled',
    'Duplicate',
];
/**
 * @param {int} spotRequestStatus
 * @return {string}: label for spot request status
 */
export function getSpotRequestStatusLabel(spotRequestStatus) {
    return getEnumLabel(SpotRequestStatusLabels, spotRequestStatus);
}

export const ActiveTabStatus = Object.freeze({
    ParkingRequest: 0,
    InterestedRequest: 1,
});

export const ActiveTabStatusLabels = [
    'parking-request',
    'interested-request'
];

/**
 *
 * @param {int} activeTabStatus
 * @return {string}: label for active tab status
 */
export function getActiveTabStatusLabel(activeTabStatus) {
    return getEnumLabel(ActiveTabStatusLabels, activeTabStatus);
}

export const ParkingSize = Object.freeze({
    Unspecified: 0,
    "HatchBack(Small)": 1,
    "Compact(Medium)": 2,
    "FullSize(Large)": 3,
    Bike: 4,
});

export const ParkingSizeLabels = [
    'Unspecified',
    'Hatchback',
    'Compact',
    'FullSize',
    'Bike',
];

/**
 *
 * @param {int} parkingSize
 * @return {string}: label for parking size
 */
export function getParkingSizeLabel(parkingSize) {
    return getEnumLabel(ParkingSizeLabels, parkingSize);
}


export const RentUnit = Object.freeze({
    PerHour: 0,
    PerDay: 1,
    PerMonth: 2,
    PerSqFtPerMonth: 3,
});

export const RentUnitLabels = [
    'PerHour',
    'PerDay',
    'PerMonth',
    'PerSqFtPerMonth',
];

/**
 *
 * @param {int} rentUnit
 * @return {string}: label for rent unit
 */
export function getRentUnitLabel(rentUnit) {
    return getEnumLabel(RentUnitLabels, rentUnit);
}

export const SiteType = Object.freeze({
    SearchOnly: 0,
    Register: 1,
    Book: 2,
    ParkingYard: 3,
});

export const SiteTypeLabels = [
    'SearchOnly',
    'Register',
    'Book',
    'ParkingYard',
];

/**
 *
 * @param {int} siteType
 * @return {string}: label for site type
 */
export function getSiteTypeLabel(siteType) {
    return getEnumLabel(SiteTypeLabels, siteType);
}