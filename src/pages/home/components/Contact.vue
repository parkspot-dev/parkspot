<template >
  <section class="pscontact">
    <div class="pscontact__title">
      <h2><b>Have Some Questions?</b></h2>
    </div>

    <div class="pscontact__body">
      <div class="pscontact__body-left">
        <div class="mail__logo">
          <img :src="mailLogo" alt="mail-logo.png" />
        </div>
        <div class="pscontact__text">
          <p>
            If you have any questions or just want to get in touch with us, use
            the form beside.<br> We are looking forward to hear from you!
          </p>
        </div>
      </div>
      <div class="pscontact__body-right">
        <form action="" @submit="post">
          <input class="pscontact__input" type="text" placeholder="Name"  required/>
          <input class="pscontact__input" type="email" placeholder="Email"  required/>
          <input
            class="pscontact__input"
            type="tel"
            placeholder="Contact No."
            required
          />
          <textarea
            class="pscontact__input"
            name=""
            id=""
            cols="30"
            rows="10"
            placeholder="Your Questions..."
          ></textarea>
          <button class="pscontact__button psbutton" >Submit</button>
        </form>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: "contact",
  data() {
    return {
      FullName: "",
      City: "",
      EmailID: "",
      Mobile: "",
      Comments: "",
      isContacted: false,
      mailLogo: require("@/assets/mail__logo.png"),
    };
  },
  methods: {
    post: function (e) {
      e.preventDefault();
      var isMweb = false;
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        isMweb = true;
      }
      var flavor = isMweb ? "mweb" : "dweb";
      console.log(flavor);
      this.isContacted = !this.isContacted;
      this.$http
        .post("https://maya.parkspot.in/contact", {
          User: {
            FullName: this.FullName,
            EmailID: this.EmailID,
            City: this.City,
            Mobile: this.Mobile,
          },
          Comments: this.Comments,
          Flavour: this.flavor,
        })
        .then(function (data) {
          console.log(data);
        });
    },
  },
};
</script>
<style scoped>

@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
* {
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
.pscontact {
  background-color: #ffdd57;
  padding: 2rem;
}
.pscontact__title {
  font-size: 2.2rem;
  margin-bottom: 2rem;
  font-weight: 700;
}

.pscontact__body-left {
  display: flex;
  flex-direction: column;
}

.mail__logo {
  font-size: 7rem;
}
.pscontact__text {
  margin-bottom: 2rem;
}
.pscontact__body-right {
  display: flex;
  flex-direction: column;
}
.pscontact__input {
  width: 100%;
  padding: 0.7rem;
  border-radius: 0.5rem;
  border: 1.5px solid #242329;
  outline: none;
  margin-bottom: 1.2rem;
  font-size: 1rem;
}
.pscontact__button {
  display: block;
  border: none;
  outline: none;
  margin-left: auto;
  width: 100%;
}
.psbutton {
  display: inline-block;
  background-color: #242329;
  color: #fff;
  padding: 0.5rem 2.5rem;
  font-weight: 400;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  
}
@media screen and (min-width: 768px) {
  .pscontact__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .pscontact__body-left,.pscontact__body-right  {
    margin: 2rem;
    flex: 1
  }
  
  .psbutton {
  padding: 0.5rem 2.5rem;
  font-size: 1.3rem;
  
}
  .mail__logo {
    font-size: 100px;
    margin: 0;
    padding: 0;
  }
  .pscontact__text >p{
      font-size: 20px;
      padding:0 4rem 4rem 4rem;
    }
}
</style>
