// states
const state = {
  blogs: [
    {
      id: "Eliminating-Traffic-jams-in-India",
      title: "Eliminating Traffic jams in India!",
      author: "Nikhil Surya Mukhi",
      img: "https://www.stevenvanbelleghem.com/wp-content/uploads/2020/04/Heavy-rains-lash-Delhi-NCR-traffic-snarls-at-many-places.jpg",
      desc: `In the recent years all over the globe production 
      and demand for motor vehicles has increased dramatically.
      Earlier motor vehicles...`,
      time: "Nov 2, 2020",
      dateTime: "2020-02-11",
    },
    {
      id: "Parking-Challenges-in-Office-Area",
      title: "Parking Challenges in Office Area!",
      author: "Sujeet Kumar",
      img: require("@/assets/img/blog2.jpg"),
      desc: `Parking has been a major concern in major cities. Due
      to fewer parking spaces, people have to spend a lot of time
      searching for the...`,
      time: "Aug 30, 2021",
      dateTime: "2021-30-07",
    },
    {
      id: "NO-Parking",
      title: "NO Parking",
      author: "Ishwar Kumar",
      img: require("@/assets/img/blog3.jpg"),
      desc: `Parking problems have always been an issue and this issue
      has grown exponentially with the increase of population.
      In order to tackl...`,
      time: "Aug 5, 2021",
      dateTime: "2021-05-07",
    },
  ],
};
// getters
const getters = {
  getAllBlogs(state) {
    return state.blogs;
  },
  getBlogById: (state) => (id) => {
    console.log("store", id);
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

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
