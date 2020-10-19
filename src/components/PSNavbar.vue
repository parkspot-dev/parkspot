<template lang="pug">
    .PSContainer
        b-navbar#topNav
          template(slot='brand')
            b-navbar-item(href="/")
              img(:src='`${minilogo.path}`' alt='ParkSpot')
            b-navbar-item(href="/")
              p.is-size-4.is-black
                | ParkSpot
        b-navbar.is-dark#mainNav
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
	data: function(){
		return {
			minilogo: {path: require("../assets/mini.png")}
		}
	}
};
</script>

<style scoped>
.is-dark{
	background: grey; 
}
</style>
