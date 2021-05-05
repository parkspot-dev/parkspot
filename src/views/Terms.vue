<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Terms and Conditions</p>
        <button v-on:click="onTerm" class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body has-text-left">
        <!-- Content ... -->
        <p>
          Please read these terms and conditions carefully before using Our
          Service.
        </p>
        <h1>TNC for VO(Vehicle Owner)</h1>
        <ol>
          <li>
            <p>Following documents are needed for booking a parking spot.</p>
            <ul>
              <li><p>Aadhar card</p></li>
              <li><p>RC of the owned vehicle</p></li>
              <li><p>Picture of the car after parking on the spot</p></li>
            </ul>
          </li>
          <li>
            <p>
              Lacking any of the above documents will result in cancellation of
              the booking.
            </p>
          </li>
          <li>
            <p>
              We are not responsible if something happens to parked vehicles.
              The best we can do is to refund the booking amount after proper
              investigation.
            </p>
          </li>
          <li>
            <p>
              Spot owners can cancel the booking with prior notice and the user
              has to move the parked vehicle within the allotted time, failing
              of which may result in a 300% hike of rent or can be towed.
            </p>
          </li>
        </ol>
        <h1>TNC for SO(Site Owner)</h1>
        <ol>
          <li>
            <p>
              We are not responsible if anything happens to SO’s spot. We can
              only try to investigate
            </p>
          </li>
          <li>
            <p>SO will have to submit the following documents</p>
            <ul>
              <li><p>Aadhar Card</p></li>
              <li>
                <p>
                  Rent Agreement (If spot owner is using the spot as tenant) Or
                  House Ownership paper(If Spot is owned)
                </p>
              </li>
            </ul>
          </li>
          <li>
            <p>
              Lacking any of the given documents will result in removal of the
              parking spot from our platform.
            </p>
          </li>
          <li>
            <p>
              SO will have to handle the situation if VO’s vehicle get damaged.
              Parkspot will not be the part in such situations.
            </p>
          </li>
          <li>
            <p>
              SO will have to inform our ParkSpot 15 days earlier if he/she
              wants to cancel the ongoing booking.
            </p>
          </li>
        </ol>

        <h1>Changes to These Terms and Conditions</h1>
        <p>
          We reserve the right, at Our sole discretion, to modify or replace
          these Terms at any time.What constitutes a material change will be
          determined at Our sole discretion.
        </p>
        <p>
          By continuing to access or use Our Service after those revisions
          become effective, You agree to be bound by the revised terms. If You
          do not agree to the new terms, in whole or in part, please stop using
          the website and the Service.
        </p>
        <h1>Contact Us</h1>
        <p>
          If you have any questions about these Terms and Conditions, You can
          contact us:
        </p>
        <ul>
          <li>By email: connect@parkspot.in</li>
        </ul>
      </section>
      <footer class="modal-card-foot">
        <!-- <button class="button is-success">Save changes</button>
            <button class="button">Cancel</button> -->
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "Terms",
  methods: {
    onTerm() {
      this.$emit("is-term");
    },
  },
};
</script>