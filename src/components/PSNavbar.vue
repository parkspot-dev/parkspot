<template lang="pug">
    .PSContainer#topNav
      b-navbar
        template(slot='brand')
          //b-navbar-item(href="/")
            b-image(:src='`${minilogo.path}`' placeholder='ParkSpot')
        template(slot="start")
          //b-navbar-item(href="/")
            b-image(:src="`${minilogotext.path}`" placeholder="ParkSpot")
        template(slot='end')
          b-navbar-item(tag='div')
            .buttons
              b-navbar-item.button.is-dark
                strong Sign up
              b-navbar-item.button.is-warning(@click="cardModal()")
                strong Log in
      b-navbar.is-dark#mainNav
        template(slot="brand")
          b-navbar-item(href="/")
            | Home
        template(slot='end')
          b-navbar-item(href="#services")
            | Services
          b-navbar-item(href="#team")
            | Team
          b-navbar-item(href="#book")
            | Book
          b-navbar-item(href="#Rent")
            | Rent
          b-navbar-item(href="#faq")
            | FAQs
          b-navbar-item(href="#about")
            | About
          b-navbar-item(href="#contact")
            | Contact
</template>

<script>
import ModalForm from './ModalForm.vue';
var timer = setInterval(function(){
		var main = document.getElementById("mainNav")
		var height = document.getElementById("topNav").offsetHeight
		if(window.scrollY > height){
			main.classList.add("is-fixed-top")
		}
		else{
			main.classList.remove("is-fixed-top")	
		}
	}, 100)
export default {
  name: 'PSNavbar',
  methods: {
		cardModal() {
				console.log("hello")
                this.$buefy.modal.open({
                    parent: this,
                    component: ModalForm,
                    hasModalCard: true,
                    customClass: 'custom-class custom-class-2',
                    trapFocus: true
                })
    }
	},
	data: function(){
		return {
			minilogotext: {path: require("../assets/pstoptext.png")},
			minilogo: {path: require("../assets/pstopmini.png")}
		}
	}
};
</script>

<style scoped>
.is-dark{
	background: grey; 
}
#minitext {
  width: 10%;
}
</style>
