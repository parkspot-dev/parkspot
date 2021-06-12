<template>
  <section class="t_terms section">
    <div class="container">
      <!-- breadcrumb -->
      <nav class="breadcrumb has-arrow-separator is-size-7" aria-label="breadcrumbs">
        <ul>
          <li><atom-router-link :text="home" :link="hlink"/></li>
          <li class="is-active has-text-weight-semibold is-size-7">
            <a href="#" aria-current="page">Terms & Conditions</a>
          </li>
        </ul>
      </nav>
      <!-- terms content start from here -->
      <atom-b-title
        class="
          is-size-3-desktop is-size-4-mobile
          has-text-weight-semibold has-text-centered-mobile
        "
        :text="title"
      />
      <br />
      <atom-text class="is-size-6-desktop is-size-7-mobile" :text="firstLine" />
      <br />
      <atom-b-subtitle
        class="is-size-6-desktop is-size-7-mobile has-text-weight-semibold"
        :text="vehicleOwner"
      />
      <ol>
        <li>
          <atom-text
            class="is-size-6-desktop is-size-7-mobile"
            :text="vpoint1"
          />
          <ul>
            <li>
              <atom-text
                class="is-size-6-desktop is-size-7-mobile"
                :text="vsubpoint1"
              />
            </li>
            <li>
              <atom-text
                class="is-size-6-desktop is-size-7-mobile"
                :text="vsubpoint2"
              />
            </li>
            <li>
              <atom-text
                class="is-size-6-desktop is-size-7-mobile"
                :text="vsubpoint3"
              />
            </li>
          </ul>
        </li>
        <li>
          <atom-text
            class="is-size-6-desktop is-size-7-mobile"
            :text="vpoint2"
          />
        </li>
        <li>
          <atom-text
            class="is-size-6-desktop is-size-7-mobile"
            :text="vpoint3"
          />
        </li>
        <li>
          <atom-text
            class="is-size-6-desktop is-size-7-mobile"
            :text="vpoint4"
          />
        </li>
      </ol>
      <br />
      <atom-b-subtitle
        class="is-size-6-desktop is-size-7-mobile has-text-weight-semibold"
        :text="siteOwner"
      />
      <ol>
        <li>
          <atom-text
            class="is-size-6-desktop is-size-7-mobile"
            :text="spoint1"
          />
        </li>
        <li>
          <atom-text
            class="is-size-6-desktop is-size-7-mobile"
            :text="spoint2"
          />
          <ul>
            <li>
              <atom-text
                class="is-size-6-desktop is-size-7-mobile"
                :text="ssubpoint1"
              />
            </li>
            <li>
              <atom-text
                class="is-size-6-desktop is-size-7-mobile"
                :text="ssubpoint2"
              />
            </li>
            <li>
              <atom-text
                class="is-size-6-desktop is-size-7-mobile"
                :text="ssubpoint3"
              />
            </li>
          </ul>
        </li>
        <li>
          <atom-text
            class="is-size-6-desktop is-size-7-mobile"
            :text="spoint3"
          />
        </li>
        <li>
          <atom-text
            class="is-size-6-desktop is-size-7-mobile"
            :text="spoint4"
          />
        </li>
        <li>
          <atom-text
            class="is-size-6-desktop is-size-7-mobile"
            :text="spoint5"
          />
        </li>
      </ol>
      <br />
      <div class="columns is-mobile">
        <div class="column is-narrow">
          <atom-b-subtitle
            class="is-size-6-desktop is-size-7-mobile has-text-weight-semibold"
            :text="privacy"
          />
        </div>
        <div class="column">
          <atom-text
            class="is-size-6-desktop is-size-7-mobile"
            :text="privacyLine"
          />
        </div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-narrow">
          <atom-b-subtitle
            class="is-size-6-desktop is-size-7-mobile has-text-weight-semibold"
            :text="refund"
          />
        </div>
        <div class="column">
          <atom-text
            class="is-size-6-desktop is-size-7-mobile"
            :text="refundLine"
          />
        </div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-narrow">
          <atom-b-subtitle
            class="is-size-6-desktop is-size-7-mobile has-text-weight-semibold"
            :text="cancellation"
          />
        </div>
        <div class="column">
          <atom-text
            class="is-size-6-desktop is-size-7-mobile"
            :text="cancelLine"
          />
        </div>
      </div>
      <atom-b-subtitle
        class="is-size-6-desktop is-size-7-mobile has-text-weight-semibold"
        :text="changes"
      />
      <atom-text
        class="is-size-6-desktop is-size-7-mobile"
        :text="changesLine"
      />
      <br />
      <p class="is-size-6-desktop is-size-7-mobile">Contact Us</p>
      <p class="is-size-6-desktop is-size-7-mobile">
        If you have any questions about these Terms and Conditions, You can
        contact us:
        <span
          >By email:<a href="mailto: connect@parkspot.in">
            connect@parkspot.in</a
          ></span
        >
      </p>
    </div>
  </section>
</template>

<script>
import AtomRouterLink from '../atoms/atom-link/atom-router-link.vue';
import AtomBSubtitle from "../atoms/atom-text/atom-b-subtitle.vue";
import atomBTitle from "../atoms/atom-text/atom-b-title.vue";
import AtomText from "../atoms/atom-text/atom-text.vue";
export default {
  components: { atomBTitle, AtomText, AtomBSubtitle, AtomRouterLink },
  name: "t-terms",
  data() {
    return {
      home:"Home",
      hlink:"Home",
      title: "Terms and Conditions",
      firstLine:
        "Please read these terms and conditions carefully before using Our Service.",
      vehicleOwner: "TnC for Vehicle Owner(VO)",
      vpoint1: "Following documents are needed for booking a parking spot.",
      vsubpoint1: "a) Aadhar card",
      vsubpoint2: "b) RC of the owned vehicle",
      vsubpoint3: "c) Picture of the car after parking on the spot",
      vpoint2:
        "Lacking any of the above documents will result in cancellation of the booking.",
      vpoint4:
        "We are not responsible if something happens to parked vehicles. The best we can do is to refund the booking amount after proper investigation.",
      vpoint3:
        "Spot owners can cancel the booking with prior notice and the user has to move the parked vehicle within the allotted time, failing of which may result in a 300% hike of rent or can be towed.",
      siteOwner: "TnC for Site Owner(SO)",
      spoint1:
        "We are not responsible if anything happens to SO’s spot. We can only try to investigate.",
      spoint2: "SO will have to submit the following documents:-",
      ssubpoint1: "a) Aadhar Card",
      ssubpoint2:
        "b) Rent Agreement (If spot owner is using the spot as tenant) Or House Ownership paper(If Spot is owned).",
      spoint3:
        "Lacking any of the given documents will result in removal of the parking spot from our platform.",
      spoint4:
        "SO will have to handle the situation if VO’s vehicle get damaged. Parkspot will not be the part in such situations.",
      spoint5:
        "SO will have to inform our ParkSpot 1 month earlier if he/she wants to cancel the ongoing booking.",
      privacy: "Privacy:",
      privacyLine: "We do not share any private information.",
      refund: "Refund :",
      refundLine:
        " Only if booking cancelled within 15 days of booking or before parking start date (whichever is early).",
      cancellation: "Cancellation Policies :",
      cancelLine:
        "Cancellation request of the ongoing booking must be made in one month advance.",
      changes: "Changes to These Terms and Conditions :",
      changesLine:
        "We reserve the right, at Our sole discretion, to modify or replace these Terms at any time.What constitutes a material change will be determined at Our sole discretion.By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.",
    };
  },
};
</script>

<style scoped>
.column {
  padding-inline-end: 0;
}
.t_terms {
  background: #f6f6f6;
}
.t_terms{
  padding-top: 15px;
}
</style>
