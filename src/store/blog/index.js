// states
const state = {
    blogs: [
        {
            id: 'Eliminating-Traffic-jams-in-India',
            title: 'Eliminating Traffic jams in India!',
            author: 'Nikhil Surya Mukhi',
            author_img: require('@/assets/team/nik.jpg'),
            img: 'https://www.stevenvanbelleghem.com/wp-content/uploads/2020/04/Heavy-rains-lash-Delhi-NCR-traffic-snarls-at-many-places.jpg',
            desc: `In the recent years all over the globe production 
                and demand for motor vehicles has increased dramatically.
                Earlier motor vehicles...`,
            time: 'Nov 2, 2020',
            dateTime: '2020-02-11',
            component: 'OrganismEliminatingTrafficPageDesign',
        },
        {
            id: 'Parking-Challenges-in-Office-Area',
            title: 'Parking Challenges in Office Area!',
            author: 'Sujeet Kumar',
            author_img: require('@/assets/team/sujeet.jpg'),
            img: require('@/assets/blog/blog2.jpg'),
            desc: `Parking has been a major concern in major cities. Due
                to fewer parking spaces, people have to spend a lot of time
                searching for the...`,
            time: 'Aug 30, 2021',
            dateTime: '2021-30-07',
            component: 'OrganismParkingChallengesPageDesign',
        },
        {
            id: 'NO-Parking',
            title: 'NO Parking',
            author: 'Ishwar Kumar',
            author_img: require('@/assets/team/ish.jpg'),
            img: require('@/assets/blog/blog3.jpg'),
            desc: `Parking problems have always been an issue and this issue
                has grown exponentially with the increase of population.
                In order to tackl...`,
            time: 'Aug 5, 2021',
            dateTime: '2021-05-07',
            component: 'OrganismNoParkingPageDesign',
        },
        {
            id: 'Extra-Income',
            title: ' An Easy Way to Earn Extra Income!',
            author: 'Sudhanshu Kumar',
            author_img: require('@/assets/team/sud.jpg'),
            img: require('@/assets/blog/blog4.jpg'),
            desc: `Are you looking for a way to earn some extra income without putting 
                in a lot of effort? If so, consider renting out your parking space. 
                Whether you have an unused driv...`,
            time: 'June 10, 2023',
            dateTime: '2023-06-10',
            component: 'OrganismExtraIncomePageDesign',
        },
        {
            id: 'Perfect-Parking',
            title: 'Finding the Perfect Parking Spot!',
            author: 'Nitya Agrawal',
            author_img: require('@/assets/team/nitya.jpg'),
            img: require('@/assets/blog/blog5.jpg'),
            desc: `Are you tired of endlessly circling the block in search of a parking spot? 
                Fear not, because in this vlog we'll be sharing some tips and tricks for 
                finding the perfect parking spot...`,
            time: 'June 15, 2023',
            dateTime: '2023-06-15',
            component: 'OrganismPerfectParkingPageDesign',
        },
        {
            id: "Bengaluru's Tenant Parking" ,
            title: "Bengaluru's Tenant Parking Solutions",
            author: 'Anuj Singh',
            author_img: require('@/assets/team/anuj.jpg'),
            img: require('@/assets/blog/blog6.jpg'),
            desc: `Introducing Parkspot Upsurge of Renters in Bengaluru's Affluent Areas 
                Standalone house rentals are gaining traction in Bengaluru's elite localities
                like HSR Layout, Koramangala.... `,
            time: 'Sep 5, 2023',
            dateTime: '2023-09-5',
            component: 'OrganismBlogBengaluruTenant',
        },
    ],
};
// getters
const getters = {
    getAllBlogs(state) {
        return state.blogs;
    },
    getBlogById: (state) => (id) => {
        console.log('store', id);
        return state.blogs.find((blog) => blog.id === id);
    },
};
// mutations
const mutations = {
    selectedBlog: (state, payload) => {
        return state.blogs.forEach((el) => {
            el.id === payload.id ? (el.flag = true) : (el.flag = false);
        });
    },
};

// actions
const actions = {
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
