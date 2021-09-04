<template>
  <section>
    <t-blog-landing :noOfBlog="noOfBlog" />
  </section>
</template>

<script>
import TBlogLanding from "../components/templates/t-blog-landing.vue";
export default {
  components: { TBlogLanding },
  name: "landing-blog",
  data() {
    return {
      // noOfBlog: 2,
      noOfBlog: [
        {
          id: 1,
          postTitle: "Eliminating Traffic jams in India!",
          postImage:
            "https://www.stevenvanbelleghem.com/wp-content/uploads/2020/04/Heavy-rains-lash-Delhi-NCR-traffic-snarls-at-many-places.jpg",
          postSummary:
            "In the recent years all over the globe production and demand for motor vehicles has increased dramatically. Earlier motor vehicles...",
        },
        {
          id: 2,
          postTitle: "Parking Challenges in Office Area!",
          postImage: require("@/assets/img/blog2.jpg"),
          postSummary:
            "Parking has been a major concern in major cities. Due to fewer parking spaces, people have to spend a lot of time searching for the...",
        },
      ],
    };
  },
};
</script>