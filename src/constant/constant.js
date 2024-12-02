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

export const TOP_SEARCH_PLACES = [
    {
        id: 1,
        title: 'Parking Spot in JP-Nagar',
        spots: 40,
        path: '/bangalore/parking-near-jp-nagar',
    },
    {
        id: 2,
        title: 'Parking Spot in BTM',
        spots: 20,
        path: '/bangalore/parking-near-btm',
    },
    {
        id: 3,
        title: 'Parking Spot in Hyderabad',
        spots: 60,
        path: '/hyderabad/parking-near-hyderabad',
    },
]

export const VO_PAGE_TESTIMONIALS = [
    {
        name: 'Jay Ravi',
        image: require('@/assets/vo-page-testimonial-2.png'),
        quote: `I recently had the pleasure of using the "ParkSpot" app to find a 
          covered car parking spot in Bangalore, and I must say it exceeded my expectations. 
          The app's user-friendly interface made it incredibly easy to locate available parking spaces in the bustling city. 
          One of the standout features of ParkSpot is its real-time availability updates, 
          which helped me save time and frustration. I could see which parking spots were 
          open and even reserve a spot in advance, Thanks to Preety.`,
        rate: 4.9,
        date: '6 Nov 2023',
    },
    {
        name: 'Nagarjun Prasad',
        image: require('@/assets/testimony2.webp'),
        quote: `A highly essential app for anyone in a metropolitan city, 
          everyone knows the pains of finding a parking spot for your vehicle and 
          this app makes it easy. The app allowed me to easily find any parking 
          spots near me. The prices for the spots considering the duration was also
          very affordable. Would definitely recommend this to anyone who wants a 
          painless experience to park their vehicles or to someone who has free 
          spots to rent out and make some cash.`,
        rate: 4.7,
        date: '15 Feb 2021',
    },
    {
        name: 'Ishwar Kumar',
        image: require('@/assets/vo-page-testimonial-1.webp'),
        quote: `Had a great experience using ParkSpot. I needed a parking space for my vehicle for around 2 months. I searched in ParkSpot and it has numerous results. I chose one of the nearest parking space and prebook it online. This app has also navigation feature which makes very easy for me to get the exact location of the parking space.`,
        rate: 4.8,
        date: '17 Jan 2017',
    },
]

export const JOINING_BENEFITS = [
    {
        text: '5000+ happy customers across various platforms.',
        icon: 'group',
    },
    {
        text: 'Easy payment process with reminders.',
        icon: 'id_card',
    },
    {
        text: 'Hassle-free booking process with on-call support.',
        icon: 'payments',
    },
    {
        text: 'KYC because we care for your security.',
        icon: 'support_agent',
    },
    {
        text: 'Multi-city presence with a wide network.',
        icon: 'location_city',
    },
]