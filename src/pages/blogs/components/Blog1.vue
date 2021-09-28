<template>
  <div class="container">
    <div class="mainp">
      <br />
      <div class="content">
        <h1 class="is-size-2">Eliminating Traffic jams in India!</h1>
        <div id="authorDetails">
          <img class="round" :src="dp" alt="" />
          <p class="has-text-success is-size-6">Nikhil Surya Mukhi</p>
          <p class="has-text-dark is-size-6">Nov 2, 2020</p>
          <p class="has-text-dark is-size-6">5 min read</p>
          <p></p>
        </div>

        <hr />
        <img :src="blogimg" alt="" />
        <<<<<<< HEAD
        <h1>Eliminating Traffic jams in India!</h1>
        =======
        <h1>Parking Challenges in Office Area</h1>
        >>>>>>> master
        <p>
          In the recent years all over the globe production and demand for motor
          vehicles has increased dramatically. Earlier motor vehicles were a
          luxury only few can afford but now their prices have plummeted and its
          more easily available to the population. India for an example took
          about 60 years to acquire 100 million vehicles and the next 100
          million vehicles were bought in the last 10 years !
        </p>
        <br />
        <p>
          This sheer increase in vehicles has caused a strain on the roadways
          and parking infrastructure. Having such a high population and vehicle
          density in India only makes things worse. These problems elevate the
          risk of traffic jams in urban cities. With Bengaluru facing the worst
          traffic congestion in the world, Delhi, Mumbai and Pune remain in the
          top 10 source traffic congestion index.
        </p>
        <h2>What causes a traffic jam ?</h2>
        <p>
          There a numerous reasons for traffic jams like lack of proper
          infrastructure, office rush hours, illegal parkings and many more.
          Improper parkings beside roads/no parking zones are he main cause for
          traffic jams. Even the widest of roads have traffic jams because of
          illegal parkings. Widening the ones which face traffic jams are not so
          rewarding because empty roads means more room for people to park
          vehicles. Inadequate parking infrastructure is the reason to blame
          when people park their vehicles in no parking zones. Absence of a
          proper inventory for parking sites and the lack of awareness is the
          root of the cause.
        </p>
        <h2>How can a smart parking platform help ?</h2>
        <p>
          A smart parking system allows people to search and book a secure
          parking spot. This two features to search and book will allow people
          to plan where they park their vehicle in a secure parking zone. These
          two features can curb the problem of traffic jams. Car parking systems
          are equipped with smart sensors and devices which make the parking
          experience seamless which users will flock to experience.
        </p>
        <h2>The new normal and how ParkSpot helps the cause.</h2>

        <p>
          The COVID-19 pandemic shed light upon the problems in our day to day
          habits which aids in transmission of diseases. Social distancing,
          wearing of masks and hand sanitation have become a new normal withing
          our society. People are distancing themselves from other people.
          ParkSpot is a smart parking platform which allows users to search and
          book secure parking spots for long and short term. ParkSpot gives
          users a seamless and contact-less experience which users are searching
          for after the corona outbreak. ParkSpot also allow users to list out
          their free parking space into our platform which other users finding
          for a parking space can use. This will help our weak parking
          infrastructure in the battle to curb traffic congestion.
        </p>
        <br />
        <p>
          Join hands with ParkSpot and help us win this fight against traffic
          jams
        </p>

        <br />
        <img :src="parkspotimg" alt="" />
        <p>
          Let us know if you also have similar parking issues, and what solution
          would you like to recommend to your office. You can write to us at
          <a href="mailto:connect@parkspot.in">connect@parkspot.in</a>
        </p>
        <br />
        <br />
      </div>
    </div>
  </div>
</template>

  
  <script>
export default {
  name: "Blog1",
  data() {
    return {
      dp: require("@/assets/team/nik.jpg"),
      blogimg:
        "https://www.stevenvanbelleghem.com/wp-content/uploads/2020/04/Heavy-rains-lash-Delhi-NCR-traffic-snarls-at-many-places.jpg",
      parkspotimg: require("@/assets/img/pstopmini.png"),
    };
  },
};
</script>
<style scoped>
.round {
  width: 10%;
  height: 10%;
  border-radius: 50%;
}
#authorDetails {
  display: flex;
  width: 50%;
  align-items: center;
  justify-content: space-around;
}
.mainp {
  margin: 0 auto;
  width: 80%;
}
</style>