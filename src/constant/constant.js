// Todo: Remove Form constants not needed
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
            '24 Hours Access',
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
            { id: 0, name: 'SUV' },
            { id: 1, name: 'Sedan' },
            { id: 2, name: 'Hatchback' },
        ],
    },
};

export const KYC = {
    OWNER_RADIO_DATA: ['Yes', 'No'],
    DOCUMENT_DATA_SO: [
        { id: 0, name: 'Adhaar Card' },
        { id: 1, name: 'Electricity Bills' },
        { id: 2, name: 'Driving License' },
        { id: 3, name: 'Rent Agreement' },
    ],
    DOCUMENT_DATA_VO: [
        { id: 0, name: 'Adhaar Card' },
        { id: 1, name: 'Driving License' },
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
        ' ParkSpot | Find and Book Parking Spaces Nearby | Parking space near me | Bangalore Bengaluru Parking service| Hyderabad Parking',
    FAQ: `FAQ's - Get Your All Parking Related Queries be Answered...`,
    ABOUT: 'About -  Get Parking Space , Rent Empty Space',
    CONTACT: 'Contact Us',
    FEATURES: 'Features',
    VO_PORTAL: 'Get Parking Spot',
    SO_PORTAL: 'Register Parking Spot',
    TERMS: 'Terms & Conditions',
    PRIVACY: 'Privacy Policy',
    THANK: 'Thank You!',
    ERROR: 'Oops... Something went wrong!!',
    BLOG: 'Parking Blogs',
    SEARCH_PORTAL: 'Search Portal - Admin Only',
    PAYMENT: 'Payment',
    DISCOVER: 'Parking Near ',
    SEARCH: 'ParkSpot | ',
};

export const APP_LINK = {
    IOS: 'https://apps.apple.com/in/app/parkspot-find-book-parking/id6449634064',
    ANDROID:
        'https://play.google.com/store/apps/details?id=com.parkspot.maya_nagri&utm_source=parkspot.in&utm_campaign=website',
};


export const SPOT_REQUESTS = [
    { id: 1, name: 'John Doe', email: 'john@example.com', contactNumber: '123-456-7890', parkingType: 'Reserved', duration: '2 hours', carModel: 'Toyota Camry' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', contactNumber: '234-567-8901', parkingType: 'Visitor', duration: '3 hours', carModel: 'Honda Accord' },
  { id: 3, name: 'Michael Johnson', email: 'michael@example.com', contactNumber: '345-678-9012', parkingType: 'Reserved', duration: '1 hour', carModel: 'Ford Focus' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', contactNumber: '456-789-0123', parkingType: 'General', duration: '4 hours', carModel: 'Chevrolet Malibu' },
  { id: 5, name: 'David Wilson', email: 'david@example.com', contactNumber: '567-890-1234', parkingType: 'Reserved', duration: '5 hours', carModel: 'Nissan Altima' },
  { id: 6, name: 'Sarah Brown', email: 'sarah@example.com', contactNumber: '678-901-2345', parkingType: 'Visitor', duration: '30 minutes', carModel: 'Hyundai Elantra' },
  { id: 7, name: 'James Garcia', email: 'james@example.com', contactNumber: '789-012-3456', parkingType: 'General', duration: '1 hour', carModel: 'Kia Sorento' },
  { id: 8, name: 'Olivia Martinez', email: 'olivia@example.com', contactNumber: '890-123-4567', parkingType: 'Reserved', duration: '2 hours', carModel: 'Volkswagen Jetta' },
  { id: 9, name: 'William Rodriguez', email: 'william@example.com', contactNumber: '901-234-5678', parkingType: 'Visitor', duration: '3 hours', carModel: 'Subaru Impreza' },
  { id: 10, name: 'Sophia Hernandez', email: 'sophia@example.com', contactNumber: '012-345-6789', parkingType: 'General', duration: '4 hours', carModel: 'Mazda 3' },
  { id: 11, name: 'Ethan Lee', email: 'ethan@example.com', contactNumber: '123-456-7891', parkingType: 'Reserved', duration: '2 hours', carModel: 'Toyota Corolla' },
  { id: 12, name: 'Isabella Walker', email: 'isabella@example.com', contactNumber: '234-567-8902', parkingType: 'Visitor', duration: '1 hour', carModel: 'Ford Escape' },
  { id: 13, name: 'Mason Hall', email: 'mason@example.com', contactNumber: '345-678-9013', parkingType: 'General', duration: '3 hours', carModel: 'Honda Civic' },
  { id: 14, name: 'Mia Young', email: 'mia@example.com', contactNumber: '456-789-0124', parkingType: 'Reserved', duration: '2 hours', carModel: 'Chevrolet Equinox' },
  { id: 15, name: 'Alexander Allen', email: 'alexander@example.com', contactNumber: '567-890-1235', parkingType: 'Visitor', duration: '4 hours', carModel: 'Nissan Rogue' },
  { id: 16, name: 'Charlotte King', email: 'charlotte@example.com', contactNumber: '678-901-2346', parkingType: 'General', duration: '30 minutes', carModel: 'Hyundai Tucson' },
  { id: 17, name: 'Logan Wright', email: 'logan@example.com', contactNumber: '789-012-3457', parkingType: 'Reserved', duration: '1 hour', carModel: 'Kia Sportage' },
  { id: 18, name: 'Amelia Scott', email: 'amelia@example.com', contactNumber: '890-123-4568', parkingType: 'Visitor', duration: '2 hours', carModel: 'Subaru Forester' },
  { id: 19, name: 'Daniel Green', email: 'daniel@example.com', contactNumber: '901-234-5679', parkingType: 'General', duration: '3 hours', carModel: 'Mazda CX-5' },
  { id: 20, name: 'Harper Adams', email: 'harper@example.com', contactNumber: '012-345-6790', parkingType: 'Reserved', duration: '5 hours', carModel: 'Toyota RAV4' },
  { id: 21, name: 'Henry Nelson', email: 'henry@example.com', contactNumber: '123-456-7892', parkingType: 'Visitor', duration: '1 hour', carModel: 'Ford F-150' },
  { id: 22, name: 'Evelyn Carter', email: 'evelyn@example.com', contactNumber: '234-567-8903', parkingType: 'General', duration: '4 hours', carModel: 'Honda CR-V' },
  { id: 23, name: 'Sebastian Mitchell', email: 'sebastian@example.com', contactNumber: '345-678-9014', parkingType: 'Reserved', duration: '2 hours', carModel: 'Chevrolet Silverado' },
  { id: 24, name: 'Scarlett Perez', email: 'scarlett@example.com', contactNumber: '456-789-0125', parkingType: 'Visitor', duration: '3 hours', carModel: 'Nissan Sentra' },
  { id: 25, name: 'Jack Roberts', email: 'jack@example.com', contactNumber: '567-890-1236', parkingType: 'General', duration: '1 hour', carModel: 'Hyundai Sonata' },
  { id: 26, name: 'Grace Turner', email: 'grace@example.com', contactNumber: '678-901-2347', parkingType: 'Reserved', duration: '30 minutes', carModel: 'Kia Forte' },
  { id: 27, name: 'Owen Phillips', email: 'owen@example.com', contactNumber: '789-012-3458', parkingType: 'Visitor', duration: '4 hours', carModel: 'Subaru Crosstrek' },
  { id: 28, name: 'Zoe Campbell', email: 'zoe@example.com', contactNumber: '890-123-4569', parkingType: 'General', duration: '2 hours', carModel: 'Mazda 6' },
  { id: 29, name: 'Gabriel Parker', email: 'gabriel@example.com', contactNumber: '901-234-5670', parkingType: 'Reserved', duration: '3 hours', carModel: 'Toyota Tacoma' },
  { id: 30, name: 'Chloe Evans', email: 'chloe@example.com', contactNumber: '012-345-6781', parkingType: 'Visitor', duration: '5 hours', carModel: 'Ford Explorer' }
]
