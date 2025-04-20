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
            { id: 0, name: 'Less than 1 month' },
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
        { id: 0, name: 'Less than 1 month' },
        { id: 1, name: '2 - 3 months' },
        { id: 2, name: '3 - 5 months' },
        { id: 3, name: 'More than 6 months' },
    ],
    TERMS: 'Terms & Conditions',
    TERMS_DATA: 'I agree to',
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
];

// Clients testimonials for VO Page
export const VO_PAGE_TESTIMONIALS = [
    {
        name: 'Mohamed Awaiz',
        image: '/assets/Testimonial1.png',
        quote: `Definitely a game changer in Bangalore now
U can easily rent a parking spot near you.👍✌️😁`,
        rate: 5,
        link: 'https://g.co/kgs/mq6AbRv',
    },
    {
        name: 'Devaraj Kamkar',
        image: '/assets/Testimonial2.png',
        quote: `It's great app and the Parkspot team is very supportive and dedicated. Got a parking spot within day.
        Special thanks to Preeti.`,
        rate: 5,
        link: 'https://g.co/kgs/Bz9gNeL',
    },
    {
        name: 'Abishek Suresh',
        image: '/assets/Testimonial3.png',
        quote: `Parkspot really helped me when I'm in desperate need for a parking spot in Bangalore. 
        They just confirmed me a spot in 30 mins. I recommend them to anyone who is looking for a parking space.`,
        rate: 5,
        link: 'https://g.co/kgs/4zTimhw',
    },
    // TODO: Remove 2 testimonials
    // Swiper is not working correctly with three testimonials.
    {
        name: 'Reshma Geetha',
        image: '/assets/Testimonial4.png',
        quote: `Parkspot is absolutely a genuine company. Preety coordinated well and made work easy.will definitely recommend parkspot to others and trustful`,
        rate: 5,
        link: 'https://g.co/kgs/r4d1awq',
    },
    {
        name: 'Manish Tadhiyal',
        image: '/assets/Testimonial5.png',
        quote: `Nice customer service, they help you with every step till you get your parking space.
        Good App, nice support team.
        Thanks for support Preety.😊`,
        rate: 5,
        link: 'https://g.co/kgs/A7T2jka',
    },
];

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
];

export const WHAT_NEXT = [
    {
        description: 'Hear back from us within 24 hours.',
        icon: 'support_agent',
        title: 'Step 1',
    },
    {
        description: '⁠Schedule spot visit after registration.',
        icon: 'how_to_reg',
        title: 'Step 2',
    },
    {
        description: `⁠Pay the rent and start parking.`,
        icon: 'car_tag',
        title: 'Step 3',
    },
    {
        description: 'Relax with ParkSpot, you parking companion!',
        icon: 'self_improvement',
        title: 'Step 4',
    },
];

export const FREQUENT_COMMENTS = [
    'Not Answering',
    'Busy',
    'Only view',
    'Requested Location',
];

export const CAR_WASH_SERVICES = [
    'Car Body Cleaning',
    'Windshield & Windows',
    'Wheels & Alloy',
    'Shine & Protects with Carnauba Wax',
    'Imported Biodegradable Cleaning Solutions',
    'Professional Services',
];
export const DISTANCE_FILTER_OPTIONS = [
    'Less than 2 KM',
    '2 KM to 3 KM',
    '3 KM to 4 KM',
    '4 KM to 5 KM',
    'Above 5 KM',
];

export const RENT_FILTER_OPTIONS = [
    'Less than ₹3000',
    '₹3000 - ₹4000',
    '₹4000 - ₹5000',
    'More than ₹5000',
];

export const STATUS_FILTER_OPTIONS = ['Available', 'Rented out'];

export const SORT_FILTER_OPTIONS = [ 'Recommended', 'Rent', 'Distance',];
