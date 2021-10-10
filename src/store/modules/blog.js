

// states
const state = {
    check: 1,
    blogs: [
        {
            id: 1,
            postTitle: "Eliminating Traffic jams in India!",
            postImage:
                "https://www.stevenvanbelleghem.com/wp-content/uploads/2020/04/Heavy-rains-lash-Delhi-NCR-traffic-snarls-at-many-places.jpg",
            postSummary:
                "In the recent years all over the globe production and demand for motor vehicles has increased dramatically.Earlier motor vehicles...",
            flag: false
        },
        {
            id: 2,
            postTitle: "Parking Challenges in Office Area!",
            postImage: require("@/assets/img/blog2.jpg"),
            postSummary:
                "Parking has been a major concern in major cities. Due to fewer parking spaces, people have to spend a lot of time searching for the...",
            flag: false
        },
        {
            id: 3,
            postTitle: "NO Parking",
            postImage: require("@/assets/img/blog3.jpg"),
            postSummary:
                "Parking problems have always been an issue and this issue has grown exponentially with the increase of population. In order to tackl...",
            flag: false
        },
    ]
}
// getters

// mutations
const mutations = {
    selectedBlog: (state, payload) => {
        return state.blogs.forEach(el => {
            el.id === payload.id ? el.flag = true : el.flag = false
        });
    }
}


export default {
    namespaced: true,
    state,
    mutations,
}