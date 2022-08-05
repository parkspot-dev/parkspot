<template>
  <Wrapper>
    <div class="terms-container">
      <AtomHeading class="mb-6"> Terms and Conditions </AtomHeading>

      <AtomParagraph class="mb-3">
        Please read these terms and conditions carefully before using Our
        Service.
      </AtomParagraph>

      <div class="mb-3">
        <AtomParagraph :variation="'large'">
          TnC for Vehicle Owner(VO)
        </AtomParagraph>
        <ol class="pl-6">
          <li>
            <AtomParagraph>
              Following documents are needed for booking a parking spot.
            </AtomParagraph>

            <ul>
              <li>
                <AtomParagraph> a) Aadhar card. </AtomParagraph>
              </li>

              <li>
                <AtomParagraph> b) RC of the owned vehicle. </AtomParagraph>
              </li>

              <li>
                <AtomParagraph>
                  c) Picture of the car after parking on the spot.
                </AtomParagraph>
              </li>
            </ul>
          </li>

          <li>
            <AtomParagraph>
              Lacking any of the above documents will result in cancellation of
              the booking.
            </AtomParagraph>
          </li>

          <li>
            <AtomParagraph>
              Spot owners can cancel the booking with prior notice and the user
              has to move the parked vehicle within the allotted time, failing
              of which may result in a 300% hike of rent or can be towed.
            </AtomParagraph>
          </li>

          <li>
            <AtomParagraph>
              We are not responsible if something happens to parked vehicles.
              The best we can do is to refund the booking amount after proper
              investigation.
            </AtomParagraph>
          </li>
        </ol>
      </div>

      <div class="mb-3">
        <AtomParagraph :variation="'large'">
          TnC for Site Owner(SO)
        </AtomParagraph>
        <ol class="pl-6">
          <li>
            <AtomParagraph>
              We are not responsible if anything happens to SO’s spot. We can
              only try to investigate.
            </AtomParagraph>
          </li>

          <li>
            <AtomParagraph>
              SO will have to submit the following documents:-
            </AtomParagraph>

            <ul>
              <li>
                <AtomParagraph> a) Aadhar card. </AtomParagraph>
              </li>

              <li>
                <AtomParagraph>
                  b) Rent Agreement (If spot owner is using the spot as tenant)
                  Or House Ownership paper(If Spot is owned).
                </AtomParagraph>
              </li>
            </ul>
          </li>

          <li>
            <AtomParagraph>
              Lacking any of the given documents will result in removal of the
              parking spot from our platform.
            </AtomParagraph>
          </li>

          <li>
            <AtomParagraph>
              SO will have to handle the situation if VO’s vehicle get damaged.
              Parkspot will not be the part in such situations.
            </AtomParagraph>
          </li>

          <li>
            <AtomParagraph>
              SO will have to inform our ParkSpot 1 month earlier if he/she
              wants to cancel the ongoing booking.
            </AtomParagraph>
          </li>
        </ol>
      </div>

      <div class="mb-3">
        <AtomParagraph :variation="'large'"> Privacy: </AtomParagraph>
        <ol class="pl-6">
          <li>
            <AtomParagraph>
              We do not share any private information.</AtomParagraph
            >
          </li>
          <li>
            <AtomParagraph>
              App Permission : User will have to give camera permission to our
              app as this is used to scan booking QR code.</AtomParagraph
            >
          </li>
        </ol>
      </div>

      <div class="mb-3">
        <AtomParagraph :variation="'large'"> Refund :</AtomParagraph>
        <AtomParagraph>
          Only if booking cancelled within 15 days of booking or before parking
          start date (whichever is early).
        </AtomParagraph>
      </div>

      <div class="mb-3">
        <AtomParagraph :variation="'large'">
          Cancellation Policies :
        </AtomParagraph>
        <AtomParagraph>
          Cancellation request of the ongoing booking must be made in one month
          advance.
        </AtomParagraph>
      </div>

      <div class="mb-3">
        <AtomParagraph :variation="'large'">
          Changes to These Terms and Conditions :
        </AtomParagraph>
        <AtomParagraph>
          We reserve the right, at Our sole discretion, to modify or replace
          these Terms at any time.What constitutes a material change will be
          determined at Our sole discretion.By continuing to access or use Our
          Service after those revisions become effective, You agree to be bound
          by the revised terms. If You do not agree to the new terms, in whole
          or in part, please stop using the website and the Service.
        </AtomParagraph>
      </div>

      <AtomParagraph> Contact Us </AtomParagraph>
      <AtomParagraph>
        If you have any questions about these Terms and Conditions, You can
        contact us: By email:
        <a href="mailto:connect@parkspot.in"> connect@parkspot.in </a>
      </AtomParagraph>
    </div>
  </Wrapper>
</template>

<script>
import Wrapper from "../extras/Wrapper.vue";
import AtomHeading from "../atoms/AtomHeading.vue";
import AtomParagraph from "../atoms/AtomParagraph.vue";
export default {
  name: "TemplateTerms",
  components: {
    Wrapper,
    AtomHeading,
    AtomParagraph,
  },
};
</script>

<style scoped>
.terms-container {
  max-width: 960px;
  margin: auto;
}
</style>
