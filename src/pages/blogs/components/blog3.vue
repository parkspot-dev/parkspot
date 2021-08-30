<template>
  <div class="container">
    <div class="mainp">
      <br />
      <div class="content">
        <h1 class="is-size-2">NO Parking</h1>
        <div id="authorDetails">
          <img class="round" :src="dp" alt="" />
          <p class="has-text-success is-size-6">Anonymous</p>
          <p class="has-text-dark is-size-6">Aug 30, 2021</p>
          <p class="has-text-dark is-size-6">5 min read</p>
          <p></p>
        </div>

        <hr />
        <img :src="blogimg" alt="" />
        <h1>NO Parking</h1>
        <p>
          Parking problems have always been an issue and this issue has grown
          exponentially with the increase of population. In order to tackle this
          issue, many solutions were tried and implemented. For example,
          commercial parkings were built where vehicle owners can pay and park
          their vehicles at hourly rates. With the increase of vehicles in an
          area, the demand for off-street parking also increased vigorously.
          Government made special rules like for every 1000 square feet of an
          area, there must be some particular number of parking spaces in that
          area.
        </p>
        <br />
        <p>
          In a recent survey, it is calculated that in a city of India,
          <mark>
            Bengaluru has only 13000 parking spaces for cars and 40000 for
            two-wheelers but Bengaluru has registered over 75 lakhs
            vehicles.</mark
          >
          Mostly the parking spaces are located in malls, hospitals, stadiums,
          etc which are mostly vacant as they are private parking and are
          allowed for only hourly parking and people usually don’t go to these
          places. It is calculated that on an average a vehicle owner needs
          three parking spaces for his/her vehicle. First at home, second at his
          workplace and the third if the user goes out somewhere. Now, a
          question arises, where would a person park his vehicle who usually
          does not go to these places. Mostly the
          <strong
            >people who could not find a parking spot, they illegally park their
            vehicle, at roadside, or wherever they find space where their
            vehicle can fit. Illegal parking results in vehicle tow, theft,
            damages, traffic congestions, etc.</strong
          >
        </p>
        <br />
        <p>
          It is assumed that people having their own house will have parking
          space. This is not exactly true. Two out of ten do not have parking
          space for their vehicles. This is because there are many apartments
          where parking spaces are not provided. After their home, people go to
          work and hence they would require a parking space for their vehicle
          but mostly the number of vehicles exceeds the space available at the
          office premises. So, employees have to come early in order to get a
          spot. Other than home and office, people go out to malls, markets, and
          many other places. Yes, malls could have parking spaces, but there are
          places like local market shops where people usually go but there are
          not proper parking spaces.
        </p>
        <br />
        <p>
          The parking issue is like something that can’t be completely resolved.
          We, ParkSpot, are trying to solve some of the parking issues to some
          extent by creating a smart parking system. Smart parking system does
          not mean that vehicles will automatically search a parking spot and
          drive by itself to the spot. Smart Parking System means that
          <strong
            >people can use a platform where people can search nearby parking
            spaces and check the availability and can even book a spot online in
            a few clicks
          </strong>
          , just like people buy movie tickets. People usually illegally park
          their vehicle because they don’t know where they can find a parking
          space that can let the person park his car to whatever duration the
          person wants to park. To resolve this issue, we have placed a search
          and booking option in our platform. As we went deeper into the issues,
          we found that there are a considerable amount of people who are
          desperately looking for parking space on a monthly basis. It means
          people own vehicles but don’t have their own parking space. As we went
          deeper to resolve this issue, we found that people are not getting
          parking spaces because there is a demand supply gap. People who have
          parking space but don’t have their vehicle can rent their parking
          space too just like people rent their flats, houses, etc. People are
          unaware that this can be a source of income where people don’t have to
          do any physical work.
        </p>
        <br />
        <p>
          As soon as the people get aware that they can rent their parking, the
          parking issue where people need it on a monthly basis can be resolved
          to some extent. Another solution could be the parking space of the
          malls, stadiums, etc. These spaces are mostly vacant, and can be used
          on non-busy days. This can profit both the parties, parking owners and
          the vehicle owners. Yes, it's true that these pre-existing parking
          spots can not handle the upcoming demands of the parking. Awareness is
          missing because we are mis-calculating the parking issue. The issues
          are bigger than what we have thought of it.
          <strong
            >If you have any such vacant parking spots, feel free to reach out
            to us.</strong
          >
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
  name: "blog3",
  data() {
    return {
      dp: require("@/assets/img/blankProfile.png"),
      blogimg: require("@/assets/img/blog3.jpg"),
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