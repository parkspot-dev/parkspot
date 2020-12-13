<template lang="pug">
    .PSContainer#topNav
      b-navbar(id="top")
        template(slot='brand')
          b-navbar-item(tag="router-link" :to="{ path: '/' }")
            img(:src='`${minilogo.path}`' placeholder='ParkSpot' id="maximize")
        template(slot="start")
          b-navbar-item(tag="router-link" :to="{ path: '/' }")
            img(:src="`${minilogotext.path}`" placeholder="ParkSpot" id="maximize")
        template(slot='end')
          b-navbar-item(tag='div')
            .buttons(v-if="isLoggedIn()")
              b-navbar-item.button.is-warning(@click="logout()")
                strong Log Out
            .buttons(v-else)
              b-navbar-item.button.is-dark
                strong Sign Up
              b-navbar-item.button.is-warning(@click="cardModal()" @close="forceUpdate")
                strong Log In
      b-navbar.is-dark#mainNav
        template(slot='end')
          b-navbar-item(tag="router-link" :to="{ path: '/' }")
            | Home
          b-navbar-item(href="/#services")
            | Services
          b-navbar-item(href="/#team")
            | Team
          b-navbar-item(href="/#book")
            | Book
          b-navbar-item(href="/#contact")
            | Rent
          b-navbar-item(tag="router-link" :to="{ path: '/faq' }")
            | FAQs
          b-navbar-item(tag="router-link" :to="{ path: '/blog/eliminating-reason-for-traffic-jam' }")
            | Blog
          b-navbar-item(href="/#about")
            | About
          b-navbar-item(href="/#contact")
            | Contact Us
</template>

<script>
import ModalForm from '@/components/ModalForm.vue';
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
		updateComponent(){
			this.$forceUpdate()
		},
		logout(){
			localStorage.removeItem("PSToken")
			this.updateComponent()
		},
		cardModal() {
				console.log("hello")
                this.$buefy.modal.open({
                    parent: this,
                    component: ModalForm,
                    hasModalCard: true,
                    customClass: 'custom-class custom-class-2',
                    trapFocus: true
                })
    	},
		 isLoggedIn(){
			if(localStorage.getItem("PSToken") === null){
					console.log("no cookie")
					return false
			}
			else{
				console.log("cookie is ready to eat")
				return true
			}
		 }
	},
	data: function(){
		return {
			minilogotext: {path: require("@/assets/pstoptext.png")},
			minilogo: {path: require("@/assets/pstopmini.png")},
		}
	}
};
</script>

<style scoped>
.is-dark{
	background: #363636;
	color: #fff;
}
#minitext {
  width: 10%;
}
#top{
	height: 6rem;
}
#maximize{
	max-height: 4rem;
}
</style>
