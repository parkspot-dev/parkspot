<template>
  <div>
    <div id="fb-root"></div>
    <!-- Your Chat Plugin code -->
    <div
      class="fb-customerchat"
      attribution="install_email"
      page_id="114095200450184"
    ></div>
  </div>
</template>

<script>
const FB = window.FB;

export default {
  mounted() {
    window.fbAsyncInit = function () {
      FB.init({
        xfbml: true,
        version: "v10.0",
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  },
};
</script>
