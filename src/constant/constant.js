import { ParkingSize } from '@/constant/enums';
// Todo: Remove Form constants not needed
export const FORM = {
    USERNAME: 'Username',
    NAME: 'full-name',
    FULLNAME: 'Full Name',
    FIRSTNAME: 'First Name',
    LASTNAME: 'Last Name',
    EMAIL: 'Email',
    CONTACT_NO: 'Mobile No.',
    ADDRESS: 'Address',
    APARTMENT: 'Apartment Name',
    BASEAMOUNT: 'Expected Rent',
    CAR_MODEL: 'Car Model',
    MESSAGE: 'Message',
    GOOGLE_MAP_LINK: 'Google Map Link',
};

export const FORM_PLACEHOLDERS = {
    USERNAME: 'Enter your username',
    NAME: 'Enter your name',
    FULL_NAME: 'Enter your full name',
    LAST_NAME: 'Enter your last name',
    EMAIL: 'Enter your email address',
    CONTACT_NO: 'Enter your mobile number',
    ADDRESS: 'Enter your full address',
    APARTMENT: 'Enter your apartment or building name',
    BASE_AMOUNT: 'Enter the expected monthly rent',
    CAR_MODEL: 'e.g. Honda Civic, Maruti Swift, Tata Nexon',
    MESSAGE: 'Write Something...',
    GOOGLE_MAP_LINK: 'Maps URL',
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

export const JOINING_BENEFITS_VO = [
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

export const WHAT_NEXT_VO = [
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
        description: 'Relax with ParkSpot, your parking companion!',
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
    'Full Exterior Steam Wash',
    'Vecuuming of Interior',
    'Dashboard & Door Step Cleaning',
    'Boot Cleaning',
    'Wheel and Wheel Arch Cleaning',
    'Tyre Dressing',
];

export const ParkingSizeLabels = Object.freeze([
    'Unspecified',
    'Hatchback [like Swift]',
    'Compact SUV [like Nexon]',
    'FullSize [like XUV700]',
    'Bike',
]);

export const ParkingSizeDisplayMap = Object.freeze({
    'Unspecified': ParkingSize.Unspecified,
    'Hatchback [like Swift]': ParkingSize['HatchBack(Small)'],
    'Compact SUV [like Nexon]': ParkingSize['Compact(Medium)'],
    'FullSize [like XUV700]': ParkingSize['FullSize(Large)'],
    'Bike': ParkingSize.Bike,
});

export const JOINING_BENEFITS_SO = [
    {
        text: 'Trusted by 1000+ Happy Spot Owners across India.',
        icon: 'emoji_people',
    },
    {
        text: 'Safe and Verified Renters',
        icon: 'verified_user',
    },
    {
        text: 'Hassle-free payments.',
        icon: 'account_balance_wallet',
    },
    {
        text: 'Dedicated Support - Always on Call.',
        icon: 'headset_mic',
    },
    {
        text: 'Complete Control Over Your Parking Space.',
        icon: 'tune',
    },
    {
        text: 'Zero Listing Fees, Maximum Earnings.',
        icon: 'trending_up',
    },
    {
        text: 'Earn Daily, Weekly, or Monthly - You Choose.',
        icon: 'schedule',
    },
];

export const WHAT_NEXT_SO = [
    {
        description: 'List your parking spot with ParkSpot',
        icon: 'location_on',
        title: 'Step 1',
    },
    {
        description: 'Get discovered by drivers',
        icon: 'travel_explore',
        title: 'Step 2',
    },
    {
        description: `⁠Earn securely`,
        icon: 'attach_money',
        title: 'Step 3',
    },
    {
        description: 'Relax with ParkSpot, your parking companion!',
        icon: 'spa',
        title: 'Step 4',
    },
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

export const SORT_FILTER_OPTIONS = ['Recommended', 'Rent', 'Distance'];

export const WHAT_NEXT_AUTOMATED_PARKING = [
    {
        description: 'Reach Out to Us',
        icon: 'support_agent',
        title: 'Step 1',
    },
    {
        description: 'On-Site Visit',
        icon: 'location_on',
        title: 'Step 2',
    },
    {
        description: `⁠Quick Installation`,
        icon: 'flash_on',
        title: 'Step 3',
    },
    {
        description: 'Personalized Dashboard',
        icon: 'space_dashboard',
        title: 'Step 4',
    },
];

export const AUTOMATION_PARKING_PAGE_TESTIMONIALS = [
    {
        name: 'Rahul Sinha',
        image: 'https://cdn.cutshort.io/public/users/5efde0264077430b6ad19008',
        quote: `Ever since the automated parking system was installed, driving in and out of the society feels effortless. My car gets recognized instantly via the RFID tag, and the boom barrier opens automatically. It’s like living in a smart community!`,
        rate: 5,
        role: 'Resident, Bangalore',
    },
    {
        name: 'Anita Desai',
        image: 'https://static1.innoget.com/uploads/5dda279c5df6b.jpg',
        quote: `Earlier, visitor parking meant calls, logs, and delays. Now I just approve entries with a tap on the app. Residents love the convenience, and our security staff is finally stress-free!`,
        rate: 5,
        role: 'Society Secretary, Bangalore',
    },
    {
        name: 'Nitin Verma',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWJO2mToSVtaFIDQdx5POnasfRGWhZgldo1A&s',
        quote: `Coming home used to mean honking at the gate and waiting for guards. With this automated RFID system, the gate opens the moment my car arrives. It’s smooth, fast, and completely secure!`,
        rate: 5,
        role: 'Resident, Hyderabad',
    },
    {
        name: 'Ravi Kulkarni',
        image: 'https://cdn.cutshort.io/public/users/5efde0264077430b6ad19008',
        quote: `Managing parking is no longer a manual job. The RFID-based entry logs everything automatically, and I can even see resident and visitor activity on the backend. We’ve reduced parking complaints to almost zero.`,
        rate: 5,
        role: 'Society Manager, Chennai',
    },
    {
        name: 'Priya Nair',
        image: 'https://lh3.googleusercontent.com/a/ACg8ocIYH1USwJFQ2QlXEkvzrJ0P7B4dcKwIBnXQ5cTOstU9bgGK5A',
        quote: ` Apart from the seamless parking access, I also love that I can book a doorstep car wash directly through the app. Everything I need is just a click away—modern living, truly!`,
        rate: 5,
        role: 'Resident, Bangalore',
    },
];

export const WHY_CHOOSE_PARKSPOT_SOCIETY_AUTOMATION = [
    {
        title: 'Quick & Hassle-Free Entry/Exit',
        description: 'Drive in and out within seconds—no waiting, no delays.',
    },
    {
        title: ' Easy-to-Use, Personalized Dashboard',
        description:
            'Manage everything from one simple dashboard, tailored for your society’s needs',
    },
    {
        title: 'Dedicated Parking Management',
        description:
            'Each resident gets their own assigned spot—no more parking confusion or misuse.',
    },
    {
        title: 'Swift Installation at Your Society',
        description:
            'Get up and running in no time with our fast and efficient setup process',
    },
    {
        title: 'Advanced, Reliable Security',
        description:
            'Keep your society/workplace safe with cutting-edge access control and monitoring.',
    },
    {
        title: 'Timely Maintenance, Every 6 Months',
        description:
            'We ensure your system runs smoothly with regular maintenance and updates.',
    },
];

export const CITY_OPTIONS = [ "Bengaluru", "Chennai", "Hyderabad", "Kolkata", "Other" ];
export const DEFAULT_BANGALORE_COORDINATES = { lat: 12.9716, lng: 77.5946 }