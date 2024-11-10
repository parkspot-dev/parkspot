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


// Dummy Data for SPOT REQUESTS

export const SPOT_REQUESTS = [
    { 
      "ID": 1, 
      "Name": "John Doe", 
      "Latitude": 0,
      "Longitude": 0,
      "BaseAmount": 0,
      "TotalSlots": 0,
      "Address": "Address 1",
      "RentUnit": 0,
      "UserName": "john@example.com", 
      "City": "",
      "Area": "",
      "Size": 0,
      "Type": 0,
      "StartDate": "2024-10-12T11:37:22.6779781Z", 
      "EndDate": "2024-10-12T11:37:22.6779781Z", 
      "MinDuration": "2 hours", 
      "Status": 5, 
      "Remark": "Remark", 
      "LastCallDate": "2024-10-12"
    },
    { 
      "ID": 2, 
      "Name": "Jane Smith", 
      "Latitude": 0,
      "Longitude": 0,
      "BaseAmount": 0,
      "TotalSlots": 0,
      "Address": "Address 2",
      "RentUnit": 0,
      "UserName": "jane@example.com", 
      "City": "",
      "Area": "",
      "Size": 0,
      "Type": 0,
      "StartDate": "2024-10-12T11:37:22.6779781Z", 
      "EndDate": "2024-10-12T11:37:22.6779781Z", 
      "MinDuration": "3 hours", 
      "Status": 4, 
      "Remark": "Remark", 
      "LastCallDate": "2024-10-12"
    },
    { 
      "ID": 3, 
      "Name": "Michael Johnson", 
      "Latitude": 0,
      "Longitude": 0,
      "BaseAmount": 0,
      "TotalSlots": 0,
      "Address": "Address 3",
      "RentUnit": 0,
      "UserName": "michael@example.com", 
      "City": "",
      "Area": "",
      "Size": 0,
      "Type": 0,
      "StartDate": "2024-10-12T11:37:22.6779781Z", 
      "EndDate": "2024-10-12T11:37:22.6779781Z", 
      "MinDuration": "1 hour", 
      "Status": 1, 
      "Remark": "Remark", 
      "LastCallDate": "2024-10-12"
    },
    { 
      "ID": 4, 
      "Name": "James Garcia", 
      "Latitude": 0,
      "Longitude": 0,
      "BaseAmount": 0,
      "TotalSlots": 0,
      "Address": "Address 4",
      "RentUnit": 0,
      "UserName": "james@example.com", 
      "City": "",
      "Area": "",
      "Size": 0,
      "Type": 0,
      "StartDate": "2024-10-12T11:37:22.6779781Z", 
      "EndDate": "2024-10-12T11:37:22.6779781Z", 
      "MinDuration": "2 hours", 
      "Status": 0, 
      "Remark": "Remark", 
      "LastCallDate": "2024-10-12"
    },
    { 
      "ID": 5, 
      "Name": "Olivia Martinez", 
      "Latitude": 0,
      "Longitude": 0,
      "BaseAmount": 0,
      "TotalSlots": 0,
      "Address": "Address 5",
      "RentUnit": 0,
      "UserName": "olivia@example.com", 
      "City": "",
      "Area": "",
      "Size": 0,
      "Type": 0,
      "StartDate": "2024-10-12T11:37:22.6779781Z", 
      "EndDate": "2024-10-12T11:37:22.6779781Z", 
      "MinDuration": "3 hours", 
      "Status": 2, 
      "Remark": "Remark", 
      "LastCallDate": "2024-10-12"
    },
];

  
