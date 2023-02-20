export const FORM = {
    USERNAME: 'Username',
    NAME: 'full-name',
    FULLNAME: 'Full Name',
    FIRSTNAME: 'First Name',
    LASTNAME: 'Last Name',
    EMAIL: 'Email',
    CONTACT_NO: 'Contact No.',
};

export const PARKING_FACILITY = {
    SO: {
        BUILDING_ADDR: 'Building Address',
        TOTAL_PARKING: 'Total Parking',
        FACILITIES: 'Facilities',
        FACILITIES_DATA: [
            'Covered',
            'Gated',
            'CCTV Camera',
            'Security Guard',
            '24 Hour Access',
        ],
        LANDMARK: 'Landmark',
    },
    VO: {
        PARKING_TYPE: 'Types of parking',
        PARKING_TYPE_LIST: [
            { id: 0, name: 'Covered Parking' },
            { id: 1, name: 'Open Parking' },
        ],
        DURATION: 'Duration',
        MINIMUM_DURATION_DATA: [
            { id: 0, name: ' < 1 month' },
            { id: 1, name: '2 - 3 months' },
            { id: 2, name: '3 - 5 months' },
            { id: 3, name: 'More than 6 months' },
        ],
        CAR_TYPE: [
            { id: 0, name: 'Suv' },
            { id: 1, name: 'Sedan' },
            { id: 2, name: 'Hatchback' },
        ],
    },
};

export const KYC = {
    OWNER_RADIO_DATA: ['Yes', 'No'],
    DOCUMENT_DATA: [
        { id: 0, name: 'Adhaar Card' },
        { id: 1, name: 'Electricity Bills' },
        { id: 2, name: 'Driving License' },
        { id: 3, name: 'Rent Agreement' },
    ],
    DOCUMENT_INFO_MSG:
        'Note: Document must contain the address proof of the spot registered.',
};

export const ADD_INFO = {
    AMENITIES: 'Amenities',
    SPOTS: 'Spots',
    MINIMUM_DURATION: 'Minimum Duration',
    RENT: 'Expected Rent',
    AMENITIES_DATA: [
        'Covered',
        'Gated',
        'CCTV Camera',
        'Security Guard',
        'Others',
    ],
    SPOTS_DATA: [
        { id: 0, name: '1' },
        { id: 1, name: '2' },
        { id: 2, name: '3' },
        { id: 3, name: '3+' },
    ],
    MINIMUM_DURATION_DATA: [
        { id: 0, name: 'less than 1 month' },
        { id: 1, name: '2 - 3 months' },
        { id: 2, name: '3 - 5 months' },
        { id: 3, name: 'More than 6 months' },
    ],
    TERMS: 'Terms & Conditions',
    TERMS_DATA: ['I agree to '],
};

export const PREFERENCE = {
    PARKING_TYPE: 'Types of parking',
    DURATION: 'Duration',
    MODEL: 'Car Model',
    PARKING_TYPE_LIST: [
        { id: 0, name: 'Covered Parking' },
        { id: 1, name: 'Open Parking' },
    ],
};

export const ICON = {
    INFO: 'information-outline',
};

export const PAGE_TITLE = {
    TITLE_TEMPLATE: 'ParkSpot | ',
    HOMEPAGE:
        'Find and Book Parking Spaces Nearby | Bangalore Delhi Mumbai Pune Bengaluru | Parkspot.in',
    FAQ: `FAQ's - Get Your All Parking Related Queries be Answered...`,
    ABOUT: 'About -  Get Parking Space , Rent Empty Space',
    CONTACT: 'Contact Us',
    FEATURES: 'Features',
    VO_PORTAL: 'Get Parking Spot',
    SO_PORTAL: 'Register Parking Spot',
    TERMS: 'Terms & Conditions',
    THANK: 'Thank You!',
    ERROR: 'Oops... Something went wrong!!',
    BLOG: 'Blogs',
    SEARCH_PORTAL: 'Search Portal - Admin Only',
    PAYMENT: 'Payment',
    DISCOVER: 'Parking Near ',
    SEARCH: 'ParkSpot | ',
};
