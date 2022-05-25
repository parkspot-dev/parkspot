<template>
  <div class="container">
    <div class="mainp">
      <br />
      <div class="content">
        <h1 class="is-size-2">Parking Challenges in Office Area</h1>
        <div id="authorDetails">
          <img class="round" :src="dp" alt="" />
          <p class="has-text-success is-size-6">Sujeet Kumar</p>
          <p class="has-text-dark is-size-6">Aug 5, 2021</p>
          <p class="has-text-dark is-size-6">5 min read</p>
          <p></p>
        </div>

        <hr />
        <img :src="blogimg" alt="Office Area" />
        <h1>Parking Challenges in Office Area</h1>
        <p>
          Parking has been a major concern in major cities. Due to fewer parking
          spaces, people have to spend a lot of time searching for the right
          spot. Another concern is the parking charges. Especially when it comes
          to Bangalore downtown, the charges are so high that it’s getting
          difficult day by day to afford to park there. In spite of these
          issues, the majority of people prefer driving to the workplace than
          using public transport. They feel it is much more convenient. They do
          not have to depend on the specific timings of public transport and can
          leave whenever they want to. Also, many of them have additional duties
          such as picking/ dropping their kids to school while coming to the
          office. So, having their own car helps in multitasking.
        </p>
        <br />
        <p>
          For some of the employees parking near the office has become an
          everyday challenge especially in cities like Bangalore. Some of these
          challenges include:
        </p>
        <h2>Parking Challenges:</h2>
        <ol>
          <li><p>Insufficient Parking spots.</p></li>
          <li>
            <p>
              No Parking option provided by offices, especially in downtowns.
            </p>
          </li>
          <li><p>Lack of spots for the clients and customers.</p></li>
          <li><p>Rule Violations.</p></li>
          <li><p>Inappropriate Parking ratio.</p></li>
          <li><p>A lot of time spent on finding a parking spot.</p></li>
        </ol>
        <br />
        <p>
          Though it would take time to resolve these issues, it’s always
          beneficial to take steps towards improvement. Some of the simple yet
          effective solutions are:
        </p>
        <h2>Solutions:</h2>
        <ol>
          <li>
            <p>
              Stacked Spaces: Parking cars one after the other in form of
              stacks. This would work if the one who has parked the car inside
              would leave later. But this can not be the case always. So,
              figuring out a method through which only those cars that leave
              later get parked inside can somehow help solve the parking issue
              and a lot more cars will get parked this way. This can be done
              through valley parking.
            </p>
          </li>
          <li>
            <p>
              Transportation Allowance: The company can help its employees by
              providing an allowance for public transport or uber. This will
              help in encouraging them to use public transport and avoid coming
              by personal car.
            </p>
          </li>
          <li>
            <p>
              Talk to your employees: Getting to know personal insights and
              feedback is very important. Speak to your employees on this, what
              challenges do they face, what solutions would help them in this
              situation.
            </p>
          </li>
          <li>
            <p>
              Using ParkSpot App: ParkSpot provides a digital parking solution.
              The app has an interactive map that provides real-time data and
              helps users find and book a parking spot. The best part is that
              this online solution is user friendly and free of cost. ParkSpot
              app is available on google play. Download the app for free and
              sign up. if you have any questions, just call at +91 80929 96057,
              or email at
              <a href="mailto:connect@parkspot.in">connect@parkspot.in</a>
            </p>
          </li>
        </ol>
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
  name: "Blog2",
  data() {
    return {
      dp: require("@/assets/img/blankProfile.png"),
      blogimg: require("@/assets/img/blog2.webp"),
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
